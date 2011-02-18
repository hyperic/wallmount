dojo.provide("hyperic.widget.arrowpipe._ArrowPipe");

dojo.require("hyperic.widget.base._WallMountItem");
dojo.require("hyperic.widget.base._Animatable");
dojo.require("hyperic.data.ArrowPipeProperty");


dojo.declare("hyperic.widget.arrowpipe._ArrowPipe",
    [ hyperic.widget.base._WallMountItem,
      hyperic.widget.base._Animatable,
      hyperic.data.ArrowPipeProperty ],{
    // summary:
    //      xxx
    //
    // description:
    //      xxx
    //
    // internals:
    //      Since this class contains a lot of shared code between
    //      horizontal and vertical pipes we generally refer some
    //      of the geographic parameters along the pipe direction.
    // 
    //      This class draws point, etc using x-axis, childs are
    //      responsible to do correct transformations.
    
    // minValueForSpeed: Number
    //      min scale to calculate speed
    minValueForSpeed: 0,
    
    // maxValueForSpeed: Number
    //      max scale to calculate speed
    maxValueForSpeed: 100,
    
    // rotationTime: Number
    //      if speed is set to maximum, how long in millis
    //      should shifting arrows 1000 pixels take
    rotationTime: 2500,
      
    // arrowColor:
    //      xxx
    arrowColor: null,

    
    
    // reverse: Boolean
    //      Used to determine pipe flow direction. Default
    //      directions are from left to right if horizontal,
    //      up to down if vertical. False means default
    //      direction is used.
    reverse: false,

    // internal data
    _lastTimeStamp: 0,
    _shift:0,
    _arrows: null,
    
    _text:null,
    _valueDirty: true,
    
    startup: function(){
        // summary:
        this.plays = 0; // for testing fops
        this.playstime = 0; // for testing fops

        this.inherited(arguments);
        this.draw();
    },

    reset: function(){
        // summary:
        this._arrows = null;
        this._text = null;
        this.inherited(arguments);
    },
        
    getColor: function(){
    	if(this.arrowColor) {
    		return this.arrowColor
    	} else {
    		return "blue";
    	}
    },
    
    resetValue: function(){
       	this._drawAxis(20);
    },
    
    draw: function(){
        // summary:
        this.surface.clear();
        if(this._arrows === null)
            this._createArrows();
        this._drawAxis(20);
    },
    
//    storeCallback: function(arg) {
//    	if(arg != this.value)
//    	   this._valueDirty = true;
//    	this.value = arg;
//    },    

    _createArrowPoints: function(rotation){
        // summary:
        //      Creates points for one arrow.
        var _x = 0;
        var _y = 0;
        var rLength = this._arrowTotalLength();
        var _w = this.rLength;
        var _h = this._arrowWidth();
        var headLength = rLength - this.getArrowGap();
        var headRootLength = headLength - this.getArrowHeadLength();     

        var points = [
            {x:_x, y:_y},
            {x:headRootLength, y:_y},
            {x:headLength, y:((_h - _y) / 2)},
            {x:headRootLength, y:_h},
            {x:_x, y:_h}
            ];
        return points;
    },
    
    _play: function(){
        // summary:

        var _baseSpeed;
        if(this.value >= this.maxValueForSpeed) {
            _baseSpeed = 1;
        } else if(this.value <= this.minValueForSpeed) {
            _baseSpeed = 0;
        } else {
            var _scaleMinMax = this.maxValueForSpeed - this.minValueForSpeed;
            _baseSpeed = (this.value - this.minValueForSpeed) / _scaleMinMax;
        }
        
        //rotationTime is telling how often we should do full rotation in max speed     
        var _now = new Date().getTime();
        var _diff = _now - this._lastTimeStamp;


        if((++this.plays % 200) == 0){
            var fops = 200 / ((_now - this.playstime) / 1000);
            console.log("arrow fops: " + _diff + "/" + fops);         
            this.playstime = _now;
        }



        var _toShiftBase = 1000 / (this.rotationTime / _diff);        
        var _toShift = _toShiftBase * _baseSpeed;

        var rLength = this._arrowTotalLength();
        this._shift = this._shift + _toShift;
        if (this._shift > rLength)
           this._shift = this._shift % rLength; 
        
        this._shiftArrows();
        
        this._lastTimeStamp = _now;
    },
    
    _drawAxis: function(height){
       	//this._valueDirty = false;
    },
    
    asParams: function(){
        // summary:
        //     Returns component parameters as object.
        var paramObj = this.inherited(arguments);
        paramObj['arrowCount'] = this.getArrowCount();
        paramObj['arrowGap'] = this.getArrowGap();
        paramObj['arrowHeadLength'] = this.getArrowHeadLength();
        return paramObj;
    }
        
});