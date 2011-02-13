dojo.provide("hyperic.dialog.DashboardSizeDialog");

dojo.require("dijit.Dialog");
dojo.require("dojox.grid.DataGrid");

dojo.declare("hyperic.dialog.DashboardSizeDialog",
    [dijit.Dialog],{
        
    _grid: null,
    _store: null,
    
    layoutsUrl: '',
    
    templateString: dojo.cache("hyperic.dialog", "resources/DashboardSizeDialog.html"),

    postCreate: function(){
        dojo.connect(dijit.byId("dsCancelDialogButton"), "onClick", dojo.hitch(this, "hide"));    	
        dojo.connect(dijit.byId("dsOkDialogButton"), "onClick", dojo.hitch(this, "_requestSize"));
        dojo.connect(dijit.byId("ds1"), "onClick", dojo.hitch(this, "_buttonEnabler", "ds1"));      
        dojo.connect(dijit.byId("ds2"), "onClick", dojo.hitch(this, "_buttonEnabler", "ds2"));      
        dojo.connect(dijit.byId("dsc"), "onClick", dojo.hitch(this, "_buttonEnabler", "dsc"));      
        this.inherited(arguments);
    },
    
    _requestSize: function(){
        var w;
        var h;    	
        if(dijit.byId("ds1").get('checked')) {
        	w = 900;
        	h = 700;
        } else if(dijit.byId("ds2").get('checked')) {
            w = 1280;
            h = 1024;        	
        } else {
            var ds_width = dijit.byId(this.ds_width);
            w = ds_width.get('value');
            var ds_height = dijit.byId(this.ds_height);
            h = ds_height.get('value');
        }
        dojo.style("wallmountpane", "width", w);
        dojo.style("wallmountpane", "height", h);
    },
    
    _buttonEnabler: function(btn){
    	var isCustom = (btn=="dsc");
    	
        var ds_width = dijit.byId(this.ds_width);
        var ds_height = dijit.byId(this.ds_height);
        
        ds_width.set('disabled',!isCustom);         
        ds_height.set('disabled',!isCustom);           
    },

    _updateSelectors: function(){
    	var w = dojo.style("wallmountpane", "width");
        var h = dojo.style("wallmountpane", "height");


        var isDs1 = false;
        if(w==900 && h==700) {
        	isDs1 = true;
        }        
        var ds1 = dijit.byId("ds1");
        ds1.set('checked',isDs1);

        var isDs2 = false;
        if(w==1280 && h==1024) {
            isDs2 = true;
        }
        var ds2 = dijit.byId("ds2");
        ds2.set('checked',isDs2);

        var isCustom = !isDs1 && !isDs2;
                        
        var ds_width = dijit.byId(this.ds_width);
        ds_width.set('value',w);
        var ds_height = dijit.byId(this.ds_height);
        ds_height.set('value',h);
        
        ds_width.set('disabled',!isCustom);        	
        ds_height.set('disabled',!isCustom);           
        
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
    	this._updateSelectors();
        this.inherited(arguments);
    }
    
});