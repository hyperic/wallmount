dojo.provide("hyperic.unit.PercentFormatter");

dojo.require("hyperic.unit.PercentageFormatter");

dojo.declare("hyperic.unit.PercentFormatter",
    [ hyperic.unit.PercentageFormatter ],{
            
    getMultiplier: function(){
        return 1.0;
    }
        
});