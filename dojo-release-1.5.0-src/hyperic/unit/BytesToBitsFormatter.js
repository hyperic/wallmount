dojo.provide("hyperic.unit.BytesToBitsFormatter");

dojo.require("hyperic.unit.BitRateFormatter");

dojo.declare("hyperic.unit.BytesToBitsFormatter",
    [ hyperic.unit.BitRateFormatter ],{
        
    createFormattedValue: function(value, scale, fmt) {
    	arguments[0] = arguments[0]*8;
    	return this.inherited(arguments);
    }
});