dojo.provide("hyperic.unit.BitRateFormatter");

dojo.require("hyperic.unit.BinaryFormatter");

dojo.declare("hyperic.unit.BitRateFormatter",
    [ hyperic.unit.BinaryFormatter ],{
        
    formatNumber: function(value, f){
        return f(value,{});
    },
    
    getTagName: function(){
        return "b";
    }
        
});