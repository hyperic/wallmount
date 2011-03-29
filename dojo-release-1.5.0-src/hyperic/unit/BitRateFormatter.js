dojo.provide("hyperic.unit.BitRateFormatter");

dojo.require("hyperic.unit.BinaryFormatter");

dojo.declare("hyperic.unit.BitRateFormatter",
    [ hyperic.unit.BinaryFormatter ],{
            
    getTagName: function(){
        return "b";
    },

    parseTag: function(number, t, tagIdx){
        var scale;
        var tag = t.toLowerCase();
        if(tag == ("b") || tag == ("b/sec")) {
            scale = hyperic.unit.UnitsConstants.SCALE_NONE;
        } else if(tag == ("k") || tag == ("kb") || tag == ("kb/sec")) {
            scale = hyperic.unit.UnitsConstants.SCALE_KILO;
        } else if(tag == ("m") || tag == ("mb") || tag == ("mb/sec")) {
            scale = hyperic.unit.UnitsConstants.SCALE_MEGA;
        } else if(tag == ("g") || tag == ("gb") || tag == ("gb/sec")) {
            scale = hyperic.unit.UnitsConstants.SCALE_GIGA;
        } else if(tag == ("t") || tag == ("tb") || tag == ("tb/sec")) {
            scale = hyperic.unit.UnitsConstants.SCALE_TERA;
        } else if(tag == ("p") || tag == ("pb") || tag == ("pb/sec")) {
            scale = hyperic.unit.UnitsConstants.SCALE_PETA;
        } else {
            // TODO: handle this correctly
            console.log("Unknown bitrate type '" + tag + "' " + tagIdx);
        }
        var parsedNumber = dojo.number.parse(number,{});
        return new hyperic.unit.UnitNumber({value: parsedNumber, units: hyperic.unit.UnitsConstants.UNIT_BITS, scale: scale});
    }
        
});