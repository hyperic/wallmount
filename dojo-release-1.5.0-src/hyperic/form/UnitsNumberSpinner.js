dojo.provide("hyperic.form.UnitsNumberSpinner");

dojo.require("dijit.form.NumberSpinner");
dojo.require("hyperic.unit.UnitsConvert");
dojo.require("hyperic.unit.UnitsFormat");

dojo.declare("hyperic.form.UnitsNumberSpinner",
    [dijit.form.NumberSpinner], {
    // summary:
    //     NumberSpinner extension to support hyperic units.
    //
    // description:
    //     xxx
    
    // units: String
    //     Hyperic metric unit
    units: 'none',

    format: function(/*Number*/ value, /*dojo.number.__FormatOptions*/ constraints){
        // summary:
        //     Formats real number to used units
        //
        // description:
        //     xxx
        var val = hyperic.unit.UnitsConvert.convert(value, this.units);
        //console.log("format:"+value+" "+val);
        return val;
        return hyperic.unit.UnitsConvert.convert(value, this.units);
    },
    
    parse: function(value, constraints) {   
        // summary:
        //     Parses input back to real number
        //
        // description:
        //     xxx
        var parsedValue = hyperic.unit.UnitsFormat.parse(value, this.units);
        var roundedNumber;
        // TODO: determine correct rounding
        if(this.units === 'percentage' || this.units === 'sec') {
            roundedNumber = parsedValue;    
        } else {
            roundedNumber = dojo.number.round(parsedValue);
        }

        //console.log("UnitsNumberSpinner.parse:"+value+" "+parsedValue);
        //console.log("roundedNumber:" + roundedNumber);

        return roundedNumber;
    },
    
    isValid: function(/*Boolean*/ isFocused){
        // summary:
        //     Validates user input
        //
        // description:
        //     xxx
        return true;
    },
    
    adjust: function(/* Object */ val, /*Number*/ delta){
        // summary:
        //     Adjusting value based on unit and its scale factor
        //
        // description:
        //     xxx
        //console.log("adjust:"+val+' '+delta);
//        if(this.units === 'B') return val + 100*delta;
        if(this.units === 'percentage') return val + 0.01*delta;
        return this.inherited(arguments);
    }
  
});