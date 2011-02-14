dojo.provide("hyperic.data.ResourceTree");

dojo.require("dijit.Tree");
dojo.require("dijit.tree.dndSource");

dojo.declare("hyperic.data.ResourceTree", dijit.Tree, {

    checkAcceptance: function(source, nodes){
    	// We don't want to dnd inside the tree.
    	return false;
    },

    getIconClass: function(/*dojo.data.Item*/ item, /*Boolean*/ opened){
    	// define tree icons
    	
        if(item.eid){
           if(item.eid.indexOf("1:") === 0)
               return "hypericIconPlatform";        	
           if(item.eid.indexOf("2:") === 0)
               return "hypericIconServer";            
           if(item.eid.indexOf("3:") === 0)
               return "hypericIconService";            
        }
    	
        if(item.mid){
        	return "hypericIconMetric";
        }    	
    	           
        return (!item || this.model.mayHaveChildren(item)) ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf"
    }

});