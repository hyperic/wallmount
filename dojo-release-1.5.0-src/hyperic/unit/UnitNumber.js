dojo.provide("hyperic.unit.UnitNumber");

dojo.declare("hyperic.unit.UnitNumber",
    null,{
    
    // value: Number
    // raw metric value
    value: 0,

    // units: Number
    // mapping to hyperic.unit.UnitsConvert.unitsToUnit
    units: 0,

    // scalse: Number
    // mapping to hyperic.unit.UnitsConvert.unitsToScale
    scale: 0,
    
    constructor: function(args){
        dojo.mixin(this, args);
    },
    
    getBaseValue: function(formatted) {
        return hyperic.unit.UnitsFormat.getBaseValue(this.value, this.units, this.scale, formatted);
    },

    getScaledValue: function(/*Integer*/targScale) {
        return hyperic.unit.UnitsFormat.getScaledValue(this.getBaseValue(), this.units, targScale);
    }
            
});