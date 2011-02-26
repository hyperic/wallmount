import org.json.JSONArray
import org.json.JSONObject
import org.hyperic.hq.appdef.shared.AppdefEntityID

/**
 * Controller to handle metric requests from wallmount
 * metric store.
 */
class MetricstoreController extends BaseJSONController {
    
    //[
    //    { id: '10000', last: 123}
    //  ]
    /**
     * Returns requested metrics.
     */
    def getMetrics(params) {
        def scope = params.getOne('scope')
        def scopes = scope.split('/')
        JSONArray array = new JSONArray()
        
        if(scopes[0] == 'metric') {
            def m = measurementManager.getMeasurement(scopes[2] as int)
            def lastData = m.lastDataPoint
            array.put(id: scopes[2], last: lastData.value)
        } else if(scopes[0] == 'ravail') {
            def res = resourceManager.findResource(new AppdefEntityID(scopes[1]))
            def mea = availabilityManager.getAvailMeasurement(res)
            array.put(id: scopes[1], last: mea.lastDataPoint.value)
        }
        
        
        render(inline:"${array}", contentType:'text/json-comment-filtered')
    }
    
}