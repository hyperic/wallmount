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

import org.springframework.core.io.Resource
import org.hyperic.hq.hqu.rendit.BaseController
import org.hyperic.hq.context.Bootstrap
import org.hyperic.hq.appdef.shared.PlatformManager
import org.hyperic.hq.appdef.shared.ServerManager
import org.hyperic.hq.appdef.shared.ServiceManager
import org.hyperic.hq.authz.shared.ResourceManager
import org.hyperic.hq.measurement.shared.MeasurementManager
import org.hyperic.hq.measurement.shared.AvailabilityManager
import org.hyperic.hq.bizapp.shared.AppdefBoss
import org.hyperic.hq.auth.shared.SessionManager
import org.hyperic.hq.escalation.shared.EscalationManager
import org.hyperic.hq.events.shared.AlertDefinitionManager
import org.hyperic.hq.measurement.shared.DataManager
import org.hyperic.hq.authz.shared.ResourceGroupManager
import org.hyperic.hq.measurement.shared.TemplateManager

import org.json.JSONArray
import org.json.JSONObject


/**
 * Base class for all wallmount controllers.
 * 
 * This parent class contains shared instances e.g. for back-end
 * access.
 */
abstract class BaseWallmountController extends BaseController {
    
    private PlatformManager platformManager
    private ServerManager serverManager
    private ServiceManager serviceManager
    private MeasurementManager measurementManager
    private ResourceManager resourceManager
    private AppdefBoss appdefBoss
    private AvailabilityManager availabilityManager
    private EscalationManager escalationManager
    private AlertDefinitionManager alertDefinitionManager
    private DataManager dataManager
    private ResourceGroupManager resourceGroupManager;
    private TemplateManager templateManager;

    def getPlatformManager() {
        if(platformManager == null) platformManager = Bootstrap.getBean(PlatformManager.class)
        platformManager
    }

    def getServerManager() {
        if(serverManager == null) serverManager = Bootstrap.getBean(ServerManager.class)
        serverManager
    }

    def getServiceManager() {
        if(serviceManager == null) serviceManager = Bootstrap.getBean(ServiceManager.class)
        serviceManager
    }

    def getMeasurementManager() {
        if(measurementManager == null) measurementManager = Bootstrap.getBean(MeasurementManager.class)
        measurementManager
    }
    
    def getResourceManager() {
        if(resourceManager == null) resourceManager = Bootstrap.getBean(ResourceManager.class)
        resourceManager
    }

    def getAppdefBoss() {
        if(appdefBoss == null) appdefBoss = Bootstrap.getBean(AppdefBoss.class)
        appdefBoss
    }

    def getAvailabilityManager() {
        if(availabilityManager == null) availabilityManager = Bootstrap.getBean(AvailabilityManager.class)
        availabilityManager
    }

    def getEscalationManager() {
        if(escalationManager == null) escalationManager = Bootstrap.getBean(EscalationManager.class)
        escalationManager
    }

    def getAlertDefinitionManager() {
        if(alertDefinitionManager == null) alertDefinitionManager = Bootstrap.getBean(AlertDefinitionManager.class)
        alertDefinitionManager
    }

    def getDataManager() {
        if(dataManager == null) dataManager = Bootstrap.getBean(DataManager.class)
        dataManager
    }

    def getResourceGroupManager() {
        if(resourceGroupManager == null) resourceGroupManager = Bootstrap.getBean(ResourceGroupManager.class)
        resourceGroupManager
    }

    def getTemplateManager() {
        if(templateManager == null) templateManager = Bootstrap.getBean(TemplateManager.class)
        templateManager
    }

    /**
     * Returns template directory for layouts
     */
    protected def getTemplateDir() {
        Resource templateResource = Bootstrap.getResource("WEB-INF/wmvisualizerTemplates");
        if(!templateResource.exists()) {
            def dir = templateResource.file
            dir.mkdir()
            return dir;
        }
        return templateResource.getFile();
    }

    /**
     * Returns template directory for multi layouts
     */
    protected def getMultiTemplateDir() {
        templateDir // just make sure base dir exists
        Resource templateResource = Bootstrap.getResource("WEB-INF/wmvisualizerTemplates/multi");
        if(!templateResource.exists()) {
            def dir = templateResource.file
            dir.mkdir()
            return dir;
        }
        return templateResource.getFile();
    }
                
    /**
     * Returns list of stored template names.
     */
    protected def getTemplates() {
        def res = []
        for (f in templateDir.listFiles()) {
            if (!f.name.endsWith('.json'))
                continue
            def fname = f.name[0..-6]
            res << fname
        }
        log.debug("Found files: " + res)
        res.sort()
    }

    /**
    * Returns list of stored multi template names.
    */
   protected def getMultitemplates() {
       def res = []
       for (f in multiTemplateDir.listFiles()) {
           if (!f.name.endsWith('.json'))
               continue
           def fname = f.name[0..-6]
           res << fname
       }
       log.debug("Found files: " + res)
       res.sort()
   }
   
    /**
     * 
     */
    protected def layoutExists(fileName, isSingle) {
        (isSingle ? templates : multitemplates).find{it == fileName}
    }
    
    /**
     * 
     */
    protected def readAsJSONObject(fileName, isSingle) {
        def obj
        if (layoutExists(fileName, isSingle) != null) {
            new File((isSingle ? templateDir : multiTemplateDir), "${fileName}.json").withReader { r ->
                obj = new JSONObject(r.text)
            }
        }
        obj
    }

    protected sendError() {
        invokeArgs.response.sendError(404)
    }
    
    def getSessionId() {
        SessionManager.instance.put(user)
    }


}