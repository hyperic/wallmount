dojo.provide("hyperic.widget.Tank");

dojo.require("hyperic.widget.base._WallMountItem");
dojo.require("hyperic.unit.UnitsConvert");
dojo.require("hyperic.util.FontUtil");
dojo.require("hyperic.data.EmptyFullColorProperty");
dojo.require("hyperic.data.RangesProperty");
dojo.require("hyperic.data.RangeProperty");

dojo.declare("hyperic.widget.Tank",
    [ hyperic.widget.base._WallMountItem,
      hyperic.data.EmptyFullColorProperty,
      hyperic.data.RangesProperty,
      hyperic.data.RangeProperty ],{
    
    lights: null,
    
    constructor: function(){
    	this.lights = {
    		lights: [
                {direction: {x: -5, y: 0, z: -20}, color: "white"},
                {direction: {x: 30, y: -10, z: -2}, color: "#444"}
            ],
            ambient: {color: "white", intensity: 2},
            specular: "white"
    	};
    },

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
        
        // for now we're drawing the axis on right side of
        // the tank. we don't exactly know what to draw,
        // so reserve space for it.
                
        var _radius = this.width/2;
        var _height = this.height;
        
        // if tube is rotated somethig else that 0,90,180,270 degrees
        // we need to calculate the extra space. With 0 and 180 it's
        // radius and with 90 and 270 its tube height.
        // for now, just add fixed space based on tube radius.
        // we can do that because rotation is hard coded.
        var _cylextraspace = _radius / 2.6;
    	
    	var view = this.surface.createViewport();

        view.setLights(this.lights.lights,this.lights.ambient,this.lights.specular);    	
    	
    	// first cyl
    	var _height1 = (_height - _cylextraspace) * ((this.value-min)/(max-min));
    	var _y1 = (_cylextraspace/2);
    	
    	var m = dojox.gfx3d.matrix;
    	
    	// only draw if value is larger than min
    	if(this.value > min && this.value <= max) {
            view.createCylinder({height: _height1, radius: _radius })
                .setTransform([m.translate(_radius, _y1, 0), m.rotateXg(-80)])
                .setStroke(fillcolor)
                .setFill({type: "matte", finish: "shiny", color: fillcolor});	
    	} else if (this.value > max ) {
            view.createCylinder({height: (_height - _cylextraspace), radius: _radius })
                .setTransform([m.translate(_radius, _y1, 0), m.rotateXg(-80)])
                .setStroke(fillcolor)
                .setFill({type: "matte", finish: "shiny", color: fillcolor});      		
    	}

        // second cyl
        var _height2 = (_height - _cylextraspace) * (1-((this.value-min)/(max-min)));
        var _y2 = _y1 + _height1;
        
        // only draw if values smaller that max
        if(this.value < max && this.value >= min) {
            view.createCylinder({height: _height2, radius: _radius })
                .setTransform([m.translate(_radius, _y2 - (_y2/100), 0), m.rotateXg(-80)])
                .setStroke(emptycolor)
                .setFill({type: "matte", finish: "shiny", color: emptycolor});        	
        } else if(this.value < min) {        	
            view.createCylinder({height: (_height - _cylextraspace), radius: _radius })
                .setTransform([m.translate(_radius, _y1, 0), m.rotateXg(-80)])
                .setStroke(emptycolor)
                .setFill({type: "matte", finish: "shiny", color: emptycolor});         
        }


            
        var camera = m.normalize({});
        
        view.applyCameraTransform(camera);
            
    	view.render();
    	
        var fV = hyperic.unit.UnitsConvert.convert(this.value, this.format);
        var fS = hyperic.util.FontUtil.findGoodSizeFontByRect(fV, this.width-(this.width/10), this.height/10);
    	
    	var valPos;
    	if (this.value < min){
            valPos = this.height - _y1;    		
    	} else if(this.value > max){
            valPos = this.height - _y1 - _height + _cylextraspace + _cylextraspace + fS;
        } else if(this.value > ((max-min)/2 + min)){
            valPos = this.height - _y2 + _cylextraspace + fS;    		
    	} else {
            valPos = this.height - _y2;
    	}
        this.drawText(fV, this.width/2, valPos , "middle", "whitesmoke", {family:"Helvetica",weight:"bold",size:fS+'px'});
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
        return paramObj;
    }


});
