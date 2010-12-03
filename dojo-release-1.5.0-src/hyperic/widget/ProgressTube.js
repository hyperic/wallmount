dojo.provide("hyperic.widget.ProgressTube");

dojo.require("hyperic.widget.base._WallMountItem");
dojo.require("hyperic.util.FontUtil");
dojo.require("hyperic.unit.UnitsConvert");

dojo.declare("hyperic.widget.ProgressTube",
    [hyperic.widget.base._WallMountItem],{
    // summary:
    //      xxx
    //
    // description:
    //      xxx

    min: 0,
    max: 1000,
    fillcolor: "red",
    emptycolor: "green",

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
        var _width1 = _width * ((this.value-this.min)/(this.max-this.min));
        var _x1 = 0;
        
        var m = dojox.gfx3d.matrix;
        // only draw if value is larger than min
        if(this.value > this.min && this.value <= this.max) {
              view.createCylinder({height:_width1,radius:_radius})
                  .setTransform([m.translate(_width1+1, 0, -_radius-axisH), m.rotateYg(-90)])
                  .setStroke("black")
                  .setFill({type: "plastic", finish: "shiny", color: "green"});
        } else if (this.value > this.max ) {
              view.createCylinder({height:_width,radius:_radius})
                  .setTransform([m.translate(_width+1, 0, -_radius-axisH), m.rotateYg(-90)])
                  .setStroke("black")
                  .setFill({type: "plastic", finish: "shiny", color: "green"});
        }

        // second cyl
        var _width2 = _width * (1-((this.value-this.min)/(this.max-this.min)));
        var _x2 = _width2 + _width1;
        
        if(this.value < this.max && this.value >= this.min) {
              view.createCylinder({height:_width2,radius:_radius})
                  .setTransform([m.translate(_x2+1, 0, -_radius-axisH), m.rotateYg(-90)])
                  .setStroke("black")
                  .setFill({type: "plastic", finish: "shiny", color: "gray"});
        	
        } else if(this.value < this.min) {
              view.createCylinder({height:_width,radius:_radius})
                  .setTransform([m.translate(_width+1, 0, -_radius-axisH), m.rotateYg(-90)])
                  .setStroke("black")
                  .setFill({type: "plastic", finish: "shiny", color: "gray"});
        	
        }
        
        var camera = m.normalize(m.cameraRotateXg(90));
        view.applyCameraTransform(camera);
            
        view.render();
        this.drawAxis(axisH);
    },
    
    drawAxis: function(height){
        // summary:
        //     draws "axix" below the tube. this axis only
        //     contains current value and max
        var sVal = hyperic.unit.UnitsConvert.convert(this.value, this.format);
        var sMax = hyperic.unit.UnitsConvert.convert(this.max, this.format);
        
        var fMax = hyperic.util.FontUtil.findGoodSizeFontByRect(sMax, this.width, height);
        this.drawText(sMax, this.width, this.height, "end", "black", {family:"Helvetica",weight:"bold",size:fMax+'px'});
        this.drawText(sVal, this.width/2, this.height, "end", "black", {family:"Helvetica",weight:"bold",size:fMax+'px'});
    }
    


});
