dojo.provide("hyperic.data.ResourceTree");

dojo.require("dijit.Tree");
dojo.require("dijit.tree.dndSource");

dojo.declare("hyperic.data.ResourceTree", dijit.Tree, {

//    dndParams: ["onDndDrop","itemCreator","onDndCancel","checkAcceptance", "checkItemAcceptance", "dragThreshold", "betweenThreshold", "copyOnly"],

//    constructor: function(){
//    	this.dndController = new dijit.tree.dndSource(this,{copyOnly:true});
//    },
    
    /*=====
    We don't want to dnd inside the tree. 
    =====*/
    checkAcceptance: function(source, nodes){
    	return false;
    },

    getIconClass: function(/*dojo.data.Item*/ item, /*Boolean*/ opened){
    	// XXX: redo this
    	if(item.id){
    	   if(item.id.indexOf("r-1") === 0)
               return "hypericIconPlatform";
           else if(item.id.indexOf("m") === 0)
               return "hypericIconMetric";
           else if(item.id.indexOf("3") === 0)
               return "hypericIconService";
           else if(item.id.indexOf("r-3") === 0)
               return "hypericIconService";
    	}

        if(item.$ref){
          if(item.$ref.indexOf("r-1") === 0)
               return "hypericIconPlatform";
           else if(item.$ref.indexOf("m") === 0)
               return "hypericIconMetric";
           else if(item.$ref.indexOf("3") === 0)
               return "hypericIconService";
           else if(item.$ref.indexOf("r-3") === 0)
               return "hypericIconService";
        }
    	           
        return (!item || this.model.mayHaveChildren(item)) ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf"
    }

});