dojo.provide("hyperic.widget.label._Label");

dojo.require("hyperic.widget.base._WallMountItem");
dojo.require("hyperic.util.FontUtil");
dojo.require("hyperic.unit.UnitsConvert");
dojo.require("hyperic.data.LabelProperty");
dojo.require("hyperic.data.RangesProperty");

dojo.declare("hyperic.widget.label._Label",
    [ hyperic.widget.base._WallMountItem,
     hyperic.data.LabelProperty,
     hyperic.data.RangesProperty ],{
     	
    // internal data
    _rcolor:null, // caching color, either from main or from ranges
     	
    drawMetric: function(){
        // summary:
        //     draws formatted metric value between spinning arrows
        
        this._cacheColor();
        
        var fV = hyperic.unit.UnitsConvert.convert(this.value, this.format);        
        
        // ok, for now just take 10% off from the width and scale by rect
        // seem to get pretty good result
        var fS = hyperic.util.FontUtil.findGoodSizeFontByRect(fV, this.width-(this.width/10), this.height);
        var shift = Math.round(fS * 0.34);
        this.drawText(fV, this.width/2, this.height/2 + shift , "middle", this._rcolor, {family:"Helvetica",weight:"bold",size:fS+'px'});
    },
    
    resetValue: function(){
    	this._cacheColor();
    	this.inherited(arguments);
    },

    _cacheColor: function(){
        var range = this.getInRange(this.value);
        this._rcolor = this.getLabelColor()
        if(range != null) this._rcolor = range.color;       
    },

    asParams: function(){
        // summary:
        //     Returns component parameters as object.
        
        var paramObj = this.inherited(arguments);
        paramObj['labelColor'] = this.getLabelColor();
        paramObj['ranges'] = this.asRangesParams();
        return paramObj;
    }
        

});