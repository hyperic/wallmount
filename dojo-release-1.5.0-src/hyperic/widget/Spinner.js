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

dojo.provide("hyperic.widget.Spinner");

dojo.require("hyperic.widget.base._WallMountItem");
dojo.require("hyperic.widget.base._Animatable");
dojo.require("hyperic.util.FontUtil");
dojo.require("hyperic.unit.UnitsConvert");
dojo.require("hyperic.data.ArrowProperty");
dojo.require("hyperic.data.RangeSpeedProperty");
dojo.require("hyperic.data.RangesProperty");

// TODO: linear vs. logarithmic speed
// TODO: counterclockwise

dojo.declare("hyperic.widget.Spinner",
    [ hyperic.widget.base._WallMountItem,
      hyperic.widget.base._Animatable,
      hyperic.data.ArrowProperty,
      hyperic.data.RangeSpeedProperty,
      hyperic.data.RangesProperty ],{
    // summary:
    //      Spinner widget to show visual representation of the metric value.
    //
    // description:
    //      Contains "spinning" arrows showing the metric value in the
    //      middle. Arrows are travelling on a circular path around a center
    //      area which is reserved for numerical output.
    // animation:
    //      
            
    // speedAcceleration: String, either 'linear' or 'logaritmic'
    // determine how spinner speed is determined from
    // min-max/value scale.
    //speedAcceleration: 'linear',
    
    // counterclockwise: Boolean
    // arrows are spinning counterclockwise if true,
    // clockwise if false.
    //counterclockwise: true,
    
    // internal data
    _lastTimeStamp: 0, // last update time
    _degree: 0, // current rotation angle
    _arrows: null, // handles to arrows
    _text:null, // handle to text
    _rcolor:null, // caching color, either from main or from ranges

    constructor: function(){
        this.preserveRatio = true;
    },

    startup: function(){
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

    resetValue: function(){
        this._cacheColor();
        this.drawMetric();
        this.setUpArrowColors();
        this.handleOverlay();
    },

    draw: function(){
        this.surface.clear();
        
        this._cacheColor();
        
        if(this._arrows === null)
            this._createArrows();
        this.drawMetric();

        this.handleOverlay();    
    },
    
    _cacheColor: function(){
        var range = this.getInRange(this.value);
        this._rcolor = this.color;
        if(range != null) this._rcolor = range.color;    	
    },
        
    _createArrows: function(){
        // summary:
        //      Creates actual arrows to the surface.
        //
        // description:
        //      Created arrows are stored to this class. Those
        //      handles can be used to shift arrow rotation
        //      matrix without re-creating the whole dom tree.
    	
        var rotation = 0;
        var arrowAreaAngle = 360 / this.getArrowCount();
        this._arrows = [];
        var points = this._createArrowPoints();
        
        for(var i = 0;i < this.getArrowCount(); i++) {
        	
            // If path is created without any initial points, webkit is
            // throwing error "Error problem parsing d=".
            // So lets give initial point as svg string and
            // continue from there. 
            var webkitFix = 'M' + points[0].x + ',' + points[0].y;
            var path = this.surface.createPath({path: webkitFix});
        
            path.hLineTo(points[1].x);
            path.arcTo(points[2].rx,points[2].ry,points[2].x_axis_rotation,points[2].large_arc_flag,points[2].sweep_flag,points[2].x,points[2].y);
            path.lineTo(points[3].x,points[3].y);
            path.lineTo(points[4].x,points[4].y);
            path.arcTo(points[5].rx,points[5].ry,points[5].x_axis_rotation,points[5].large_arc_flag,points[5].sweep_flag,points[5].x,points[5].y);
            path.closePath();

            path.setFill(this._rcolor);
            
            path.setTransform([dojox.gfx.matrix.rotategAt(-rotation, this.width/2, this.height/2)]);
            
            this._arrows[i] = path;
            rotation += arrowAreaAngle;
        }

    },
    
    _createArrowPoints: function(){
        // summary:
        //      Creates points for one arrow.
        //
        // description:
        //      This function returns array containing
        //      objects for arrow. Stakeholder using
        //      those points needs to know the structure.
        
        // spare reserver for arrow. Total visible arrow is
        // determined by arrowGap variable. If arrowGap is 0,
        // arrows are attached to each others. (head is touching
        // other arrows tail)
        var arrowAreaAngle = 360 / this.getArrowCount();
        
        // radius(outer circle) is usually component half of the component width
        var _r = this.width / 2;
        var _h = this.height / 2;
        
        // possible circle lengths (inner, middle, outer) reservations
        var _radI = _r - this.getArrowWidth();
        var _radM = _r - (this.getArrowWidth() / 2);
        var _radO = _r;
        var _totArrowLengthI = 2*Math.PI*_radI/this.getArrowCount();
        var _totArrowLengthM = 2*Math.PI*_radM/this.getArrowCount();
        var _totArrowLengthO = 2*Math.PI*_radO/this.getArrowCount();
        
        var headAngle = arrowAreaAngle - this.arcDegreeByL(_radM, _totArrowLengthM - this.getArrowGap());
        var headRootAngle = arrowAreaAngle - this.arcDegreeByL(_radM, _totArrowLengthM - this.getArrowGap() - this.getArrowHeadLength());
        
        // arrow length is measured from middle of the arrow substracting
        // gap from total possible arrow length.

        // 5 points or instructions to draw the arrow.
        // we start from right bottom corner and place
        // points on clockwise direction.
        // 1. initial poing
        // 2. horizontal line
        // 3. inner arc
        // 4. inner arrow head
        // 5. outer arrow head
        // 6. outer arc
        
        var points = [
            {x:this.width-this.getArrowWidth(), y:_h},
            {x:this.width},
            {
            	rx: _r,
            	ry: _h,
            	x_axis_rotation: 0,
            	large_arc_flag: false,
            	sweep_flag: false,
            	x: _r + this.arcXPointByDegree(_radO, arrowAreaAngle - headRootAngle),
            	y: _h - this.arcYPointByDegree(_radO, arrowAreaAngle - headRootAngle)
            },
            {
            	x: _r + this.arcXPointByDegree(_radM, arrowAreaAngle - headAngle),
            	y: _h - this.arcYPointByDegree(_radM, arrowAreaAngle - headAngle)
            },
            {
            	x: _r + this.arcXPointByDegree(_radI, arrowAreaAngle - headRootAngle),
            	y: _h - this.arcYPointByDegree(_radI, arrowAreaAngle - headRootAngle)
            },
            {
                rx: _radI,
                ry: _radI,
                x_axis_rotation: 0,
                large_arc_flag: false,
                sweep_flag: true,
                x: this.width-this.getArrowWidth(),
                y: _h
            }
        ];
    	
    	return points;
    },
    
    _shiftArrows: function(){
        // summary:
        //      Shifts/rotates surface arrows depending on the current
        //      degree values.
        //
        // description:
        //      Before the shifting operation can do any visible changes,
        //      somebody needs to re-calculate the degree which is usually
        //      done from the play function.
    	
    	// without rounding we're getting a lot of memory leaks
    	// which is something what I don't understand.
    	var rotation = dojo.number.round(this._degree);
    	var arrowAreaAngle = dojo.number.round(360 / this.getArrowCount());
    	
    	for(var i = 0; i < this._arrows.length; i++) {
    		this._arrows[i].setTransform([dojox.gfx.matrix.rotategAt(-rotation, this.width/2, this.height/2)]);
    		rotation += arrowAreaAngle; 		
    	}
    },
                
    arcLByRad: function(r, d){
    	// summary:
    	//     returns arc length by given radius and angle
    	// r:
    	//     radius
    	// d:
    	//     degree
    	return 2*Math.PI*r*d/360;
    },

    arcDegreeByL: function(r, s){
        // summary:
        //     returns arc angle by given arch radius and length
        // r:
        //     radius
        // s:
        //     length of the arc
    	return (360*s)/(2*Math.PI*r);
    },
        
    arcXPointByDegree: function(r, d){
        // summary:
        //     returns x position on a circle by radius and angle 
        // r:
        //     radius
        // d:
        //     degree
    	return (Math.cos(Math.PI*d/180) * r);
    },

    arcYPointByDegree: function(r, d){
        // summary:
        //     returns y position on a circle by radius and angle 
        // r:
        //     radius
        // d:
        //     degree
        return (Math.sin(Math.PI*d/180) * r);
    },
    
    drawMetric: function(){
    	// summary:
    	//     draws formatted metric value between spinning arrows
    	
    	var _radI = this.width / 2 - this.getArrowWidth();
    	
    	var fV;
    	if(this.isValueStateOk())
    		fV = hyperic.unit.UnitsConvert.convert(this.value, this.format, {places:'0,2'});
    	else
    		fV = "---";
    		
    	var fS = hyperic.util.FontUtil.findGoodSizeFontByCircle(fV, _radI);
	
        if(this._text) {
            this._text.setShape({text: fV, y:(this.height/2) + fS*0.35});
            this._text.setFont({family:"Helvetica",weight:"bold",size:fS+'px'});
            this._text.setFill(this._rcolor);
        } else {
            this._text = this.drawText(fV, this.width/2, (this.height/2) + fS*0.35 , "middle", this._rcolor, {family:"Helvetica",weight:"bold",size:fS+'px'});
        }
    },
    
    setUpArrowColors: function(){
        var range = this.getInRange(this.value);
        var color = this.color;
        if(range != null) color = range.color;

        dojo.forEach(this._arrows, function(entry){
        	entry.setFill(color);
        });    	
    },
    
    _play: function(){
    	// summary:
    	//     callback to handle animation
    	
    	if(!this.isValueStateOk())return;
    	
    	//basic baseline speed is calculated using scale settings,
    	//we should get value 0..1
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
    	
//    	if((++this.plays % 200) == 0){
//    		var fops = 200 / ((_now - this.playstime) / 1000);
//            console.log("spinner fops: " + _diff + "/" + fops);         
//    		this.playstime = _now;
//    	}
    	
    	var _toRotateBase = 360 / (this.getSpeedTime() / _diff);
    	
    	var _toRotate = _toRotateBase * _baseSpeed;
    	
        this._degree = ((this._degree + _toRotate) >= 360) ? (this._degree + _toRotate) - 360 : (this._degree + _toRotate);
        if(this._degree > 360)
            this._degree = this._degree % 360;
        this._shiftArrows();
        this._lastTimeStamp = _now;
    },

    asParams: function(){
        // summary:
        //     Returns component parameters as object.
        var paramObj = this.inherited(arguments);
        paramObj['arrowCount'] = this.getArrowCount();
        paramObj['arrowWidth'] = this.getArrowWidth();
        paramObj['arrowGap'] = this.getArrowGap();
        paramObj['arrowHeadLength'] = this.getArrowHeadLength();
        paramObj['minRange'] = this.getMinRange();        
        paramObj['maxRange'] = this.getMaxRange();        
        paramObj['speedTime'] = this.getSpeedTime();
        paramObj['ranges'] = this.asRangesParams();    
        return paramObj;
    }


});
