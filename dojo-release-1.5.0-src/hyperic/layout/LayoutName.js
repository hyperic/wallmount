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

dojo.provide("hyperic.layout.LayoutName");

dojo.require("dijit._Templated"); 
dojo.require("dijit._Widget");

dojo.declare("hyperic.layout.LayoutName", 
    [ dijit._Widget,
      dijit._Templated ], {
    // summary:
    //     Component which makes it easier to store current layout
	//     and theme names.
    
    layoutName: "",
    
    // Need to set default name to Basic
    themeName: "Basic",

    templateString: dojo.cache("hyperic.layout","resources/LayoutName.html"),
    
    startup: function(){
    	this.inherited(arguments);
    },
    
    postCreate: function(){
    	this.inherited(arguments);
    	this.containerNode.innerHTML = this._compileName("");
    },
    
    getLayoutName: function(){
        return this.layoutName;	
    },
    
    setLayoutName: function(layoutName){
    	this.layoutName = layoutName;
        this.containerNode.innerHTML = this._compileName();
    },

    getThemeName: function(){
        return this.themeName;	
    },
    
    setThemeName: function(themeName){
    	this.themeName = themeName;
        this.containerNode.innerHTML = this._compileName();
    },

    _compileName: function(){
    	return "Layout Name:[" + this.layoutName + "] Theme:[" + this.themeName + "]";
    }
    	
});
