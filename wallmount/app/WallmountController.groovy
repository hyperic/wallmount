import org.hyperic.hq.hqu.rendit.BaseController
import org.springframework.core.io.Resource
import org.hyperic.hq.appdef.shared.ServerManager
import org.hyperic.hq.appdef.shared.ServiceManager
import org.hyperic.hq.appdef.shared.PlatformManager
import org.hyperic.hq.authz.shared.ResourceManager
import org.hyperic.hq.authz.shared.ResourceGroupManager
import org.hyperic.hq.appdef.shared.AppdefEntityID
import org.hyperic.hq.appdef.shared.AppdefEntityTypeID
import org.hyperic.util.pager.PageControl
import org.hyperic.hibernate.PageInfo
import org.hyperic.hq.authz.server.session.ResourceSortField
import org.hyperic.hq.galerts.server.session.GalertLogSortField
import org.hyperic.hq.measurement.shared.MeasurementManager
import org.hyperic.hq.events.AlertSeverity
import org.hyperic.hq.events.server.session.AlertSortField
import org.hyperic.hq.measurement.MeasurementConstants
import org.hyperic.hq.appdef.shared.AppdefEntityConstants
import org.json.JSONArray
import org.json.JSONObject
import org.hyperic.hq.context.Bootstrap

/**
 * Base controller for this plugin.
 */
class WallmountController 
	extends BaseController
{
	
	
	/**
	 * Constructor
	 */
	def WallmountController() {
	}
	
	/**
	 * Local renderer.
	 * 
	 * @param params Request parameters.
	 */
	def index(params) {
		render(locals:[])
	}

    def designer(params) {
        render(locals:[])
    }

    def player(params) {
        render(locals:[])
    }

    
}