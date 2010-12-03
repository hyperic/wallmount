dojo.provide("hyperic.layout.MoveablePane");

dojo.require("dijit._Templated");
dojo.require("dojox.layout.ContentPane");
dojo.require("dojo.dnd.Moveable");

dojo.declare("hyperic.layout.MoveablePane", 
    [ dojox.layout.ContentPane, dijit._Templated ],
    {
    	
    contentClass: "hypericMoveablePaneContent",
    
    templateString: dojo.cache("hyperic.layout","resources/MoveablePane.html"),
    	
    postCreate: function(){
    	this.inherited(arguments);
    	new dojo.dnd.move.parentConstrainedMoveable(this.domNode, {area: "border", within: true, handle: this.domNode});
    },
    
    close: function(){
    	
    },
    
    hide: function(/* Function? */ callback){
    	
    }
});