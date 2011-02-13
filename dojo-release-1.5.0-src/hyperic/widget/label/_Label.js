dojo.provide("hyperic.widget.label._Label");

dojo.require("hyperic.widget.base._WallMountItem");
dojo.require("hyperic.util.FontUtil");
dojo.require("hyperic.unit.UnitsConvert");

dojo.declare("hyperic.widget.label._Label",[hyperic.widget.base._WallMountItem],{
    
    drawMetric: function(){
        // summary:
        //     draws formatted metric value between spinning arrows
        var fV = hyperic.unit.UnitsConvert.convert(this.value, "none");
        
        
        // ok, for now just take 10% off from the width and scale by rect
        // seem to get pretty good result
        var fS = hyperic.util.FontUtil.findGoodSizeFontByRect(fV, this.width-(this.width/10), this.height);
        var shift = Math.round(fS * 0.34);
        this.drawText(fV, this.width/2, this.height/2 + shift , "middle", "whitesmoke", {family:"Helvetica",weight:"bold",size:fS+'px'});
    }
        

});