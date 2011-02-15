dojo.provide("hyperic.widget.Tank");

dojo.require("hyperic.widget.base._WallMountItem");
dojo.require("hyperic.unit.UnitsConvert");
dojo.require("hyperic.util.FontUtil");

dojo.declare("hyperic.widget.Tank",
    [hyperic.widget.base._WallMountItem],{

//    value: 40,
    min: 0,
    max: 100,
    fillcolor: "red",
    emptycolor: "green",
    
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
    
//    postCreate: function(){
//    },
    
    
    draw: function(){
    	this.surface.clear();
    	
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
    	var _height1 = (_height - _cylextraspace) * ((this.value-this.min)/(this.max-this.min));
    	var _y1 = (_cylextraspace/2);
    	
    	var m = dojox.gfx3d.matrix;
    	
    	// only draw if value is larger than min
    	if(this.value > this.min && this.value <= this.max) {
            view.createCylinder({height: _height1, radius: _radius })
                .setTransform([m.translate(_radius, _y1, 0), m.rotateXg(-80)])
                .setStroke(this.fillcolor)
                .setFill({type: "matte", finish: "shiny", color: this.fillcolor});	
    	} else if (this.value > this.max ) {
            view.createCylinder({height: (_height - _cylextraspace), radius: _radius })
                .setTransform([m.translate(_radius, _y1, 0), m.rotateXg(-80)])
                .setStroke(this.fillcolor)
                .setFill({type: "matte", finish: "shiny", color: this.fillcolor});      		
    	}

        // second cyl
        var _height2 = (_height - _cylextraspace) * (1-((this.value-this.min)/(this.max-this.min)));
        var _y2 = _y1 + _height1;
        
        // only draw if values smaller that max
        if(this.value < this.max && this.value >= this.min) {
            view.createCylinder({height: _height2, radius: _radius })
                .setTransform([m.translate(_radius, _y2 - (_y2/100), 0), m.rotateXg(-80)])
                .setStroke(this.emptycolor)
                .setFill({type: "matte", finish: "shiny", color: this.emptycolor});        	
        } else if(this.value < this.min) {        	
            view.createCylinder({height: (_height - _cylextraspace), radius: _radius })
                .setTransform([m.translate(_radius, _y1, 0), m.rotateXg(-80)])
                .setStroke(this.emptycolor)
                .setFill({type: "matte", finish: "shiny", color: this.emptycolor});         
        }


            
        var camera = m.normalize({});
        
        view.applyCameraTransform(camera);
            
    	view.render();
    	
        var fV = hyperic.unit.UnitsConvert.convert(this.value, this.format);
        var fS = hyperic.util.FontUtil.findGoodSizeFontByRect(fV, this.width-(this.width/10), this.height/10);
    	
    	var valPos;
    	if (this.value < this.min){
            valPos = this.height - _y1;    		
    	} else if(this.value > this.max){
            valPos = this.height - _y1 - _height + _cylextraspace + _cylextraspace + fS;
        } else if(this.value > ((this.max-this.min)/2 + this.min)){
            valPos = this.height - _y2 + _cylextraspace + fS;    		
    	} else {
            valPos = this.height - _y2;
    	}
        this.drawText(fV, this.width/2, valPos , "middle", "whitesmoke", {family:"Helvetica",weight:"bold",size:fS+'px'});
    }

});
