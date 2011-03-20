dojo.provide("hyperic.layout.LayoutName");

dojo.require("dijit._Templated"); 
dojo.require("dijit._Widget");

dojo.declare("hyperic.layout.LayoutName", 
    [ dijit._Widget,
      dijit._Templated ], {
    // summary:
    //     Component which makes it easier to store current layout name. 	
    
    layoutName: "",

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
        this.containerNode.innerHTML = this._compileName(layoutName);
    },
    
    _compileName: function(layoutName){
    	return "Layout Name:[" + layoutName + "]";
    }
    	
});
