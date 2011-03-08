dojo.provide("hyperic.unit.BytesFormatter");

dojo.require("hyperic.unit.BinaryFormatter");
dojo.require("hyperic.unit.UnitsConstants");
dojo.require("dojo.number");


dojo.declare("hyperic.unit.BytesFormatter",
    [ hyperic.unit.BinaryFormatter ],{
        
    formatNumber: function(value, f){
        return f(value,{});
    },
    
    getTagName: function(){
    	return "B";
    },
    
    parseTag: function(number, t, tagIdx){
        var scale;
        var tag = t.toLowerCase();
        if(tag == ("b") || tag == ("bytes")) {
            scale = hyperic.unit.UnitsConstants.SCALE_NONE;
        } else if(tag == ("k") || tag == ("kb")) {
            scale = hyperic.unit.UnitsConstants.SCALE_KILO;
        } else if(tag == ("m") || tag == ("mb")) {
            scale = hyperic.unit.UnitsConstants.SCALE_MEGA;
        } else if(tag == ("g") || tag == ("gb")) {
            scale = hyperic.unit.UnitsConstants.SCALE_GIGA;
        } else if(tag == ("t") || tag == ("tb")) {
            scale = hyperic.unit.UnitsConstants.SCALE_TERA;
        } else if(tag == ("p") || tag == ("pb")) {
            scale = hyperic.unit.UnitsConstants.SCALE_PETA;
        } else {
        	// TODO: handle this correctly
            console.log("Unknown byte type '" + tag + "' " + tagIdx);
        }
        var parsedNumber = dojo.number.parse(number,{});
        return new hyperic.unit.UnitNumber({value: parsedNumber, units: hyperic.unit.UnitsConstants.UNIT_BYTES, scale: scale});
//        return this.getBaseValue(parsedNumber, scale);
    }
    
        
});