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

import java.util.Map;
import org.hyperic.hq.product.GenericPlugin
import org.hyperic.util.Runnee

import org.json.JSONObject
import org.json.JSONArray

class DyntemplateController extends BaseWallmountController {
    
    def DyntemplateController() {
    }

    /**
     * Frontend hqu method for script execution.
     */
    def execute(params) {
        log.info "Params is ${params}"
        executeCode(params.getOne('script'))
    }
    
    /**
     * Returns dyn layout names as json.
     */
    def getDynLayouts(params) {
        JSONObject obj = new JSONObject()        
        JSONArray items = new JSONArray()
        
        dyntemplates.each{
            items.put(new JSONObject().put('name', it))
        }
        obj.put('items', items)

        render(inline:"${obj}", contentType:'text/json-comment-filtered')
    }

    /**
     * Executes given groovy script.
     * 
     * @param name Name of the script without '.groovy'
     */
    private Map executeCode(name) {
        
        log.info "Requested to execute script\n${name}\n"
        
        File tmp = File.createTempFile('wmdyn', null)
        log.info "Writing tmp file: ${tmp.absolutePath}"
        tmp.withWriter("UTF-8") { writer ->
            writer.write(buildDynTemplate(name))
        }
        
        def eng = new GroovyScriptEngine('.', Thread.currentThread().contextClassLoader)
        
        def res
        long start = now()
        
        try {
            def script
            if (GenericPlugin.isWin32()) {
                //'file:/' spec required for windows
                script = 'file:/' + tmp.absolutePath
            } else {
                script = tmp.absolutePath
            }
            
            def binding = [api:new WmTemplateApi(user)] as Binding
            def runnee = [run: {res = eng.run(script, binding)}] as Runnee            
            runnee.run()
            log.debug "Result: ${res}"
        } catch(Throwable e) {
            log.info "Exception thrown", e
            def sw = new StringWriter()
            def pw = new PrintWriter(sw)
            e.printStackTrace(pw)
            pw.flush()
            res = sw.toString()
        }
        
        long end = now()
        render(inline:"${res}", contentType:'text/json-comment-filtered')
    }
    
}