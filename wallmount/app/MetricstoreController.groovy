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
import org.hyperic.hq.events.AlertSeverity
import org.hyperic.hq.events.server.session.AlertSortField
import org.hyperic.hibernate.PageInfo
import org.hyperic.util.pager.PageControl
import org.hyperic.hq.measurement.server.session.Measurement

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
            if (eid.group) {
              ress = resourceGroupManager.getMembers(resourceGroupManager.getResourceGroupByResource(res));
            } else {
              ress = [res];
            }
            def last = ress.collect { availabilityManager.getAvailMeasurement(it).lastDataPoint.value }.min()
            
            def resAlertCount = resourcesWithUnfixedAlerts()
            resAlertCount.keySet().retainAll(ress)
            def alertCount = resAlertCount.values().sum()

            def resEscCount = resourcesWithRunningEscalation()
            resEscCount.keySet().retainAll(ress)
            def escCount = resEscCount.values().sum();

            array.put(id: scopes[1], last: last, alerts:alertCount, escalations:escCount)
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