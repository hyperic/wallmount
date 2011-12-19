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

import org.json.JSONArray
import org.json.JSONObject
import org.hyperic.util.Runnee
import org.hyperic.hq.product.GenericPlugin
import org.hyperic.hq.context.Bootstrap
import org.springframework.core.io.Resource

/**
 * 
 */
class DyntemplateController extends BaseWallmountController {
   
    private static BASE_DYN_PATH = "hqu/wmvisualizer/dyn/"
    
    private static startCodeContent = null
    private static endCodeContent = null

    /**
     * Executes a given dynamic layout.    
     */
    def executeDynlayout(params) {
        def dynlayout = params.getOne('dynlayout')
        def fileResource = Bootstrap.getResource(BASE_DYN_PATH + dynlayout + ".groovy")
        def tmplCode = ""
        fileResource.file.withReader("UTF-8") { r ->
            tmplCode = r.text
        }
        def res = executeCode(tmplCode)
        render(inline:"${res}", contentType:'text/json-comment-filtered')
    }

    /**
     * Returns existing dynamic layout names
     * which can be executed.
     */
    def getDynlayouts(params) {
        JSONObject obj = new JSONObject()
        
        JSONArray items = new JSONArray()
        
        dyntemplates.each{
            items.put(new JSONObject().put('name', it))
        }
        obj.put('items', items)
           
        render(inline:"${obj}", contentType:'text/json-comment-filtered')
    }


    private String executeCode(code) {
        log.info "Requested to execute dyn template \n${code}\n"
        File tmp = File.createTempFile('dyntemplate', null)
        log.info "Writing tmp file: ${tmp.absolutePath}"
        tmp.withWriter("UTF-8") { writer ->
            writer.write(startCode)
            writer.write(code)
            writer.write(endCode)
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
            
            Binding binding = new Binding()
            binding.setVariable("resourceHelper", resourceHelper)
            binding.setVariable("util", DynlayoutUtils.class)
            binding.setVariable("api", new DynResourceApi(user))
            def runnee = [run: {res = eng.run(script, binding)}] as Runnee
            
            runnee.run()


            log.info "Result: [${res}]"
        } catch(Throwable e) {
            log.info "Exception thrown", e
        }
        
        long end = now()
//        [result: "${res}",
//         timeStatus: "Executed in ${end - start} ms"]
        res
    }

    /**
     * Returns template directory for user dynamic layouts
     */
    protected def getUserDynTemplateDir() {
        templateDir // just make sure base dir exists
        Resource templateResource = Bootstrap.getResource("WEB-INF/wmvisualizerTemplates/dyn");
        if(!templateResource.exists()) {
            def dir = templateResource.file
            dir.mkdir()
            return dir;
        }
        return templateResource.getFile();
    }

    /**
     * Returns template directory for system dynamic layouts
     */
    protected def getSystemDynTemplateDir() {
        Resource templateResource = Bootstrap.getResource("hqu/wmvisualizer/dyn");
        return templateResource.getFile();
   }

    /**
     * Returns list of stored user dynamic template names.
     */
    protected def getDyntemplates() {
        def res = []
        for (f in systemDynTemplateDir.listFiles()) {
            if (!f.name.endsWith('.groovy'))
               continue
            def fname = f.name[0..-8]
            res << fname
        }
        log.debug("Found files: " + res)
        res.sort()
    }

    /**
     * 
     */
    def getStartCode() {
        if(startCodeContent == null) {
            def fileResource = Bootstrap.getResource(BASE_DYN_PATH + "START_CODE")
            fileResource.file.withReader("UTF-8") { r ->
                startCodeContent = r.text
            }
        }
        startCodeContent
    }

    /**
     *
     */
    def getEndCode() {
        if(endCodeContent == null) {
            def fileResource = Bootstrap.getResource(BASE_DYN_PATH + "END_CODE")
            fileResource.file.withReader("UTF-8") { r ->
                endCodeContent = r.text
            }
        }
        endCodeContent
    }


}