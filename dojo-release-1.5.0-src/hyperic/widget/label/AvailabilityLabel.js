dojo.provide("hyperic.widget.label.AvailabilityLabel");

dojo.require("hyperic.widget.label._Label");

dojo.declare("hyperic.widget.label.AvailabilityLabel",[hyperic.widget.label._Label],{

    value: 0,

    startup: function(){                
        this.inherited(arguments);
        this.draw();
    },
    
    draw: function(){
        var x = this.drawFittedText("OK",0,this.height,"center", "green");
        var i = 1;
    }
        

});