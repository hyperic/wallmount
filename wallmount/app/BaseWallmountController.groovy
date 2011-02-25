import org.hyperic.hq.hqu.rendit.BaseController
import org.hyperic.hq.context.Bootstrap
import org.hyperic.hq.appdef.shared.PlatformManager
import org.hyperic.hq.appdef.shared.ServerManager
import org.hyperic.hq.appdef.shared.ServiceManager
import org.hyperic.hq.authz.shared.ResourceManager
import org.hyperic.hq.measurement.shared.MeasurementManager
import org.hyperic.hq.bizapp.shared.AppdefBoss

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

    protected sendError() {
        invokeArgs.response.sendError(404)
    }


}