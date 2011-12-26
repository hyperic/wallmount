import org.hyperic.hq.appdef.shared.AppdefEntityConstants;

/**
 * NOTE: This copyright does *not* cover user programs that use HQ
 * program services by normal system calls through the application
 * program interfaces provided as part of the Hyperic Plug-in Development
 * Kit or the Hyperic Client Development Kit - this is merely considered
 * normal use of the program, and does *not* fall under the heading of
 *  "derived work".
 *
 *  Copyright (C) [2011], VMware, Inc.
 *  This file is part of HQ.
 *
 *  HQ is free software; you can redistribute it and/or modify
 *  it under the terms version 2 of the GNU General Public License as
 *  published by the Free Software Foundation. This program is distributed
 *  in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 *  even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 *  PARTICULAR PURPOSE. See the GNU General Public License for more
 *  details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 *  USA.
 *
 */

import org.json.JSONArray
import org.json.JSONObject
import org.hyperic.hq.appdef.shared.AppdefEntityID
import org.hyperic.hq.appdef.shared.AppdefEntityTypeID
import org.hyperic.hq.events.AlertSeverity
import org.hyperic.hq.events.server.session.AlertSortField
import org.hyperic.hibernate.PageInfo
import org.hyperic.util.pager.PageControl
import org.hyperic.hq.measurement.server.session.Measurement
import org.hyperic.hq.appdef.shared.AppdefEntityConstants
import org.hyperic.hq.appdef.shared.AppdefUtil

/**
 * Controller to handle metric requests from wallmount metric store.
 * 
 * Requests from wallmount components doesn't ever come directy
 * to HQU backend. Data is always requested through local dojo
 * store which is able to handle caching and provide more wisdom 
 * when data needs to be fetched.
 * 
 * Base URI for this controller is /hqu/wallmount/metricstore/getMetrics.hqu.
 * 
 * getMetrics method is using one parameter named "scope" which defines
 * what kind of data the requester wants to receive.
 */
class MetricstoreController extends BaseJSONController {
    
    /**
     * Returns requested metrics.
     */
    def getMetrics(params) {
        def scope = params.getOne('scope')
        def scopes = scope.split('/')
        JSONArray array = new JSONArray()
        
        if(scopes[0] == 'metric') {
            def scaleId = scopes[1] as int
            def ms
            def tids = scopes[2].split('[|]')
            def tid = tids[0] as int;
            if (tids.size() > 1) {
              def eid = new AppdefEntityID(tids[1])
              if (eid.group) {
                def res = resourceManager.findResource(eid)
                def ress = resourceGroupManager.getMembers(resourceGroupManager.getResourceGroupByResource(res));
                ms = measurementManager.findMeasurements(user, tid, ress.collect { new AppdefEntityID(it.resourceType.appdefType, it.getInstanceId())} as AppdefEntityID[])
              }
            } else {
              ms = [measurementManager.getMeasurement(tid)]
            }
            def lastData = ms.collect { it.lastDataPoint.value }
            if(scaleId == 0) {
                array.put(id: scopes[2], last: lastData.sum()/lastData.size())
            } else {
                def timeScale = scaleId * 60 * 1000.0 as long
                def histData = getHistoricalData(ms, timeScale)
                def data = []
                histData.each{
                    data.push(x:it.timestamp, y:it.value)
                }
                array.put(id: scopes[2], last: lastData.sum()/lastData.size(), serie:data)
            }
        } else if(scopes[0] == 'ravail') {
            def eid = new AppdefEntityID(scopes[1])
            def res = resourceManager.findResource(eid)
            def ress;
            def lress;
            if (eid.group) {
                ress = []
                resourceGroupManager.getMembers(resourceGroupManager.getResourceGroupByResource(res)).each{
                    ress << it.resourceType.appdefType + ":" + it.instanceId
                }
              lress = resourceGroupManager.getMembers(resourceGroupManager.getResourceGroupByResource(res));
            } else {
              ress = [eid.toString()];
              lress = [res];
            }
            def last = lress.collect { availabilityManager.getAvailMeasurement(it).lastDataPoint.value }.min()
            
            def resAlertCount = resourcesWithUnfixedAlerts()
            resAlertCount.keySet().retainAll(ress)
            def alertCount = resAlertCount.values().size() > 0 ? resAlertCount.values().sum() : 0
            
            def resEscCount = resourcesWithRunningEscalation()
            resEscCount.keySet().retainAll(ress)
            def escCount = resEscCount.values().size() > 0 ? resEscCount.values().sum() : 0 
            
            array.put(id: scopes[1], last: last, alerts:alertCount, escalations:escCount)
        } else if(scopes[0] == 'tavail') {
            // tavail/1:10100
            // one id means global
            // tavail/1:10607/3:10106
            // two id's means latter within former (e.g. all CPUs within a platform)
        
            def aeid = scopes[-1]
            def within = (scopes[-2] == 'tavail' ? null : scopes[-2])
            
            // get resources
            
            def resources = []
            log.info("aeid:"+aeid)
            log.info("within:"+within)
            def proto = resourceManager.findResourcePrototype(new AppdefEntityTypeID(aeid))
            log.info("proto:"+proto)
            if(within == null) {
                // we're in global mode
                resources = resourceManager.findResourcesOfPrototype(proto, PageInfo.getAll(AlertSortField.RESOURCE, true))
                log.info("resources1:"+resources)
            } else {
                def eid = new AppdefEntityID(within)
                if(eid.isPlatform() && aeid.startsWith("3:")) {
                    def plat = resourceManager.findResource(eid)
                    log.info("plat.id1:"+plat.id)
                    log.info("plat.id2:"+eid.id)
                    def tId = new AppdefEntityTypeID(aeid).id
                    log.info("tId:"+tId)
                    
                    def serviceValues = serviceManager.getPlatformServices(user, eid.id, tId, PageControl.PAGE_ALL)
                    serviceValues.each{
                        resources << resourceManager.findResource(it.entityId)
                    }
                    log.info("resources2:"+resources)
                } else if(eid.isPlatform() && aeid.startsWith("2:")) {
                
                    def tId = new AppdefEntityTypeID(aeid).id
                    log.info("tId:"+tId)
                    def serverValues = serverManager.getServersByPlatform(user, eid.id, tId, true, PageControl.PAGE_ALL)
                    serverValues.each{
                        resources << resourceManager.findResource(it.entityId)
                    }
                    log.info("resources3:"+resources)
                    
                } else if(eid.isServer() && aeid.startsWith("3:")) {
                    def tId = new AppdefEntityTypeID(aeid).id
                    log.info("tId:"+tId)
                    def serviceValues = serviceManager.getServicesByServer(user, eid.id,tId ,PageControl.PAGE_ALL)
                    log.info("serviceValues:"+serviceValues)
                    serviceValues.each{
                        resources << resourceManager.findResource(it.entityId)
                    }
                    log.info("resources4:"+resources)
                }
            }
            resources.each{
                log.info("class:"+it.class)
            }

            // avails for resources
            def last = null
            def avails = availabilityManager.getLastAvail(resources,null) 
            avails.each{ key, value ->
                if(last==null) {
                    last = value.value
                } else if(last < value.value) {
                   last = value.value
                }
            }
            
            def ress = []
            resources.each{
                ress << AppdefUtil.newAppdefEntityId(it).toString()
            }

            def resAlertCount = resourcesWithUnfixedAlerts()
            resAlertCount.keySet().retainAll(ress)
            def alertCount = resAlertCount.values().size() > 0 ? resAlertCount.values().sum() : 0
                        
            def resEscCount = resourcesWithRunningEscalation()
            resEscCount.keySet().retainAll(ress)
            def escCount = resEscCount.values().size() > 0 ? resEscCount.values().sum() : 0
            
            
            array.put(id: aeid, last: last, alerts:alertCount, escalations:escCount)
        }
        
        render(inline:"${array}", contentType:'text/json-comment-filtered')
    }
    
    /**
     * 
     */
    protected getHistoricalData(List<Measurement> ms, long timeScale) {
        def now = System.currentTimeMillis()        
        return dataManager.getHistoricalData(ms, now - timeScale , now, (timeScale / 100) as long, 0, false, PageControl.PAGE_ALL)
    }
    
    /**
     * 
     */
    protected resourcesWithUnfixedAlerts() {
        
        def resAlertCount = [:]
        def severity = AlertSeverity.findByCode(1)
        def alerts = alertHelper.findAlerts(severity, 1232386080468, System.currentTimeMillis(),
                                            false, true, null,
                                            PageInfo.getAll(AlertSortField.RESOURCE, true))
        alerts.each{
            def r = it.alertDefinition.resource
            def eid = r.resourceType.appdefType + ":" + r.instanceId
            if(resAlertCount.containsKey(eid)) {
                (resAlertCount[eid])++
            } else {
                resAlertCount[eid] = 1
            }
        }
        
        resAlertCount
    }
    
    /**
     * 
     */
    protected resourcesWithRunningEscalation() {
        def resEscCount = [:]
        
        def escStates = escalationManager.getActiveEscalations(10)
        
        escStates.each{
            def aDefId = it.alertDefinitionId
            def aDef = alertDefinitionManager.getByIdAndCheck(user, aDefId)
            def eid = aDef.appdefEntityId.toString()
            
            if(resEscCount.containsKey(eid)) {
                (resEscCount[eid])++
            } else {
                resEscCount[eid] = 1
            }

        }
        
        resEscCount
    }
        
    
}