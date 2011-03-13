import org.json.JSONArray
import org.json.JSONObject
import org.hyperic.hq.appdef.shared.AppdefEntityID
import org.hyperic.hq.events.AlertSeverity
import org.hyperic.hq.events.server.session.AlertSortField
import org.hyperic.hibernate.PageInfo

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
            def eid = new AppdefEntityID(scopes[1])
            def res = resourceManager.findResource(eid)
            def mea = availabilityManager.getAvailMeasurement(res)
            
            def resAlertCount = resourcesWithUnfixedAlerts()
            def alertCount = 0
            if(resAlertCount.containsKey(eid.toString()))
                alertCount = resAlertCount[eid.toString()]

            def resEscCount = resourcesWithRunningEscalation()
            def escCount = 0
            if(resEscCount.containsKey(eid.toString()))
                escCount = resEscCount[eid.toString()]
    
            array.put(id: scopes[1], last: mea.lastDataPoint.value, alerts:alertCount, escalations:escCount)
        }
        
        
        render(inline:"${array}", contentType:'text/json-comment-filtered')
    }
    
    /**
     * 
     */
    protected resourcesWithUnfixedAlerts() {
        
        def resAlertCount = [:]
        def severity = AlertSeverity.findByCode(1)
        def alerts = alertHelper.findAlerts(severity, 1232386080468, System.currentTimeMillis(),
                                            false, true, null,
                                            PageInfo.getAll(AlertSortField.RESOURCE, true))
        alerts.each{
            def r = it.alertDefinition.resource
            def eid = r.resourceType.appdefType + ":" + r.instanceId
            if(resAlertCount.containsKey(eid)) {
                (resAlertCount[eid])++
            } else {
                resAlertCount[eid] = 1
            }
        }
        
        resAlertCount
    }
    
    protected resourcesWithRunningEscalation() {
        def resEscCount = [:]
        
        def escStates = escalationManager.getActiveEscalations(10)
        
        escStates.each{
            def aDefId = it.alertDefinitionId
            def aDef = alertDefinitionManager.getByIdAndCheck(user, aDefId)
            def eid = aDef.appdefEntityId.toString()
            
            if(resEscCount.containsKey(eid)) {
                (resEscCount[eid])++
            } else {
                resEscCount[eid] = 1
            }

        }
        
        resEscCount
    }
        
    
}