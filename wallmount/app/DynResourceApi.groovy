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
    
    def findPlatforms() {
        def ret = []
        def plats = resourceHelper.findAllPlatforms()
        plats.each{
            def plat = [:]
            plat['eid'] = '1:' + it.instanceId
            plat['name'] = it.name
            ret << plat
        }
        ret
    }
    
    private resourceHelperInternal = null
    protected ResourceHelper getResourceHelper() {
        if (resourceHelperInternal == null) {
            resourceHelperInternal = new ResourceHelper(user)
        }
        resourceHelperInternal
    }

}