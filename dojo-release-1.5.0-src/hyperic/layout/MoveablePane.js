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
        dojo.publish("globalEvents", ["closing MoveablePane"]);
        this.hide(dojo.hitch(this,function(){
            this.destroyRecursive();
        })); 
    },
    
    hide: function(/* Function? */ callback){
        // summary: Close, but do not destroy this FloatingPane
        dojo.fadeOut({
            node:this.domNode,
            duration:400,
            onEnd: dojo.hitch(this,function() { 
                this.domNode.style.display = "none";
                this.domNode.style.visibility = "hidden"; 
                if(callback){
                    callback();
                }
            })
        }).play();
    }
});