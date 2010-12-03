dojo.provide("hyperic.widget.base._Animatable");

dojo.require("dojox.timing._base");

(function(){

    // every timer potentionally creates new thread
    // and eval -> sloooow. so only define
    // one global timer for animatable widgets.
    var _timer = new dojox.timing.Timer(30);
    var _started = false;

    // TODO: since timer is shared, clients should be able to
    // disconnect without stopping it. Last client
    // should close the kiosk, perse

    var _startTimer = function() {
	   if(!_started) {
		  _started = true;
		  _timer.start();
	   }
    };

    var _stopTimer = function() {
       if(_started) {
          _started = false;
          _timer.stop();
       }
    };

    dojo.declare("hyperic.widget.base._Animatable",
        null ,{
        	
        _timerHandle: null,

        constructor: function(){
        	dojo.subscribe("/hyperic/anim/start", dojo.hitch(this, "_animEvent"));
        },
    
        animate: function(/*Boolean*/status){
            if(status) {
                this._timerHandle = dojo.connect(_timer, "onTick", dojo.hitch(this, "_play"));
                _startTimer();
            } else {
            	dojo.disconnect(this._timerHandle);
                _stopTimer();
            }
        },
    
        _animEvent: function(){
        	this._timerHandle = dojo.connect(_timer, "onTick", dojo.hitch(this, "_play"));
            _startTimer();
        },
    
        _play: function(){
    	   // just keep it here so implementors can
    	   // do something useful
        }
    
    });

})();