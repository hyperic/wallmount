dojo.provide("hyperic.widget.EllipseLabel");

dojo.require("hyperic.widget.label._Label");

dojo.declare("hyperic.widget.EllipseLabel",[hyperic.widget.label._Label],{

    // baseImgUrl: String
    //      base path to resources, images, etc
    baseImgUrl: dojo.baseUrl + "../hyperic/widget/label/resources/",
    
    constructor: function(){
        this.preserveRatio = true;
    },

    startup: function(){                
        this.inherited(arguments);
        this.draw();
    },
    
    
    draw: function(){
        this.surface.clear();
        
        var size = this.getMinSize();
        var url = this.baseImgUrl + "ellipse-green.png";
        


        this.surface.createImage({x:0,y:0,width:this.width, height:this.height, src: url});        	

        this.drawMetric();
    },
        
    _setSizeAttr: function(size){
    	this.aspectSize = size;
        var ratio = 446 / 759;
        this.width = size;
        this.height = ratio * size;
    }
      

});