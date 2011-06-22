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

dojo.provide("hyperic.dialog.SaveLayoutDialog");

dojo.require("dijit.Dialog");
dojo.require("dojox.grid.DataGrid");

dojo.declare("hyperic.dialog.SaveLayoutDialog",
    [dijit.Dialog],{
        
    templateString: dojo.cache("hyperic.dialog", "resources/SavelayoutDialog.html"),

    postCreate: function(){
        dojo.connect(dijit.byId("slCancelDialogButton"), "onClick", dojo.hitch(this, "hide"));      
        dojo.connect(dijit.byId("slOkDialogButton"), "onClick", dojo.hitch(this, "_requestSaveLayout"));
        dojo.connect(dijit.byId("sl_name"), "onChange", dojo.hitch(this, "_buttonEnabler"));
        this.inherited(arguments);
    },
    
    
    _buttonEnabler: function(btn){
    	var text = dijit.byId(this.sl_name).get('value');
    	var disabled = true;
    	if(text.length > 0) disabled = false
    	dijit.byId("slOkDialogButton").set('disabled', disabled);
    },

    _requestSaveLayout: function() {
    	var name = dijit.byId(this.sl_name).get('value');    	
    	hyperic.wallmount.LayoutUtil.saveLayout(name);
    },
        
    _onShow: function(){
        this.inherited(arguments);
    }
    
});