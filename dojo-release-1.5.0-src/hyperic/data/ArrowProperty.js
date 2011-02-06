dojo.provide("hyperic.data.ArrowProperty");

dojo.declare("hyperic.data.ArrowProperty",null,{

    // arrowCount: Object
    //
    // value: how many arrows component is using
    // min: min constraint for value
    // max: max constraint for value

    // arrowWidth: Object
    //
    // value: arrow width
    // min: min constraint for value
    // max: max constraint for value

    constructor: function(){
        this.arrowCount = {value:3, min: 2, max: 6};
        this.arrowWidth = {value:25, min: 15, max: 30};
    },
    
    getArrowCount: function(){
    	return this.arrowCount.value;
    },
    

    getArrowWidth: function(){
        return this.arrowWidth.value;
    }
    
});