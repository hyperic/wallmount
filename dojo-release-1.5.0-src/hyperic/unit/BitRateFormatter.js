dojo.provide("hyperic.unit.BitRateFormatter");

dojo.require("hyperic.unit.BinaryFormatter");

dojo.declare("hyperic.unit.BitRateFormatter",
    [ hyperic.unit.BinaryFormatter ],{
            
    getTagName: function(){
        return "b";
    }
        
});