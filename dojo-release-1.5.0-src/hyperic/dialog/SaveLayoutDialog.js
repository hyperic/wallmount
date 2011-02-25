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