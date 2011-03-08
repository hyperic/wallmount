dojo.provide("hyperic.unit.NoFormatter");

dojo.require("hyperic.unit.SimpleFormatter");

dojo.declare("hyperic.unit.NoFormatter",
    [ hyperic.unit.SimpleFormatter ],{
    	
    formatNumber: function(/*Number*/rawValue, f){
    	return f(rawValue,{});
    },

    parseValue: function(/*String*/rawValue, f){
        return f(rawValue,{});
    }
        
});