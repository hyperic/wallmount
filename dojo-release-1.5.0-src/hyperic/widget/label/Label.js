dojo.provide("hyperic.widget.label.Label");

dojo.require("hyperic.widget.label._Label");

dojo.declare("hyperic.widget.label.Label",[hyperic.widget.label._Label],{


    startup: function(){                
        this.inherited(arguments);
        this.draw();
    },
    
    draw: function(){
        this.surface.clear();
        this.drawMetric();
    }
        

});