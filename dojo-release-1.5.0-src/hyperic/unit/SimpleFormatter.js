dojo.provide("hyperic.unit.SimpleFormatter");

dojo.require("dojo.number");
dojo.require("hyperic.unit.UnitNumber");
dojo.require("hyperic.unit.UnitsConstants");

dojo.declare("hyperic.unit.SimpleFormatter",
    null,{

    format: function(/*Object*/val) {
        return this.formatNumber(val.value,this.getNumberFormat());
    },
      
    getNumberFormat: function() {
        // summary:
        //      defines the number formatter. We define this
        //      as a function for implementors to define
        //      its own formatters
        return dojo.number.format;
    },

    parse: function(/*String*/val, unitType, /*String*/locale){
        // summary:
        //console.log("parsing:" + val + " with type " + unitType);
        var parsedNumber = this.parseValue(val,this.getParser());
        return new hyperic.unit.UnitNumber({value: parsedNumber,
                                            units: hyperic.unit.UnitsConstants.UNIT_NONE,
                                            scale: hyperic.unit.UnitsConstants.SCALE_NONE});
    },

    getParser: function() {
        // summary:
        return dojo.number.parse;
    },

    getBaseValue: function(/*double*/value, /*int*/scale){
        return value;
    },

    getScaledValue: function(/*Number*/value, /*int*/targScale){
        return value;
    }

});