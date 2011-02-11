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
    	console.log("l name:" + lName);
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