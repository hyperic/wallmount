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
import org.hyperic.hq.hqu.rendit.util.HQUtil
import org.hyperic.hq.hqu.rendit.helpers.ResourceHelper



class ResourcetreeController extends BaseController {
	
	def platformMan
	def rMan
	def rhelp
	def overlord
	
	def ResourcetreeController() {
		this.overlord = HQUtil.getOverlord()
		this.platformMan = Bootstrap.getBean(PlatformManager.class)
		this.rMan = Bootstrap.getBean(ResourceManager.class)
		this.rhelp = new ResourceHelper(overlord)
	}
	
	def treeService(params) {
		def id = params.get('id')
		
		if(id == "platforms") {
			platforms(params)
		} else if(id.startsWith("r-1")) {
			platformResources(params)
		}
	}

	def platformResources(params) {
		// dir platform services
		// dir servers
		// metrics
		JSONObject o = new JSONObject()
		o.put("key", "value");
		o
	}
	
	/**
	 * 
	 */
	def platforms(params) {
		JSONArray entries = new JSONArray()
		def platforms = rhelp.findAllPlatforms()
		platforms.each{
			def childs = hasPlatformChilds(it)
			if(childs) {
				entries.put($ref: "r-1-" + it.instanceId,
					name: it.name,
					children: true)
			} else {
				entries.put(id: "1-" + it.instanceId,
					name: it.name,
					children: false)
			}
		}
		entries
	}
	
	private def hasPlatformChilds(res) {
		// need to check if platform
		// has at least one metric, platforms service
		// or server.
		return true;
	}
		
}