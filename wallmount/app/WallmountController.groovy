import org.json.JSONArray
import org.json.JSONObject

/**
 * Base controller for this plugin.
 */
class WallmountController extends BaseWallmountController {
		
	/**
	 * Constructor
	 */
	def WallmountController() {
        setJSONMethods(['saveLayout'])
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
    
    /**
     * Returns layout names as format which is suitable
     * for layout selection dialog.
     */
    def getLayouts(params) {
        JSONObject obj = new JSONObject()
        
        obj.put('identifier', 'name')
        obj.put('label', 'name')
        JSONArray items = new JSONArray()
        
        templates.each{
            items.put(new JSONObject().put('name', it))
        }        
        obj.put('items', items)
           
        render(inline:"${obj}", contentType:'text/json-comment-filtered')
    }
    
    /**
     * 
     */
    def getLayout(params) {
        def layout = params.getOne("layout")
        def layoutData = ""
           
        if (templates.contains(layout)) {
            log.info("Trying to open template " + layout) 
            new File(templateDir, "${layout}.json").withReader { r ->
            log.debug("Reading template ${layout}")
            layoutData = r.text
            }
        }
        render(inline:"${layoutData}", contentType:'text/json-comment-filtered')
    }

    /**
     * 
     */
    def saveLayout(params) {
        def data = params.getOne("layoutdata")
        def name = params.getOne("layoutname")
       
        def file = new File(templateDir, name + ".json")
        log.debug("Saving template ${name}")
        //file.write("/* ${data} */")
        file.write("${data}")
        [status: 'ok']
    }
    
}