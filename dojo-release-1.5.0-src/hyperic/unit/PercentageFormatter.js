dojo.provide("hyperic.unit.PercentageFormatter");

dojo.require("hyperic.unit.SimpleFormatter");
dojo.require("dojo.number");

dojo.declare("hyperic.unit.PercentageFormatter",
    [ hyperic.unit.SimpleFormatter ],{
        
    formatNumber: function(/*Number*/rawValue, f){
        return f(rawValue * this.getMultiplier(),{}) + '%';
    },
    
    getMultiplier: function(){
    	return 100.0;
    }
        
});