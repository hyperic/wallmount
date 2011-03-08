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
    },
    
    parseValue: function(/*String*/rawValue, f){
    	//console.log("parseValue:"+rawValue);
        //console.log("parseValue2:"+f(rawValue,{type:'percent'}));
        return f(rawValue,{type:'percent'});
    },

    parse: function(/*String*/val, unitType, /*String*/locale){
        // summary:
        //console.log("parsing:" + val + " with type " + unitType);
        var parsedNumber = this.parseValue(val,this.getParser());
        return new hyperic.unit.UnitNumber({value: parsedNumber,
                                            units: hyperic.unit.UnitsConstants.UNIT_PERCENTAGE,
                                            scale: hyperic.unit.UnitsConstants.SCALE_NONE});
    },
    
        
});