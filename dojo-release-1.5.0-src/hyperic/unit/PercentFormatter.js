dojo.provide("hyperic.unit.PercentFormatter");

dojo.require("hyperic.unit.PercentageFormatter");

dojo.declare("hyperic.unit.PercentFormatter",
    [ hyperic.unit.PercentageFormatter ],{
            
    getMultiplier: function(){
        return 1.0;
    },

    parse: function(/*String*/val, unitType, /*String*/locale){
        // summary:
        var parsedNumber = this.parseValue(val,this.getParser());
        return new hyperic.unit.UnitNumber({value: parsedNumber,
                                            units: hyperic.unit.UnitsConstants.UNIT_PERCENT,
                                            scale: hyperic.unit.UnitsConstants.SCALE_NONE});
    },
        
});