dojo.provide("hyperic.dnd.SingleSource");

dojo.require("hyperic.dnd.Source");

dojo.declare("hyperic.dnd.SingleSource",[hyperic.dnd.Source],{
// summary:
//     Provides customized dnd source functionalities.

    constructor: function(/*DOMNode|String*/node, /*dojo.dnd.__SourceArgs?*/params){
        
    },
    
    onDropExternal: function(source, nodes, copy){
    	this.selectAll();
    	this.deleteSelectedNodes();
    	this.inherited(arguments);
    }

});