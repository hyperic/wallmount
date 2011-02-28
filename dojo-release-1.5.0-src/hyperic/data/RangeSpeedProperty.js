dojo.provide("hyperic.data.RangeSpeedProperty");

dojo.declare("hyperic.data.RangeSpeedProperty",null,{

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

    // speedTime: Object
    //
    // value: speed time to do full rotation or full pipe slide
    //        when component is its full speed.
    // min: min constraint for value
    // max: max constraint for value

    constructor: function(){
        this.minRangeObj = {value:0, min: 0, max: 100};
        this.maxRangeObj = {value:100, min: 0, max: 999999999};
        this.speedTimeObj = {value:1000, min: 500, max: 10000};
    },
    
    getMinRange: function(){
        return this.minRangeObj.value;
    },
    
    _setMinRangeAttr: function(value){
        this.minRangeObj.value = value;
    },

    getMaxRange: function(){
        return this.maxRangeObj.value;
    },
    
    _setMaxRangeAttr: function(value){
        this.maxRangeObj.value = value;
    },

    getSpeedTime: function(){
        return this.speedTimeObj.value;
    },
    
    _setSpeedTimeAttr: function(value){
        this.speedTimeObj.value = value;
    }
    
});