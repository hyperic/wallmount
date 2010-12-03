dojo.provide("hyperic.unit.BytesFormatter");

dojo.require("hyperic.unit.BinaryFormatter");

dojo.declare("hyperic.unit.BytesFormatter",
    [ hyperic.unit.BinaryFormatter ],{
        
    formatNumber: function(value, f){
        return f(value,{});
    },
    
    getTagName: function(){
    	return "B";
    }
        
});