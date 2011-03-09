dojo.provide("hyperic.data.RangesProperty");

dojo.declare("hyperic.data.RangesProperty",null,{

    // minRange: Object
    //
    // value: value of range min range
    // min: min constraint for value
    // max: max constraint for value

    // internal data
    _rangeData: null,


    constructor: function(){
    },
        
    _setRangesAttr: function(ranges){
        this._rangeData = ranges;
    },

    getInRange: function(value){
    	// summary:
    	//     Returns defined range if matching agains given value
    	//
    	// description:
    	//     xxx
        if(this._rangeData === null) return null;       
        
        for(var i=0; i<this._rangeData.length; i++){
        	var r = this._rangeData[i];
        	if(r.comparator === "&gt;" || r.comparator === ">") {
        		if(value > r.value) return r;
        	} else if(r.comparator === "&lt;" || r.comparator === "<") {
                if(value < r.value) return r;        		
        	}
        }
          
       return null;
    },

    addRange: function(/*Object*/range){
        // summary:
        //      This method is used to add a range to the wallmount component.
        // description:
        //      Creates a range used to determine special behaviour if
        //      metric value spans through the different ranges. For example we
        //      can setup component to change background or text color from
        //      normal -> warning -> alert (aka green/yellow/red)
        // range:
        //      A range is either a hyperic.data.Range object, or a object
        //      with similar parameters (low, high, color, etc.).
        this.addRanges([range]);
    },
    
    addRanges: function(/*Array*/ranges){
        if(!this._rangeData){ 
            this._rangeData = [];
        }
        var range;
        for(var i=0; i<ranges.length; i++){
            range = ranges[i];
            this._rangeData[this._rangeData.length] = range;
        }       
    },
    
    removeRange: function(range){
    	if(this._rangeData == null) return;
        for(var i=0; i<this._rangeData.length; i++){
        	if(this._rangeData[i] === range) {
        	   this._rangeData.splice(i, 1);
        	   break;	
        	}
        }
    },

    removeRanges: function(){
        this._rangeData = null;
    }, 
    
    getRanges: function(){
    	return this._rangeData;
    },
    
    asRangesParams: function(){
    	var paramArr = [];
    	if(!this._rangeData) return paramArr;
    	for(var i=0; i<this._rangeData.length; i++){
    		paramArr.push({value:this._rangeData[i].value, comparator:this._rangeData[i].comparator, color: this._rangeData[i].color});
    	}
    	return paramArr;
    }
    
});