dojo.provide("hyperic.data.ForestStoreModel");

dojo.require("dijit.tree.ForestStoreModel");

dojo.declare("hyperic.data.ForestStoreModel", dijit.tree.ForestStoreModel, {

    constructor: function(/* object */ keywordParameters){
    	this.query = "platforms";
    }

});