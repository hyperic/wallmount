dojo.provide("hyperic.data.RangeProperty");

dojo.declare("hyperic.data.RangeProperty",null,{

    // minRange: Object
    //
    // value: value of range min range
    // min: min constraint for value
    // max: max constraint for value

    // maxRange: Object
    //
    // value: value of range max range
    // min: min constraint for value
    // max: max constraint for value

    constructor: function(){
        this.lowRangeObj = {value:0, min: 0, max: 100};
        this.highRangeObj = {value:100, min: 0, max: 999999999};
    },
    
    getLowRange: function(){
        return this.lowRangeObj.value;
    },
    
    _setLowRangeAttr: function(value){
        this.lowRangeObj.value = value;
    },

    getHighRange: function(){
        return this.highRangeObj.value;
    },
    
    _setHighRangeAttr: function(value){
        this.highRangeObj.value = value;
    }
    
});