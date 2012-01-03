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
    
    public DynResourceApi(user) {
        this.user = user
    }
    
    /**
     * Returns all platforms.
     */
    def getAllPlatforms() {
        def ret = []
        def plats = resourceHelper.findAllPlatforms()
        plats.each{
            ret << [eid: '1:' + it.instanceId, title: it.name]
        }
        ret
    }

    public Map getPlatform(String fqdn) {
        def ret = [:]
        ret
    }

    public List getResourcesByPrototype(String fqdn) {
        def ret = []
        ret
    }

    def getMetrics(map) {
        def ret = []
        ret
    }

    def getResources(map) {
        def ret = []
        ret
    }

    /**
     * Returns resource types
     * 
     * Map keys:
     * name     - Name of the resource type. Either single String or
     *            a list of Strings.
     */
    def getResourcePrototype(map) {
        def ret = []
        def resource = resourceHelper.find(prototype:map.name)
        ret << [title: resource.name, tracks:[[id:resourceProtoToEid(resource), scope:"tavail/"]]]
        ret
    }

    /**
     * Returns system metrics.
     * 
     * Map keys:
     * category - Limit metrics to category. Possible values are 
     *            system_sysloadavg, system_syscpu, system_hq,
     *            system_sysmem, system_sysswap, system_proc,
     *            system_jvm.
     * name     - More filtering based on name of the metric.
     * 
     * @param map Parameter map to define what will be returned
     * 
     * @return Returns a list of maps containing title and tracks.
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