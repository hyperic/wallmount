
/**
 * Base class to handle some common json methods for controllers.
 */
abstract class BaseJSONController extends BaseWallmountController {
    
    /**
     * Renders json object to response.
     * 
     * @param obj JSONObject to render
     */
    def renderJSONObj(obj) {
        render(inline:"${obj}", contentType:'text/json-comment-filtered')
    }
    
    
}