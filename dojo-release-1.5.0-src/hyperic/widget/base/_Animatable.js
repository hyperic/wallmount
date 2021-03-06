/**
 * NOTE: This copyright does *not* cover user programs that use HQ
 * program services by normal system calls through the application
 * program interfaces provided as part of the Hyperic Plug-in Development
 * Kit or the Hyperic Client Development Kit - this is merely considered
 * normal use of the program, and does *not* fall under the heading of
 *  "derived work".
 *
 *  Copyright (C) [2011], VMware, Inc.
 *  This file is part of HQ.
 *
 *  HQ is free software; you can redistribute it and/or modify
 *  it under the terms version 2 of the GNU General Public License as
 *  published by the Free Software Foundation. This program is distributed
 *  in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 *  even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 *  PARTICULAR PURPOSE. See the GNU General Public License for more
 *  details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 *  USA.
 *
 */

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