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

dojo.provide("hyperic.dialog.LoadLayoutDialog");

dojo.require("dijit.Dialog");
dojo.require("dojox.grid.DataGrid");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojo.data.ItemFileReadStore");

dojo.declare("hyperic.dialog.LoadLayoutDialog",
    [dijit.Dialog],{
    	
    _grid: null,
    _store: null,
    
    layoutsUrl: '',
    
    templateString: dojo.cache("hyperic.dialog", "resources/LoadLayoutDialog.html"),
    
    _createGrid: function(){
    	console.log("create grid");
        this._store = new dojo.data.ItemFileReadStore({url: this.layoutsUrl});        
    	var layout = [{name: 'Layout Name', field: 'name', width: "100%"}];
        this._grid = new dojox.grid.DataGrid({
            id: "hypericSelectLayoutGrid",
            store: this._store,
            selectionMode: "single",
            structure: layout
            }, document.createElement('div'));
        this._grid.canSort=function(){return false}; 
        this.gridNode.appendChild(this._grid.domNode);
        this._grid.startup();
        
        dojo.connect(dijit.byId("llCancelDialogButton"), "onClick", dojo.hitch(this, "hide"));
        dojo.connect(dijit.byId("llOkDialogButton"), "onClick", dojo.hitch(this, "_requestLayout"));
        dojo.connect(this._grid, "onRowClick", dojo.hitch(this, "_rowClick"));
    },
    
    _loadLayouts: function(){
        dijit.byId("llOkDialogButton").set('disabled', true);
        this._grid.selection.clear();
        this._store = new dojo.data.ItemFileReadStore({url: this.layoutsUrl});
        this._grid.setStore(this._store);
    },

    _requestLayout: function() {
    	var selection = this._grid.selection.getSelected();
    	var lName = selection[0].name;
    	dojo.publish("/hyperic/layout/new", [lName]);
    },
    
    _rowClick: function() {
    	dijit.byId("llOkDialogButton").set('disabled', false);
    },
    
    _onShow: function(){
    	if(!this._grid){
    		this._createGrid();
    	} else {
    		this._loadLayouts();
    	}
    	this.inherited(arguments);
    }
    
});