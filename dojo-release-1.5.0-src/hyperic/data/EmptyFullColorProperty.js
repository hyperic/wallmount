dojo.provide("hyperic.data.EmptyFullColorProperty");

dojo.declare("hyperic.data.EmptyFullColorProperty",null,{

    constructor: function(){
        this.emptyColor = "#008000"; 
        this.fullColor = "#ff0000"; 
    },
    
    getEmptyColor: function(){
        return this.emptyColor;
    },
    
    _setEmptyColorAttr: function(color){
    	this.emptyColor = color;
    },

    getFullColor: function(){
        return this.fullColor;
    },
    
    _setFullColorAttr: function(color){
        this.fullColor = color;        
    }
    
});