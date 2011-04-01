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

dojo.provide("hyperic.util.LayoutTestWindow");

dojo.declare("hyperic.util.LayoutTestWindow", null, {
    // summary:
    //      Creates a popup window.
    //  description:
    //      Builds a popup window without the need of an href
    //      Supplies convenience functions for setting 
    //      parameters and grabbing events.
    //      This code is very experimental. Although it should
    //      work as advertised, it's missing some functionality
    //      like an href. Style sheets could use some support.
    
    // name: String
    //      The name of the window and how it is referenced
    name:"wallmount_layout_test_window",
    
    //  title: String
    //      The name in the title bar 
    title:"Wallmount Layout Test",
    
    // color: String
    //      Background color of page. Used if no style sheet is 
    //      supplied.
    color:"#ffffff",
    
    // x,y,w,h: Number
    //      Position and size of the window on open
    x:10,
    y:10,
    w:800,
    h:800,
    
    //  params: Number, 1 | 0
    //      Shows or hides the features of the popup window
    statusBar:0,
    menuBar:0,
    addressBar:0,
    scrollBar:0,
    resizable:0,
    
    // context: String
    //      The HTML to be inserted in the body
    content:'<div id="dojoWindow">Title of this page is ${title}</div>',
    
    // layoutJson: JSON String
    // layout to use
    layoutJson:'',
    
    //  openOnInit: Boolean
    //      Whether the window opens on init - else
    //      waits for the open() method
    openOnInit: false,
    
    constructor: function(options){
        dojo.mixin(this, options);
        if(this.openOnInit){
            this.open();    
        }
        dojo.connect(window, "unload", this, "destroy");
    },
    onResize: function(){
        // summary:
        //      stub that fires on popup resize
        //console.log("resize.")
    },
    onClose: function(){
        // summary:
        //      stub that fires on popup close
        //console.log("closed.")
    },
    onLoad: function(){
        // summary:
        //      stub that fires on popup load
        //console.log("loaded.");
    },
    
    close: function(){
        // summary:
        //      Closes the window
        if(!this.win){ return; }
        this.disconnect();
        this.win.close();
        this.win = null;
    },
    setContent: function(id, str){
        // summary:
        //      Sets innerHTML content in a node specified
        //      by the id
        if(!this.win){ return; }
        this.byId(id).innerHTML = str;  
    },
    connect: function(id, event, scope, method){
        //  summary:
        //      Convenience method for connecting to 
        //      elements of the popup
        if(!this.win){ return; }
        console.log("connect")
        var c = dojo.withGlobal(this.win, "connect", dojo, [this.byId(id), event, scope, method]);
        if(!this._connects){ this._connects = [];}
        this._connects.push(c);
    },
    disconnect: function(pointer){
        //  summary:
        //      Disconnects the popups. If a pointer
        //      is passed, just discconects that one.
        //      (untested)
        if(pointer){
            dojo.disconnect(pointer);
        }else if(this._connects){
            dojo.forEach(this._connects, dojo.disconnect, dojo);
            this.win.onunload = null;
            this.win.onresize = null;
            this.win.onload = null;
        }
    },
    byId: function(id){
        //  summary:
        //      Convenience method for getting
        //      elements of the popup
        if(!this.win){ return false; }
        return dojo.withGlobal(this.win, "byId", dojo, [id]);
    },
    open: function(){
        //  summary:
        //      Opens the popup
        if(this.win){ return; }
        var features = "status="+this.statusBar+",menubar="+this.menuBar+",resizable="+this.resizable+",top=" + this.y + ",left=" + this.x + ",width=" + this.w + ",height=" + this.h + ",scrollbars="+this.scrollBar+",addressbar="+this.addressBar;
        var win = window.open("", this.name, features);
        if (!win) {
            var msg = "Could not open a pop-up window, most likely because of a blocker."
            alert(msg);
            return;
        }
        this.win = win;
        this.doc = this.win.document;

        var HTMLstring = this._stringRepl(this.content);
         
        this.doc.write(HTMLstring);
        this.doc.close();
        
        this.win.onunload = this.onClose;
        this.win.onresize = this.onResize;
        this.win.onload = this.onLoad;
    },
    
    destroy: function(){
        //  summary:
        //      Destory the popup
        this.close();
        delete this;
    },

    _stringRepl: function(tmpl){
        // summary:
        //      Does substitution of ${foo} type properties in template string
        var className = this.declaredClass, _this = this;
        // Cache contains a string because we need to do property replacement
        // do the property replacement
        return dojo.string.substitute(tmpl, this, function(value, key){
            if(key.charAt(0) == '!'){ value = dojo.getObject(key.substr(1), false, _this); }
            if(typeof value == "undefined"){ throw new Error(className+" template:"+key); } // a debugging aide
            if(value == null){ return ""; }
            // Substitution keys beginning with ! will skip the transform step,
            // in case a user wishes to insert unescaped markup, e.g. ${!foo}
            return value;
            
            // No substitution for now...
            //return key.charAt(0) == "!" ? value :
            //value.toString().replace(/"/g,"&quot;");
        }, this);
    }
    
    
});
