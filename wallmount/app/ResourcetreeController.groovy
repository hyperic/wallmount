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

import org.hyperic.hq.appdef.shared.AppdefEntityID
import org.hyperic.hq.appdef.shared.AppdefEntityTypeID
import org.hyperic.util.pager.PageControl
import org.hyperic.hibernate.PageInfo
import org.hyperic.hq.authz.server.session.ResourceSortField
import org.hyperic.hq.galerts.server.session.GalertLogSortField
import org.hyperic.hq.events.AlertSeverity
import org.hyperic.hq.events.server.session.AlertSortField
import org.hyperic.hq.measurement.MeasurementConstants
import org.hyperic.hq.appdef.shared.AppdefEntityConstants
import org.json.JSONArray
import org.json.JSONObject
import org.hyperic.hq.context.Bootstrap
import org.hyperic.hq.hqu.rendit.util.HQUtil
import org.hyperic.hq.hqu.rendit.helpers.ResourceHelper
import org.hyperic.hq.auth.shared.SessionManager
import org.hyperic.hq.bizapp.shared.MeasurementBoss
import org.hyperic.hq.appdef.shared.AppdefEntityValue

/**
 * Resources services for various widgets.
 * 
 * e.g. navigation trees.
 */
class ResourcetreeController extends BaseJSONController {
	    
    private static String baseUrl = '/hqu/wmvisualizer/resourcetree/resourcetree.hqu?path='
    private static measBoss = Bootstrap.getBean(MeasurementBoss.class)

    /**
     * 
     */
    def resourcetree(params) {
        log.info("params:" + params);
        def path = params.getOne('path')
        
        def paths = path.split('/')
        log.info("paths:" + paths);
        
        if(paths.size() <= 1) {
            allRoots()
        } else if(paths.size() == 2) {
            if(paths[1] == 'platform') allPlatforms()
            if(paths[1] == 'group') allGroups()
        } else if(paths.size() == 3) {
            if(paths[1] == 'platform') {
                byPlatform(paths[2] as int)
            } else if (paths[1] == 'group') {
                byGroup(paths[2] as int)
            } else if (paths[1] == 'server') {
                metricsByServer(paths[2] as int)
            } else if (paths[1] == 'service') {
                metricsByService(paths[2] as int)
            }            
        } else if(paths.size() == 5) {
            def typenum = paths[1] == 'platform' ? 1 : 5
            if(paths[3] == 'server' && paths[4] == 'proto') {
                serverprotos(paths[1], typenum, paths[2] as int)
            } else if (paths[3] == 'service' && paths[4] == 'proto') {
                serviceprotos(paths[1], typenum, paths[2] as int)
            }
        } else if(paths.size() == 6) {
            if(paths[1] == 'platform' && paths[3] == 'server') {
                serversByProtoAndPlatform(paths[5] as int, paths[2] as int)
            } else if(paths[1] == 'platform' && paths[3] == 'service') {            
                servicesByProtoAndPlatform(paths[5] as int, paths[2] as int)
            } else if (paths[1] == 'server' && paths[3] == 'service' && paths[4] == 'proto') {
                servicesByProtoAndServer(paths[5] as int, paths[2] as int)
            }
        } else {
            render(inline:"{}", contentType:'text/json-comment-filtered')
        }
    }

    def servicesByProtoAndServer(proto,eid) {
        JSONObject obj = new JSONObject()
        
        def prototypeName
        
        JSONArray children = new JSONArray()
        def services = serviceManager.getServicesByServer(user, eid, proto, PageControl.PAGE_ALL)
        services.each{
            prototypeName = it.serviceType.name
            JSONObject o = new JSONObject()
            o.put('$ref', baseUrl + "/service/${it.id}")
            o.put('name', it.name)
            o.put('eid', it.entityId)
            o.put('children', true)
            children.put(o)
        }
        
        obj.put('id', baseUrl + "/server/${eid}/service/proto/${proto}")
        obj.put('name', prototypeName)
        
        obj.put('children', children)

        renderJSONObj(obj)
    }

                
    /**
     * 
     */
    def servicesByProtoAndPlatform(proto,eid) {
        JSONObject obj = new JSONObject()
        
        def prototypeName
        
        JSONArray children = new JSONArray()
        def services = serviceManager.getServicesByPlatform(user, eid, proto, PageControl.PAGE_ALL)
        services.each{
            prototypeName = it.serviceType.name
            JSONObject o = new JSONObject()
            o.put('$ref', baseUrl + "/service/${it.id}")
            o.put('name', it.name)
            o.put('eid', it.entityId)
            o.put('children', true)
            children.put(o)
        }
        
        obj.put('id', baseUrl + "/platform/${eid}/service/proto/${proto}")
        obj.put('name', prototypeName)
        
        obj.put('children', children)
        
        renderJSONObj(obj)
    }

    /**
     * 
     */
    def metricsByService(eid) {
        JSONObject obj = new JSONObject()
        JSONArray children = new JSONArray()
        
        def aeid = new AppdefEntityID("3:$eid")
        
        // we can only find metrics which are collecting.
        // TODO: should we be able to use all metrics
        def metrics = measurementManager.findMeasurements(user, aeid, null, PageControl.PAGE_ALL)
        metrics.each { m ->
            JSONObject met = new JSONObject()
            met.put("id", baseUrl + "/service/${eid}/metric/" + m.id)
            met.put("mid", m.id)
            met.put("name", m.template.name)
            met.put("format", m.template.units)
            children.put(met)
        }

        def service = serviceManager.getServiceById(eid)
        
        obj.put('id', baseUrl + "/server/${eid}")
        obj.put('name', service.name)
        obj.put('eid', service.entityId)
        obj.put('proto', service.appdefResourceType.name)
        obj.put('children', children)
        renderJSONObj(obj)
    }

    
    /**
     * 
     */
    def metricsByServer(eid) {
        JSONObject obj = new JSONObject()
        JSONArray children = new JSONArray()
        
        def aeid = new AppdefEntityID("2:$eid")
        
        // we can only find metrics which are collecting.
        // TODO: should we be able to use all metrics
        def metrics = measurementManager.findMeasurements(user, aeid, null, PageControl.PAGE_ALL)
        metrics.each { m ->
            JSONObject met = new JSONObject()
            met.put("id", baseUrl + "/server/${eid}/metric/" + m.id)
            met.put("mid", m.id)
            met.put("name", m.template.name)
            met.put("format", m.template.units)
            children.put(met)
        }
        
        // add refs to services types under server
        def types = [:]
        def services = serviceManager.getServicesByServer(user, eid, PageControl.PAGE_ALL)
        services.each{
            types[it.serviceType.id] = it.serviceType.name
        }
        
        types.each{ key, value ->
            JSONObject o = new JSONObject()
            o.put('$ref', baseUrl + "/server/${eid}/service/proto/${key}")
            o.put("name", value)
            o.put("children", true)
            children.put(o)
        }

        def server = serverManager.getServerById(eid)
        
        obj.put('id', baseUrl + "/server/${eid}")
        obj.put('name', server.name)        
        obj.put('eid', server.entityId)        
        obj.put('proto', server.appdefResourceType.name)
        obj.put('children', children)
        renderJSONObj(obj)
    }
    
    /**
     * 
     */
    def serversByProtoAndPlatform(proto,eid) {
        JSONObject obj = new JSONObject()
        
        def prototypeName
        
        JSONArray children = new JSONArray()
        def servers = serverManager.getServersByPlatform(user, eid, proto, true, PageControl.PAGE_ALL)
        servers.each{
            prototypeName = it.serverType.name
            JSONObject o = new JSONObject()
            o.put('$ref', baseUrl + "/server/${it.id}")
            o.put('name', it.name)
            o.put('eid', it.entityId)
            o.put('children', true)
            children.put(o)
        }
        
        obj.put('id', baseUrl + "/platform/${eid}/server/proto/${proto}")
        obj.put('name', prototypeName)
        
        obj.put('children', children)
        
        renderJSONObj(obj)
    }

    /**
     * 
     */
    def serviceprotos(tp, typenum, eid) {
        JSONObject obj = new JSONObject()

        obj.put("id", baseUrl + "/${tp}/${eid}/service/proto")
        obj.put("name","Platform Services")

        
        def aeid = new AppdefEntityID("$typenum:$eid")
        def resource = resourceManager.findResource(aeid)

        
        JSONArray child = new JSONArray()

        def resources = appdefBoss.findPlatformServices(sessionId, eid, PageControl.PAGE_ALL)
        def types = [:]
        resources.each{
            types[it.serviceType.id] = it.serviceType.name
        }
        types.each{ key, value ->
            JSONObject o = new JSONObject()
            o.put('$ref', baseUrl + "/${tp}/${eid}/service/proto/${key}")
            o.put("name", value)
            o.put("children", true)
            child.put(o)
        }
        
        
        obj.put("children", child)
        renderJSONObj(obj)
    }

    
    /**
     * 
     */
    def serverprotos(tp, typenum, eid) {
        JSONObject obj = new JSONObject()

        obj.put("id", baseUrl + "/${tp}/${eid}/server/proto")
        obj.put("name","Servers")

        
        def aeid = new AppdefEntityID("$typenum:$eid")
        def resource = resourceManager.findResource(aeid)

        
        JSONArray child = new JSONArray()

        def resources = appdefBoss.findServersByPlatform(sessionId, eid, PageControl.PAGE_ALL)
        def types = [:]
        resources.each{
            if(!it.serverType.getVirtual()) {
                types[it.serverType.id] = it.serverType.name
            }
        }
        types.each{ key, value ->
            JSONObject o = new JSONObject()
            o.put('$ref', baseUrl + "/${tp}/${eid}/server/proto/${key}")
            o.put("name", value)
            o.put("children", true)
            child.put(o)
        }
        
        
        obj.put("children", child)
        renderJSONObj(obj)
    }
        
	/**
	 * 
	 */
    def allRoots() {
        log.info("Returning roots");
        JSONArray roots = new JSONArray()
        roots.put($ref : baseUrl + '/platform', name: 'Platforms', children: true);
        roots.put($ref : baseUrl + '/group', name: 'Groups', children: true);
        def ret = roots.toString()
        render(inline:"${ret}", contentType:'text/json-comment-filtered')
    }

    /**
     *
     */
    def allPlatforms() {
        log.info("Loading platform list")
        JSONObject platformList = new JSONObject()

        platformList.put("id", baseUrl + '/platform')
        platformList.put("name","Platforms")

        JSONArray array = new JSONArray()

        def platforms = resourceHelper.findAllPlatforms()
        platforms.each{
            array.put($ref: baseUrl + '/platform/' + it.instanceId,
                      eid: '1:' + it.instanceId,
                      proto: it.prototype.name,
                      name: it.name,
                      children: true)
        }
        platformList.put("children",array);
        renderJSONObj(platformList);
    }

    /**
     *
     */
    def allGroups() {
        log.info("Loading group list")

        JSONObject groupList = new JSONObject()

        groupList.put("id", baseUrl + '/group')
        groupList.put("name","Groups")

        JSONArray array = new JSONArray()

        def groups = resourceHelper.findViewableGroups()
        groups.each{
            if (!it.mixed) {
              array.put($ref: baseUrl + '/group/' + it.id,
                        eid: '5:' + it.id,
                        //proto: it.prototype.name,
                        name: it.name,
                        children: true)
            }
        }
        groupList.put("children",array);
        renderJSONObj(groupList);
    }

    /**
     * 
     */
    def byPlatform(eid) {
        
        def aeid = new AppdefEntityID("1:$eid")
        def r = resourceManager.findResource(aeid)
        
        JSONObject platform = new JSONObject()

        def p = platformManager.findPlatformById(eid)
        platform.put("id", baseUrl + '/platform/' + eid)
        platform.put("eid",'1:'+eid)
        platform.put("proto",r.prototype.name)
        platform.put("name",r.name)
        
        JSONArray child = new JSONArray()
        
        child.put($ref: baseUrl + "/platform/${eid}/service/proto", "name":"Platform Services", "children":true)
        child.put($ref: baseUrl + "/platform/${eid}/server/proto", "name":"Servers", "children":true)

        def metrics = measurementManager.findMeasurements(user, aeid, null, PageControl.PAGE_ALL)
        
        metrics.each { m ->
            JSONObject met = new JSONObject()
            met.put("id", baseUrl + "/platform/${eid}/metric/" + m.id)
            met.put("mid", m.id)
            met.put("name", m.template.name)
            met.put("format", m.template.units)
            child.put(met)
        }

        
        platform.put("children", child)
        renderJSONObj(platform)
    }
    
    /**
     *
     */
    def byGroup(eid) {

        def aeid = new AppdefEntityID("5:$eid")
        def g = resourceHelper.findGroup(eid);
        def r = g.resourcePrototype;
        log.info("Resource: " + r.id);

        JSONObject group = new JSONObject()

        group.put("id", baseUrl + '/group/' + eid)
        group.put("eid",'5:'+eid)
        group.put("proto",r.prototype.name)
        group.put("name",g.name)

        JSONArray child = new JSONArray()

        AppdefEntityValue value = new AppdefEntityValue(aeid, user);
        def metrics = templateManager.findTemplates(value.typeName, null, null, PageControl.PAGE_ALL);
        log.info("metrics: " + metrics);

        metrics.each { m ->
            JSONObject met = new JSONObject()
            met.put("id", baseUrl + "/group/${eid}/metric/" + m.id)
            met.put("mid", m.id + '|5:'+eid)
            met.put("name", m.name)
            met.put("format", m.units)
            child.put(met)
        }


        group.put("children", child)
        renderJSONObj(group)
    }

}