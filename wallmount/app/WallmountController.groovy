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
	
	/** Server Manager */
	def serverMan

	/** Service Manager */
	def serviceMan

	/** Platform Manager */
	def platformMan

	/** Resource Manager */
	def rMan

	/** Resource Group Manager */
	def gMan
	
	/** Measurement Manager */
	def mMan
	
	/** Wrapping availability values */
    public static final double AVAIL_UNKNOWN = MeasurementConstants.AVAIL_UNKNOWN
    public static final double AVAIL_UP      = MeasurementConstants.AVAIL_UP
    public static final double AVAIL_DOWN    = MeasurementConstants.AVAIL_DOWN
    public static final double AVAIL_WARN    = MeasurementConstants.AVAIL_WARN
    public static final double AVAIL_PAUSED  = MeasurementConstants.AVAIL_PAUSED

	
	/**
	 * Constructor
	 */
	def WallmountController() {
        setJSONMethods(['getAlerts','getPlatformTypes',
                        'getServerTypes','getServiceTypes',
                        'saveLayout','getResources',
                        'getCompatibleGroups','getGroupMembers'])
		
		this.serverMan = Bootstrap.getBean(ServerManager.class)
		this.serviceMan = Bootstrap.getBean(ServiceManager.class)
		this.platformMan = Bootstrap.getBean(PlatformManager.class)
		this.rMan = Bootstrap.getBean(ResourceManager.class)
		this.mMan = Bootstrap.getBean(MeasurementManager.class)
		this.gMan = Bootstrap.getBean(ResourceGroupManager.class)
	}
	
	/**
	 * This function is called from dashboard framework to
	 * get alert statuses.
	 * 
	 * @param params Request parameters.
	 */
	def getAlerts(params) {
        def rData = new JSONObject(params.getOne('jsonData'))
        def items = rData.getJSONArray('items')
        
        // Get down resources and open map
        // a bit to ease access.
        def map = resourceHelper.downResourcesMap        
        def platforms = map.get("Platforms")
        def servers = map.get("Servers")
        def services = map.get("Services")

        def eids = resourcesWithUnfixedAlerts()
        def geids = groupsWithUnfixedAlerts()

		JSONArray jsonData = new JSONArray()
        // Iterate through requested items.
        // These are resources, groups or resource types.
        for(def i = 0; i< items.length(); i++){
        	def obj = items.getJSONObject(i)
        	def type = obj.getString('type')
        	def id = obj.getString('aeid')
        	
            def list = []
           	def row =[:]
           	def a = id.split(':')
           	def status = "ok"
           	row.put('aeid',id)
           	
           	// Resource type
           	if(type == 'rt') {
               	if(a[0] == '1') {
               		list = platforms
               	} else if(a[0] == '2') {
               		list = servers
               	} else if(a[0] == '3') {
               		list = services           		
               	}
               	list.each{
               		if(it.id == a[1].toInteger()) {
               			status = "alert"
               		}
               	}           		
   	           	row.put('hyptype', 'rt')
   	        // Resource   	
           	} else if(type == 'r') {
           		status = availabilityToStatus(getAvailabilityValue(id))
   	           	row.put('hyptype', 'r')
   	        // Group
           	} else if(type == 'g') {
           		def val = AVAIL_UNKNOWN
           		def group = gMan.findResourceGroupById(user,a[1].toInteger())
           		def gresources = gMan.getMembers(group)
           		gresources.each{
           			def v = getAvailabilityValueByResource(it)
           			if (v < val)
           				val = v
           		}
      			status = availabilityToStatus(val)
   	           	row.put('hyptype', 'g')
           	}
        	
        	// if status is still ok
        	// check if there's alerts
        	if(status == "ok") {
        		if(type == 'g') {
            		geids.each{
            			if(it == id) status = "work"
            		}
        			
        		} else if(type == 'r') {
        			eids.each{
        				if(it == id)
        					status = "work"
        			}
        		} else if(type == 'rt') {
        			// find related resources
        			def aid = new AppdefEntityTypeID(id)
        			def proto = rMan.findResourcePrototype(aid)
        			def resources = rMan.findResourcesOfPrototype(proto,PageInfo.getAll(ResourceSortField.NAME, true))
        			// if related resource under resource type
        			// is found from unfixed alert list
        			// mark rt as work
        			resources.each{
        				def aeid = it.resourceType.appdefType + ':' + it.instanceId
            			eids.each{
            				if(it == aeid)
            					status = "work"
            			}
        			}
        			
        		}
        	}
        	
           	row.put('status', status)
           	jsonData.put(row)
        }
        
		def json = [items  : jsonData] as JSONObject 
		json
	}
	
	/**
	 * Returns availability value as string. This string
	 * is commonly used without the plugin. For example, 
	 * in name of icons.
	 * 
	 * @param value Availability value as double
	 */
	def availabilityToStatus(value) {
		def status = "unknown"
		switch (value) {
		   case AVAIL_UP:
		       status = "ok"
		       break
		   case AVAIL_WARN:
		       status = "warn"
		       break
		   case AVAIL_DOWN:
		       status = "alert"
		       break
		   case AVAIL_PAUSED:
		       status = "disabled"
		       break
		}
		status
	}
	
	/**
	 * Return availability value from resource.
	 * 
	 * @param id Resource as string format of aeid 
	 */
	def getAvailabilityValue(id) {
		def r = rMan.findResource(new AppdefEntityID(id))
		getAvailabilityValueByResource(r)
	}

	/**
	 * Return availability value from resource.
	 * 
	 * @param resource Resource object
	 */
	def getAvailabilityValueByResource(resource) {
		def v = AVAIL_UNKNOWN
		def m = mMan.getAvailabilityMeasurement(resource)
		m?.availabilityData?.value.each{
			if(it.endtime == Long.MAX_VALUE) {
				if(it.availVal < v)
					v = it.availVal
			}
		}
		v
	}

	/**
	 * Returns list of resources which have
	 * alerts which are not fixed.
	 */
	def resourcesWithUnfixedAlerts() {
		
		def eids = []
		def severity = AlertSeverity.findByCode(1)
		def alerts = alertHelper.findAlerts(
				severity, 1232386080468, System.currentTimeMillis(),
                false, true, null,
                PageInfo.getAll(AlertSortField.RESOURCE, true))
        alerts.each{
			def r = it.alertDefinition.resource
			eids << r.resourceType.appdefType + ":" + r.instanceId
		}
		eids
	}
	
	/**
	 * Return list of group which have
	 * unfixed group alerts.
	 */
	def groupsWithUnfixedAlerts() {
		
		def eids = []
		def severity = AlertSeverity.findByCode(1)
		def alerts = alertHelper.findGroupAlerts(
				severity, 1232386080468, System.currentTimeMillis(),
                false, true, null,
                PageInfo.getAll(GalertLogSortField.DATE, true))
        alerts.each{
			eids << "5:" + it.alertDef.group.id
		}
		eids
	}
	
	/**
	 * Local renderer.
	 * 
	 * @param params Request parameters.
	 */
	def index(params) {
		render(locals:[templates:getTemplates()])
	}

	/**
	 * Renders local parameters to dashboard template.
	 * 
	 * @param params Request parameters.
	 */
	def dashboard(params) {
		
		// layout can be preloaded to screen 
		// if name is given as parameter.
		def layout = params.getOne("layout")
		
		// check if we have given layout
		def useLayout = null
		templates.each{
			if(layout == it)
				useLayout = layout
		}
		
		// night css style
		def css = "dndDefaults.css"
		def cssmode = params.getOne("cssmode")
		if(cssmode == "night")
			css = "dndNight.css"
		
		
    	render(locals:
    		[viewableTypes: VIEWABLE_TYPES,
    		 useLayout: useLayout,
    		 templates: templates,
    		 css: css])  
	}
	
	/**
	 * Returns server types to dashboard.
	 * 
	 * @param params Request parameters.
	 */
	 def getServerTypes(params) {
		JSONArray jsonData = new JSONArray()
		JSONArray entries = new JSONArray()
		VIEWABLE_TYPES.getServers().each{
			 entries.put('aeid': '2:' + it.id,
					 'name': it.name,
				 	 'hyptype': 'rt',
				 	 'hypiconsize': 64,
				 	 'hypicon': 'unknown')
		}
		jsonData.put('width':'400','height':'500',
				'top':'100','left':'100',
				'title':'Server Types','entries':entries)
		def json = [dashboard  : jsonData] as JSONObject 
		json
	}

	/**
	 * Returns service types to dashboard.
	 * 
	 * @param params Request parameters.
	 */
	 def getServiceTypes(params) {
		JSONArray jsonData = new JSONArray()
		JSONArray entries = new JSONArray()
		VIEWABLE_TYPES.getServices().each{
			 entries.put('aeid': '3:' + it.id,
					 'name': it.name,
				 	 'hyptype': 'rt',
				 	 'hypiconsize': 64,
				 	 'hypicon': 'unknown')
		}
		jsonData.put('width':'400','height':'500',
				'top':'100','left':'100',
				'title':'Service Types','entries':entries)
		def json = [dashboard  : jsonData] as JSONObject 
		json
	}
	
	/**
	 * Returns platform types to dashboard.
	 * 
	 * @param params Request parameters.
	 */
	 def getPlatformTypes(params) {
		JSONArray jsonData = new JSONArray()
		JSONArray entries = new JSONArray()
		VIEWABLE_TYPES.getPlatforms().each{
			 entries.put('aeid': '1:' + it.id,
					 'name': it.name,
				 	 'hyptype': 'rt',
				 	 'hypiconsize': 64,
				 	 'hypicon': 'unknown')
		}
		jsonData.put('width':'400','height':'500',
				'top':'100','left':'100',
				'title':'Platform Types','entries':entries)
		def json = [dashboard  : jsonData] as JSONObject 
		json
	}

	/**
	 * Returns resources under resource type.
	 * 
	 * @param params Request parameters.
	 */
	def getResources(params) {
		JSONArray jsonData = new JSONArray()
		JSONArray entries = new JSONArray()
		def aid = new AppdefEntityTypeID(params.getOne('rtype'))

		def proto = rMan.findResourcePrototype(aid)
		def resources = rMan.findResourcesOfPrototype(proto,PageInfo.getAll(ResourceSortField.NAME, true))
		resources.each{
			 entries.put('aeid': it.resourceType.appdefType + ':' + it.instanceId,
					 	 'name': it.name,
					 	 'hyptype': 'r',
					 	 'hypiconsize': 64,
					 	 'hypicon': 'unknown')			
		}
		jsonData.put('width':'400','height':'500',
				'top':'100','left':'100',
				'title':proto.name,'entries':entries)
		def json = [dashboard  : jsonData] as JSONObject 
		json		
	}

	/**
	 * 
	 */
	def getGroupMembers(params) {
		
		JSONArray jsonData = new JSONArray()
		JSONArray entries = new JSONArray()
		
       	def a = params.getOne('rtype').split(':')
   		def group = gMan.findResourceGroupById(user,a[1].toInteger())
   		def gresources = gMan.getMembers(group)
   		gresources.each{
			 entries.put('aeid': it.resourceType.appdefType + ':' + it.instanceId,
					 	 'name': it.name,
					 	 'hyptype': 'r',
					 	 'hypiconsize': 64,
					 	 'hypicon': 'unknown')			
		}
		jsonData.put('width':'400','height':'500',
				'top':'100','left':'100',
				'title':group.resourceGroupValue.name,'entries':entries)
		def json = [dashboard  : jsonData] as JSONObject 
		json		
	}

	
	/**
	 * Returns defined groups.
	 * 
	 * @param params Request parameters.
	 */
	def getCompatibleGroups(params) {
		JSONArray jsonData = new JSONArray()
		JSONArray entries = new JSONArray()
		
		def groups = gMan.getAllResourceGroups(user, true)
		
		groups.each{
			  if(it.groupType == AppdefEntityConstants.APPDEF_TYPE_GROUP_COMPAT_PS || 
				 it.groupType == AppdefEntityConstants.APPDEF_TYPE_GROUP_COMPAT_SVC) {	
				entries.put('aeid': '5:' + it.id,
							'name': it.resourceGroupValue.name,
							'hyptype': 'g',
							'hypiconsize': 64,
							'hypicon': 'unknown')			
			}
		}
		jsonData.put('width':'400','height':'500',
				'top':'100','left':'100',
				'title':'Compatible Groups','entries':entries)
		def json = [dashboard  : jsonData] as JSONObject 
		json		
	}
	
	/**
	 * Returns groups which are viewable from ui. gMan method
	 * will return also some internal groups.
	 */
	def getViewableGroups() {
		def groups = []
		gMan.getAllResourceGroups(user, true).each{
			def type = it.groupType
			if(type >= AppdefEntityConstants.APPDEF_TYPE_GROUP_ADHOC_APP && 
			   type <= AppdefEntityConstants.APPDEF_TYPE_GROUP_COMPAT_SVC)
				groups << it
		}
		groups
	}
	
    /**
     * Helper to gsp template.
     */
     def VIEWABLE_TYPES = [
        getServers: {
    		serverMan.getViewableServerTypes(user, PageControl.PAGE_ALL)
    	},
        getServices: {
    		serviceMan.getViewableServiceTypes(user, PageControl.PAGE_ALL)
    	},
        getPlatforms: {
    		platformMan.getViewablePlatformTypes(user, PageControl.PAGE_ALL)
    	},
        getGroups: {
        	getViewableGroups()
    	}
     ]
    
    /**
     * Used from dashboard to request layout saving operation to disk.
     * 
	 * @param params Request parameters.
     */
    def saveLayout(params) {
    	 def data = params.getOne("layoutdata")
    	 def name = params.getOne("layoutname")
    	 
    	 def file = new File(templateDir, name + ".json")
    	 file.write("/* ${data} */")
    	 [status: 'ok']
    }

    /**
     * Returns json layout data from stored template.
     * 
	 * @param params Request parameters.
     */
    def getLayout(params) {
    	def layout = params.getOne("layout")
    	def layoutData = ""
        
    	if (templates.contains(layout)) {
        	log.info("Trying to open template " + layout)

    		new File(templateDir, "${layout}.json").withReader { r ->
    		log.info "reading..."
    		layoutData = r.text
            }
        }
        render(inline:"${layoutData}", contentType:'text/json-comment-filtered')
    }
    
    /**
     * Returns template directory for layouts
     */
	private def getTemplateDir() {
		Resource templateResource = Bootstrap.getResource("WEB-INF/wallmountTemplates");
		if(! templateResource.exists()) {
			def dir = templateResource.file
			dir.mkdir()
			return dir;
		}
		return templateResource.getFile();
	}

    /**
     * Returns list of stored template names.
     */
    private def getTemplates() {
    	def res = []
    	for (f in templateDir.listFiles()) {
    		if (!f.name.endsWith('.json'))
    			continue
 	           
    		def fname = f.name[0..-6]
    		res << fname
    	}
    	log.info("Found files: " + res)
    	res.sort()
	}
    
}