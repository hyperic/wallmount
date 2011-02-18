dojo.provide("hyperic.data.LabelProperty");

dojo.declare("hyperic.data.LabelProperty",null,{

    constructor: function(){
    	this.labelColor = "#000000"; 
    },
    
    getLabelColor: function(){
    	return this.labelColor;
    }

});