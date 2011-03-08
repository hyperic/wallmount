dojo.provide("hyperic.unit.UnitsFormat");

dojo.require("hyperic.unit.UnitsConvert");
dojo.require("hyperic.unit.NoFormatter");
dojo.require("hyperic.unit.CurrencyFormatter");
dojo.require("hyperic.unit.BytesFormatter");
dojo.require("hyperic.unit.BitRateFormatter");
dojo.require("hyperic.unit.DateFormatter");
dojo.require("hyperic.unit.PercentageFormatter");
dojo.require("hyperic.unit.PercentFormatter");

hyperic.unit.UnitsFormat.format = function(/*Object*/val, /*Object*/format, /*String*/locale) {
    // summary:
    //      Formats value stored in UnitNumber
    // val:
    //      Instance of UnitNumber or similar object
    var formatter = hyperic.unit.UnitsFormat.getFormatter(val.units);
    return formatter.format(val, format, locale);
};

hyperic.unit.UnitsFormat.getBaseValue = function(value, unitType, scale){
    // summary:
    //     xxx
	return hyperic.unit.UnitsFormat.getFormatter(unitType).getBaseValue(value, scale);
};

hyperic.unit.UnitsFormat.getScaledValue = function(baseValue, unitType, scale){
    // summary:
    //     xxx
	return hyperic.unit.UnitsFormat.getFormatter(unitType).getScaledValue(baseValue, scale);
};

hyperic.unit.UnitsFormat.getFormatter = function(/*String*/unit){
    // summary:
    //     xxx
    var res; // formatter
    
    // find formatter from array, fall back to no-formatter if
    // correct unit is not found
    if((res = hyperic.unit.UnitsFormat.formatters[unit]) == null)
        return hyperic.unit.UnitsFormat.formatters[hyperic.unit.UnitsConstants.UNIT_NONE];
    return res;
};

//
hyperic.unit.UnitsFormat.parse = function(/*String*/value, unitType, /*String*/locale){
    // summary:
    //     xxx
	var unit  = hyperic.unit.UnitsConvert.getUnitForUnit(unitType);
	var formatter = hyperic.unit.UnitsFormat.getFormatter(unit);
	var un =  formatter.parse(value, unitType, locale);
	return un.getScaledValue(hyperic.unit.UnitsConvert.getScaleForUnit(unitType));
//    return un.getBaseValue();
};


/**
 * List of formatters which are mapped to an array and accessed by
 * id's found from hyperic.unit.UnitsConvert.unitsToUnit and
 * hyperic.unit.UnitsConvert.unitsToScale.
 */
hyperic.unit.UnitsFormat.formatters = [
    new hyperic.unit.NoFormatter(),
    new hyperic.unit.CurrencyFormatter(),
    new hyperic.unit.BytesFormatter(),
    new hyperic.unit.BitRateFormatter(),
    new hyperic.unit.NoFormatter(),//new hyperic.unit.DurationFormatter(),
    new hyperic.unit.DateFormatter(),
    new hyperic.unit.PercentageFormatter(),
    new hyperic.unit.PercentFormatter(),
    new hyperic.unit.NoFormatter(),//new hyperic.unit.ApproxDurationFormatter(),
    new hyperic.unit.NoFormatter()//new hyperic.unit.BytesToBitsFormatter()
];

