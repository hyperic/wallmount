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

dojo.provide("hyperic.widget.arrowpipe._ArrowPipe");

dojo.require("hyperic.widget.base._WallMountItem");
dojo.require("hyperic.widget.base._Animatable");
dojo.require("hyperic.data.ArrowPipeProperty");
dojo.require("hyperic.data.RangeSpeedProperty");
dojo.require("hyperic.data.RangesProperty");
dojo.require("hyperic.data.LabelProperty");


dojo.declare("hyperic.widget.arrowpipe._ArrowPipe",
    [ hyperic.widget.base._WallMountItem,
      hyperic.widget.base._Animatable,
      hyperic.data.ArrowPipeProperty,
      hyperic.data.RangeSpeedProperty,
      hyperic.data.RangesProperty,
      hyperic.data.LabelProperty ],{
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
          
    // arrowColor:
    //      xxx
    arrowColor: "blue",

    
    
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
    _fillObj:null,
    _points:null,
    _rcolor:null, // caching color, either from main or from ranges
    
    startup: function(){
        // summary:
//        this.plays = 0; // for testing fops
//        this.playstime = 0; // for testing fops

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
  		return this.arrowColor;
    },
    
    resetValue: function(){
    	this._cacheColor();
       	this._drawAxis(20);
       	this.setUpArrowColors();
        this.handleOverlay();
    },

    _cacheColor: function(){
        var range = this.getInRange(this.value);
        this._rcolor = this.arrowColor;
        if(range != null) this._rcolor = range.color;       
    },

    setUpArrowColors: function(){
    	
        var c0 = new dojo.Color(this._rcolor).toRgba();
        c0[3] = 0.0;
        var c1 = new dojo.Color(this._rcolor).toRgba();
        c1[3] = 1.0;                
        this._fillObj = {
            colors: [
                { offset: 0, color: c0 },
                { offset: 1, color: c1 }
            ]
        };
        var fillObj = this._fillObj; // dojo.forEach doesn't play along with this._fillObj
        var points = this._points;
        dojo.forEach(this._arrows, function(entry){
            entry.setFill(dojo.mixin({
                    type: "linear",
                    x1: points[0].x, y1: points[0].y,
                    x2: points[3].x, y2: points[0].y
                    }, fillObj));
        });     
    },
    
    draw: function(){
        // summary:
        this.surface.clear();
        this._cacheColor();
        if(this._arrows === null)
            this._createArrows();
        this._drawAxis(20);
        this.handleOverlay();    
    },
    
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
        if(this.value >= this.getMaxRange()) {
            _baseSpeed = 1;
        } else if(this.value <= this.getMinRange()) {
            _baseSpeed = 0;
        } else {
            var _scaleMinMax = this.getMaxRange() - this.getMinRange();
            _baseSpeed = (this.value - this.getMinRange()) / _scaleMinMax;
        }
        
        //rotationTime is telling how often we should do full rotation in max speed     
        var _now = new Date().getTime();
        var _diff = _now - this._lastTimeStamp;


//        if((++this.plays % 200) == 0){
//            var fops = 200 / ((_now - this.playstime) / 1000);
//            console.log("arrow fops: " + _diff + "/" + fops);         
//            this.playstime = _now;
//        }



        var _toShiftBase = 1000 / (this.getSpeedTime() / _diff);        
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
        paramObj['minRange'] = this.getMinRange();        
        paramObj['maxRange'] = this.getMaxRange();        
        paramObj['speedTime'] = this.getSpeedTime();
        paramObj['arrowColor'] = this.arrowColor;    
        paramObj['reverse'] = this.reverse;    
        paramObj['ranges'] = this.asRangesParams();    
        paramObj['labelColor'] = this.getLabelColor();
        return paramObj;
    }
        
});