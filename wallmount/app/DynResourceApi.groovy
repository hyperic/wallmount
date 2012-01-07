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

import org.hyperic.hq.hqu.rendit.helpers.ResourceHelper
import org.hyperic.hq.authz.server.session.AuthzSubject
import org.hyperic.hq.authz.shared.AuthzConstants
import org.hyperic.util.pager.PageControl
import org.hyperic.hq.context.Bootstrap
import org.hyperic.hq.appdef.shared.PlatformManager
import org.hyperic.hq.appdef.shared.ServerManager
import org.hyperic.hq.appdef.shared.ServiceManager
import org.hyperic.hq.appdef.shared.AppdefUtil
import org.hyperic.hq.measurement.shared.MeasurementManager
import org.hyperic.hq.appdef.shared.AppdefEntityID

/**
 * Custom api for accessing resources from HQ's other public and
 * private api's.
 * 
 * Instead of allowing dynamic teplate dsl files directly to use
 * api's exposed by HQ we use middleware api's which return content
 * most suiteable by dsl usage.
 */
class DynResourceApi {
    
    private AuthzSubject user
    private PlatformManager platformManager
    private MeasurementManager measurementManager
    private ServerManager serverManager
    private ServiceManager serviceManager
    
    public DynResourceApi(user, platformManager, measurementManager, serverManager, serviceManager) {
        this.user = user
        this.platformManager = platformManager
        this.measurementManager = measurementManager
        this.serverManager = serverManager
        this.serviceManager = serviceManager
    }
    
    /**
     * Returns all platforms.
     * 
     * @return Returns a list of maps containing title and eid.
     */
    def getAllPlatforms() {
        def ret = []
        def plats = resourceHelper.findAllPlatforms()
        plats.each{
            ret << [eid: '1:' + it.instanceId, title: it.name]
        }
        ret
    }

    /**
     * Gets platforms.
     * 
     * Map keys:
     * fqdn     - Search by fully qualified domain name
     * name     - Search by a platform name
     * 
     * @return Returns a list of maps containing title and eid.
     */
    def getPlatforms(map) {
        def ret = []
        
        if(map.containsKey("fqdn")) {
            def resource = resourceHelper.find(byFqdn:map.fqdn)
            if(resource != null) {
                ret << [title: resource.name, eid:AppdefUtil.newAppdefEntityId(resource).toString()]
            }
        }

        if(map.containsKey("name")) {
            def resource = resourceHelper.find(platform:map.name)
            if(resource != null) {
                ret << [title: resource.name, eid:AppdefUtil.newAppdefEntityId(resource).toString()]
            }
        }

        ret
    }

    /**
     * Gets resources by a resource type name.
     * 
     * @param name Name of the resource type
     * 
     * @return Returns a list of maps containing title and eid.
     */
    def getResourcesByPrototype(name) {
        def ret = []
        def resources = resourceHelper.find(byPrototype:name)
        resources.each{
            ret << [title: it.name, eid:AppdefUtil.newAppdefEntityId(it).toString()]
        }
        ret
    }

    /**
     * Gets platform resource types
     * 
     * Map keys:
     * viewable - If true return only existing and allowed types,
     *            if false return all types.
     *            
     * @return Returns a list of maps containing title and tracks.
     */
    def getPlatformPrototypes(map) {
        def ret = []

        if(map.get("viewable", true)) {
            platformManager.getViewablePlatformTypes(user, PageControl.PAGE_ALL).each{
                ret << [title: it.name, tracks:[[id:"1:" + it.id, scope:"tavail/"]]]
            }    
        } else {
            platformManager.getAllPlatformTypes(user, PageControl.PAGE_ALL).each{
                ret << [title: it.name, tracks:[[id:"1:" + it.id, scope:"tavail/"]]]
            }
        }

        ret
    }
        
    /**
     * Gets resource types
     * 
     * Map keys:
     * name     - Name of the resource type. Either single String or
     *            a list of Strings.
     *            
     * @return Returns a list of maps containing title and tracks.
     */
    def getResourcePrototypes(map) {
        def ret = []
        def names = (map.name instanceof java.util.List) ? map.name : map.get("name",[])
        names.each{
            def resource = resourceHelper.find(prototype:it)
            if(resource != null)
                ret << [title: resource.name, tracks:[[id:resourceProtoToEid(resource), scope:"tavail/"]]]
        }
        ret
    }

    /**
     * Gets system metrics.
     * 
     * Map keys:
     * category - Limit metrics to category. Possible values are 
     *            system_sysloadavg, system_syscpu, system_hq,
     *            system_sysmem, system_sysswap, system_proc,
     *            system_jvm.
     * name     - Regex filtering based on name of the metric.
     * 
     * @param map Parameter map to define what will be returned
     * 
     * @return Returns a list of maps containing title, tracks and format.
     */
    def getSystemMetrics(map) {
        def ret = []
        
        def range
        switch(map['category']) {
            case 'system_sysloadavg': range = 0..0; break; 
            case 'system_syscpu': range = 1..1; break; 
            case 'system_hq': range = 2..2; break;
            case 'system_sysmem': range = 3..3; break;
            case 'system_sysswap': range = 4..4; break;
            case 'system_proc': range = 5..5; break;
            case 'system_jvm': range = 6..6; break;
            default: range = 0..6;
        }

        def pattern = map.containsKey("name") ? map.name : '.+'
        
        StatUtil.sysMetricMap[range].each{
            it.childs.each{
                if(it.name =~ pattern)
                    ret << [title:it.name, tracks:[[id:it.track, scope:it.scope]], format: it.format != null ? it.format : "none"]
            }
        }
        
        ret
    }

    
    /**
     * Gets metrics.
     *
     * Map keys:
     * resource - A map representing a resource.
     * name     - Name of the metric.
     *
     * @return Returns a list of maps containing title, mid and format.
     */
    def getMeasurements(map) {
        def ret = []
        
        def pattern = map.containsKey("name") ? map.name : '.+'
        
        if(map.resource && map.resource.eid) {
            measurementManager.findMeasurements(user, new AppdefEntityID(map.resource.eid), null, PageControl.PAGE_ALL).each{
                if(it.template.name =~ pattern)
                    ret << [title: it.template.name, format: it.template.units, mid: it.id]
            }
        }
         
        ret
    }

    /**
     * Gets server resources.
     *
     * Map keys:
     * resource - A map representing a platform resource.
     * name     - A Server name to find
     *
     * @return Returns a list of maps containing title and eid.
     */
    def getServers(map) {
        def ret = []
        
        def platId = map.resource.eid[2..-1] as Integer
        
        def pattern = map.containsKey("name") ? map.name : '.+'
        
        serverManager.getServersByPlatform(user, platId, true, PageControl.PAGE_ALL).each{
            if(it.name =~ pattern)
                ret << [title: it.name, eid: it.entityId.toString()]
        }
        
        ret
    }

    /**
     * Gets service resources.
     *
     * Map keys:
     * resource - A map representing a server resource.
     * name     - A Service name to find
     *
     * @return Returns a list of maps containing title and eid.
     */
    def getServices(map) {
        def ret = []
        
        def serverId = map.resource.eid[2..-1] as Integer
        
        def pattern = map.containsKey("name") ? map.name : '.+'
        
        serviceManager.getServicesByServer(user, serverId, PageControl.PAGE_ALL).each{
            if(it.name =~ pattern)
                ret << [title: it.name, eid: "3:" + it.id]
        }
        
        ret
    }

    /**
     * Gets resources.
     *
     * Map keys:
     * resource - A map representing a platform resource.
     * name     - A Server name to find
     *
     * @return Returns a list of maps containing title and eid.
     */
    def getPlatformServices(map) {
        def ret = []
        
        def platId = map.resource.eid[2..-1] as Integer
        
        def pattern = map.containsKey("name") ? map.name : '.+'
        
        serviceManager.getPlatformServices(user, platId).each{
            if(it.name =~ pattern)
                ret << [title: it.name, eid: "3:" + it.id]
        }
        
        ret
    }

        
    private String resourceProtoToEid(res) {
        def id = res.resourceType.id
        def ret
        switch(id) {
            case AuthzConstants.authzPlatformProto: ret = "1:"; break;
            case AuthzConstants.authzServerProto: ret = "2:"; break;
            case AuthzConstants.authzServiceProto: ret = "3:"; break;
        }
        ret + res.instanceId
    }
    
    private resourceHelperInternal = null
    protected ResourceHelper getResourceHelper() {
        if (resourceHelperInternal == null) {
            resourceHelperInternal = new ResourceHelper(user)
        }
        resourceHelperInternal
    }
    
    
}