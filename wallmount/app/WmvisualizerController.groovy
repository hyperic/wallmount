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

/**
 * Base controller for this plugin.
 */
class WmvisualizerController extends BaseWallmountController {
    
    /** Table schema for single layouts. */
    private final SINGLE_LAYOUT_SCHEMA = [
        getData: {pageInfo, params -> templates},
        rowId: {it -> 0},
        defaultSort: null,
        defaultSortOrder: 0,  // descending
        columns: [
            [field:[getValue:{'Layout Name'}, description:'layout name', sortable:false], width:'100%', label:{linkTo(it, [action:'player', layout:it])}]
        ]
    ]

    /** Table schema for multi layouts. */
    private final MULTI_LAYOUT_SCHEMA = [        
        getData: {pageInfo, params -> multitemplates},
        rowId: {it -> 0},
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
        setJSONMethods(['saveLayout','getSingleTemplates','getMultiTemplates'])
	}
    
    /** Returns data for single layout table. */
    def getSingleTemplates(params) {
        DojoUtil.processTableRequest(SINGLE_LAYOUT_SCHEMA, params)
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
		render(locals:[singleLayoutsSchema:SINGLE_LAYOUT_SCHEMA])
	}

    def designer(params) {
        render(locals:[])
    }

    def player(params) {
        def layout = params.getOne("layout")
        def useLayout = null
        templates.each{
            if(layout == it)
            useLayout = layout
        }       
        render(locals:[useLayout: useLayout])
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