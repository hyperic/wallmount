dojo.provide("hyperic.data.GroupsStoreModel");

dojo.require("dijit.tree.ForestStoreModel");

dojo.declare("hyperic.data.GroupsStoreModel", dijit.tree.ForestStoreModel, {

    constructor: function(/* object */ keywordParameters){
        this.query = "groups";
    }

});