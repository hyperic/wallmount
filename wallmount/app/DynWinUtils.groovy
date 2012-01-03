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

import org.json.JSONObject
import org.json.JSONArray

/**
 * Helper methods to position and tile windows.
 */
class DynWinUtils {
    
    /**
     * Tile layout windows vertically.
     * 
     * @param obj Layout as JSONObject
     * @param params Extra parameters - reserved for future
     * 
     * @return Returns modified layout object containing
     *         vertically tiled windows.
     */
    def static vertical(JSONObject obj, Map params) {
        def info = getInfo(obj)
        
        def width = (info.width / info.length) as int
        def height = info.height
        
        info.windows.eachWithIndex() { item, i ->
            item.put("x", i*width)
            item.put("y", 0)
            item.put("w", width)
            item.put("h", height)
        }
        
        obj
    }
    
    /**
     * Tile layout windows vertically.
     * 
     * @param obj Layout as JSONObject
     * 
     * @return Returns modified layout object containing
     *         vertically tiled windows.
     */
    def static vertical(JSONObject obj) {
        vertical(obj, [:])
    }
        
    /**
     * Tile layout windows horizontally.
     * 
     * @param obj Layout as JSONObject
     * @param params Extra parameters - reserved for future
     * 
     * @return Returns modified layout object containing
     *         horizontally tiled windows.
     */
    def static horizontal(JSONObject obj, Map params) {
        def info = getInfo(obj)
        
        def width = info.width
        def height = (info.height / info.length) as int
        
        info.windows.eachWithIndex() { item, i ->
            item.put("x", 0)
            item.put("y", i*height)
            item.put("w", width)
            item.put("h", height)
        }
        
        obj
    }
    
    /**
     * Tile layout windows horizontally.
     * 
     * @param obj Layout as JSONObject
     * 
     * @return Returns modified layout object containing
     *         horizontally tiled windows.
     */
    def static horizontal(JSONObject obj) {
        horizontal(obj, [:])
    }           

    /**
     * Position layout windows to a grid.
     * 
     * The way grid is build depends on a given parameters.
     * 
     * Count | Params | Grid (ROWS x COLS)
     * ----------------------------------
     *     4 | none   |  2x2
     *     5 | none   |  3x2
     *     6 | none   |  3x2
     *     7 | none   |  3x3
     *     8 | none   |  3x3
     *     9 | none   |  3x3
     *     4 | rows=2 |  2x2
     *     6 | rows=2 |  2x3
     *    10 | rows=3 |  3x4
     *     3 | cols=2 |  2x2
     *     7 | cols=2 |  4x2
     *     9 | cols=3 |  3x3
     * 
     * Parameter map:
     * rows - Number of rows where windows will be positioned.
     * cols - Number of columns where windows will be positioned.
     * 
     * If both parameters are present, rows will be used.
     * 
     * @param obj Layout as JSONObject
     * @param params Given parameters as map
     * 
     * @return Returns modified layout object containing
     *         windows tiled to a grid.
     */
    def static grid(JSONObject obj, Map params) {
        def info = getInfo(obj)
                
        def cols
        def rows
        if(params.containsKey("rows")) {
            rows = params.rows as int
            cols = Math.ceil((info.length / rows) as double) as int
        } else if(params.containsKey("cols")) {
            cols = params.cols as int
            rows = Math.ceil((info.length / cols) as double) as int
        } else {
            rows = Math.ceil((info.length**(1/2)) as double) as int
            cols = Math.ceil((info.length / rows) as double) as int            
        }
        
        def width = (info.width / cols) as int
        def height = (info.height / rows) as int

        def counter = 0;
        for(i in 0..<rows) {
            if(counter >= info.length)
                break;
            for(j in 0..<cols) {
                if(counter >= info.length)
                    break;
                def item = info.windows.getAt(counter++)
                item.put("x", j*width)
                item.put("y", i*height)
                item.put("w", width)
                item.put("h", height)
            }
        }        
    
        obj
    }

    /**
     * Position layout windows to a grid.
     * 
     * @param obj Layout as JSONObject
     * 
     * @return Returns modified layout object containing
     *         windows tiled to a grid.
     * @see grid(JSONObject obj, Map params)        
     */
    def static grid(JSONObject obj) {
        grid(obj, [:])
    }        
    
    /**
     * Gets basic info about the layout.
     * 
     * We return a map containing layout widht, height,
     * number of windows and actual window
     * JSONObjects as a list.
     * 
     * @return Map of basic parameters.
     */
    private static def getInfo(JSONObject obj) {
        def ret = [:]

        def items = obj.optJSONArray("items")
        
        ret.width = obj.getInt("w")
        ret.height = obj.getInt("h")
        ret.length = (items != null ? items.length() : 1)
        
        ret.windows = []        
        
        if(items != null) {
            for(i in 0..<ret.length) {
                ret.windows << items.optJSONObject(i)
            }
        } else {
            ret.windows << obj.getJSONObject("items")
        }
                
        ret
    }

}