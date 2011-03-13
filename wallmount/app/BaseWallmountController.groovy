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
import org.hyperic.hq.escalation.shared.EscalationManager;
import org.hyperic.hq.events.shared.AlertDefinitionManager


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

    /**
     * Returns template directory for layouts
     */
    protected def getTemplateDir() {
        Resource templateResource = Bootstrap.getResource("WEB-INF/wallmount2Templates");
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
        
    protected sendError() {
        invokeArgs.response.sendError(404)
    }
    
    def getSessionId() {
        SessionManager.instance.put(user)
    }


}