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

dojo.provide("hyperic.widget.ProgressTube");

dojo.require("hyperic.widget.base._WallMountItem");
dojo.require("hyperic.util.FontUtil");
dojo.require("hyperic.unit.UnitsConvert");
dojo.require("hyperic.data.EmptyFullColorProperty");
dojo.require("hyperic.data.RangesProperty");
dojo.require("hyperic.data.RangeProperty");

dojo.declare("hyperic.widget.ProgressTube",
    [ hyperic.widget.base._WallMountItem,
      hyperic.data.EmptyFullColorProperty,
      hyperic.data.RangesProperty,
      hyperic.data.RangeProperty,
      hyperic.data.LabelProperty ],{
    // summary:
    //      xxx
    //
    // description:
    //      xxx

    startup: function(){
                
        this.inherited(arguments);
        this.draw();
    },    
    
    draw: function(){
        this.surface.clear();

        // range from property
        var min = this.getLowRange();
        var max = this.getHighRange();
        
        // setup color and overwrite if in range
        var emptycolor = this.getEmptyColor();
        var fillcolor = this.getFullColor();        
        var range = this.getInRange(this.value);
        if(range != null) fillcolor = range.color;       
        
        // cylinder point of origin is back of the tube (center of tube)
        // if you hold it from the back and point it towards
        // your face.
        // xG rotate with minus values rotates tube to up
        
        // since we're about to draw axis, we need to
        // reserve space for it. for now just reserve
        // a fixed height since visual representation
        // is more important than to see the axis values.
        
        var axisH = 17;
                
        var _radius = (this.height - axisH)/2;
        var _width = this.width;
                
        var view = this.surface.createViewport();
        
//        view.setLights([
//            {direction: {x: 2, y: 8, z: -30}, color: "white"},
//            {direction: {x: 2, y: -3, z: 0}, color: "#444"}
//        ], {color: "white", intensity: 2}, "white");

        view.setLights([
            {direction: {x: 5, y: 8, z: -28}, color: "white"},
            {direction: {x: 3, y: -3, z: -1}, color: "#444"}
        ], {color: "white", intensity: 2}, "white");


        // first cyl
        var _width1 = _width * ((this.value-min)/(max-min));
        var _x1 = 0;
        
        var m = dojox.gfx3d.matrix;
        // only draw if value is larger than min
        if(this.value > min && this.value <= max) {
              view.createCylinder({height:_width1,radius:_radius})
                  .setTransform([m.translate(_width1+1, 0, -_radius-axisH), m.rotateYg(-90)])
                  .setStroke("black")
                  .setFill({type: "plastic", finish: "shiny", color: fillcolor});
        } else if (this.value > max ) {
              view.createCylinder({height:_width,radius:_radius})
                  .setTransform([m.translate(_width+1, 0, -_radius-axisH), m.rotateYg(-90)])
                  .setStroke("black")
                  .setFill({type: "plastic", finish: "shiny", color: fillcolor});
        }

        // second cyl
        var _width2 = _width * (1-((this.value-min)/(max-min)));
        var _x2 = _width2 + _width1;
        
        if(this.value < max && this.value >= min) {
              view.createCylinder({height:_width2,radius:_radius})
                  .setTransform([m.translate(_x2+1, 0, -_radius-axisH), m.rotateYg(-90)])
                  .setStroke("black")
                  .setFill({type: "plastic", finish: "shiny", color: emptycolor});
        	
        } else if(this.value < min) {
              view.createCylinder({height:_width,radius:_radius})
                  .setTransform([m.translate(_width+1, 0, -_radius-axisH), m.rotateYg(-90)])
                  .setStroke("black")
                  .setFill({type: "plastic", finish: "shiny", color: emptycolor});
        	
        }
        
        var camera = m.normalize(m.cameraRotateXg(90));
        view.applyCameraTransform(camera);
            
        view.render();
        if(this.isValueStateOk())
        	this.drawAxis(axisH);
        this.handleOverlay();    
    },
    
    drawAxis: function(height){
        // summary:
        //     draws "axix" below the tube. this axis only
        //     contains current value and max
        var max = this.getHighRange();
        
        var sVal = hyperic.unit.UnitsConvert.convert(this.value, this.format, {places:'0,2'});
        var sMax = hyperic.unit.UnitsConvert.convert(max, this.format, {places:'0,2'});
        
        var fMax = hyperic.util.FontUtil.findGoodSizeFontByRect(sMax, this.width, height);
        this.drawText(sMax, this.width, this.height, "end", this.getLabelColor(), {family:"Helvetica",weight:"bold",size:fMax+'px'});
        this.drawText(sVal, this.width/2, this.height, "end", this.getLabelColor(), {family:"Helvetica",weight:"bold",size:fMax+'px'});
    },
    
    asParams: function(){
        // summary:
        //     Returns component parameters as object.
        var paramObj = this.inherited(arguments);
        paramObj['emptyColor'] = this.getEmptyColor();
        paramObj['fullColor'] = this.getFullColor();
        paramObj['lowRange'] = this.getLowRange();
        paramObj['highRange'] = this.getHighRange();
        paramObj['ranges'] = this.asRangesParams();    
        paramObj['labelColor'] = this.getLabelColor();
        return paramObj;
    }


});
