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

import org.hyperic.hq.hqu.rendit.html.DojoUtil
 
import org.json.JSONArray
import org.json.JSONObject
import org.hyperic.hibernate.PageInfo

/**
 * Base controller for this plugin.
 */
class WmvisualizerController extends BaseWallmountController {
    
    /** Table schema for single layouts. */
    private final SINGLE_LAYOUT_SCHEMA = [
        getData: {pageInfo, params ->
            getDojoSingleTemplates(pageInfo)
        },
        rowId: {it[0]},
        defaultSort: null,
        defaultSortOrder: 0,  // descending
        columns: [            
            [field:[getValue:{'Layout Name'}, description:'layout name', sortable:false], width:'70%', label:{
                def lparam = (it[1] == 'user' ? 'layout' : 'dynlayout') 
                linkTo(it[0], [action:'player',"${lparam}":it[0]])
                }],
            [field:[getValue:{'Layout Type'}, description:'layout type', sortable:false], width:'30%', label:{it[1]}]
        ]
    ]

    /** Table schema for multi layouts. */
    private final MULTI_LAYOUT_SCHEMA = [        
        getData: {pageInfo, params ->
            getDojoMultiTemplates(pageInfo)
        },
        rowId: {it},
        defaultSort: null,
        defaultSortOrder: 0,  // descending
        columns: [
            [field:[getValue:{'Layout Name'}, description:'layout name', sortable:false], width:'100%', label:{linkTo(it, [action:'multiplayer', layout:it])}]
        ]
    ]

	/**
	 * Constructor
	 */
	def WmvisualizerController() {
        setJSONMethods(['saveLayout','saveMultiLayout','getSingleTemplates','getMultiTemplates','encodeUrl'])
	}

    /** Returns data for single layout table. */
    def getDojoSingleTemplates(PageInfo pageInfo) {
        def ret = []
        def allTemplates = singletemplates
        def total = allTemplates.size
        def start = pageInfo.startRow-pageInfo.startRow%(pageInfo.pageSize-1)                
        def end = start+pageInfo.pageSize
        for(int i=start; i<end; i++) {
            if(i<total) {
                ret << allTemplates[i]
            }
        }
        ret
    }

    /** Returns data for single layout table. */
    def getSingleTemplates(params) {
        DojoUtil.processTableRequest(SINGLE_LAYOUT_SCHEMA, params)
    }

    /** Returns data for multi layout table. */
    def getDojoMultiTemplates(PageInfo pageInfo) {
        def ret = []
        def allTemplates = multitemplates
        def total = allTemplates.size
        def start = pageInfo.startRow-pageInfo.startRow%(pageInfo.pageSize-1)                
        def end = start+pageInfo.pageSize
        for(int i=start; i<end; i++) {
            if(i<total) {
                ret << allTemplates[i]
            }
        }
        ret
    }

    /** Returns data for multi layout table. */
    def getMultiTemplates(params) {
        DojoUtil.processTableRequest(MULTI_LAYOUT_SCHEMA, params)
    }

	/**
	 * Local renderer.
	 * 
	 * @param params Request parameters.
	 */
	def index(params) {
		render(locals:[singleLayoutsSchema:SINGLE_LAYOUT_SCHEMA,
                       multiLayoutsSchema:MULTI_LAYOUT_SCHEMA])
	}

    def designer(params) {
        render(locals:[])
    }

    def multidesigner(params) {
        render(locals:[layouts:templates])
    }

    def player(params) {
        def layout = params.getOne("layout")
        def dynlayout = params.getOne("dynlayout")
        
        def lparam = (layout != null ? 'layout' : 'dynlayout')
        def useLayout = (layout != null ? layout : dynlayout)
        
        //def useLayout = layoutExists(params.getOne("layout"), true)
        render(locals:[useLayout: useLayout, lparam:lparam])
    }

    /**
     * Controller method for multiplayer.hqu which pass properties
     * to multiplayer.gsp template.
     */
    def multiplayer(params) {
        
        def layout = params.getOne("layout")
        
        // make sure we have the one
        def useLayout = layoutExists(layout, false)
        
        def objMulti = readAsJSONObject(layout, false)

        // h and w wrapping transition div's
        def width = 1
        def height = 1
        
        def layouts = []
        // combine and reduce
        JSONArray jsonlayouts = objMulti.getJSONArray("layouts")
        for(def i=0; i<jsonlayouts.length(); i++) {
            def name = jsonlayouts.getJSONObject(i).getString("name")
            layouts << name
            
            // calculate max height and width from single layouts
            def layoutObj = readAsJSONObject(name, true)
            def w = layoutObj.getInt("w")
            def h = layoutObj.getInt("h")
            width = ( w > width ? w : width)
            height = ( h > height ? h : height)
        }
        
        def transition = "dojox.widget.rotator." + objMulti.getString("transition")
        def duration = objMulti.getString("duration")
        
        render(locals:[useLayout: useLayout, layouts:layouts, duration:duration, transition:transition, width:width, height:height])
    }

    /**
     * Returns layout names as format which is suitable
     * for layout selection dialog.
     */
    def getLayouts(params) {
        JSONObject obj = new JSONObject()
        
        JSONArray items = new JSONArray()
        
        templates.each{
            items.put(new JSONObject().put('name', it))
        }        
        obj.put('items', items)
           
        render(inline:"${obj}", contentType:'text/json-comment-filtered')
    }

    /**
    * Returns layout names as format which is suitable
    * for layout selection dialog.
    */
    def getMultiLayouts(params) {
        JSONObject obj = new JSONObject()
       
        JSONArray items = new JSONArray()
       
        multitemplates.each{
            items.put(new JSONObject().put('name', it))
        }
        obj.put('items', items)
          
        render(inline:"${obj}", contentType:'text/json-comment-filtered')
    }

    /**
     * 
     */
    def getLayout(params) {        
        def obj = readAsJSONObject(params.getOne("layout"),true)
        render(inline:"${obj}", contentType:'text/json-comment-filtered')
    }

    def getMultiLayout(params) {
        def obj = readAsJSONObject(params.getOne("layout"),false)
        render(inline:"${obj}", contentType:'text/json-comment-filtered')
    }

    /**
     * Returns combined info for multi layout and single layouts.
     */
    def getMultiLayoutCombi(params) {
              
        // get all single templates
        def singles = templates
        
        // get multi template
        def layout = params.getOne("layout")
        def objMulti = readAsJSONObject(layout,false)
        
        // combine and reduce
        JSONArray layouts = objMulti.getJSONArray("layouts")
        for(def i=0; i<layouts.length(); i++) {
            def name = layouts.getJSONObject(i).getString("name")
            singles.removeAll([name])
        }
        
        def obj = new JSONObject()
        obj.put("source", singles)        
        obj.put("target", objMulti)        
        render(inline:"${obj}", contentType:'text/json-comment-filtered')
    }
        
    /**
     * 
     */
    def saveLayout(params) {
        def data = params.getOne("layoutdata")
        def name = params.getOne("layoutname")
        [status: writeJsonToFile(name, data, true)]
    }

    def saveMultiLayout(params) {
        def data = params.getOne("layoutdata")
        def name = params.getOne("layoutname")
        [status: writeJsonToFile(name, data, false)]
    }

    def encodeUrl(params) {
        def url = urlFor(action:params.getOne("action"), encodeUrl:true)
        [url:url]
    }    
}