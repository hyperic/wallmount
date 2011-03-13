dojo.provide("hyperic.widget.AvailIcon");

dojo.require("hyperic.widget.avail._Availability");
dojo.require("hyperic.util.Util");

dojo.declare("hyperic.widget.AvailIcon",
    [ hyperic.widget.avail._Availability ],{
    // summary:
    //      Provides old "wallmount" style availability widget.
    //
    // description:
    //
    // 
        
    constructor: function(){
    	this.preserveRatio = true;
    },

    startup: function(){
        this.inherited(arguments);
        this.draw();
    },

    storeAvailCallback: function(arg) {
        // summary:
        //     Callback function to handle metric store updates.
        
        // forget values for legends if component doesn't support those
        if(this.supportLegends) {
        	if(typeof(arg.alerts) !== 'undefined') this._setAlertLegendValue(arg.alerts);
            if(typeof(arg.escalations) !== 'undefined') this._setEscalationLegendValue(arg.escalations);
        }
        this.inherited(arguments);
    },


    draw: function(){
        this.surface.clear();
        
        var size = this.getMinSize();
        var status = this.getStatus();
        var rStr = this.getResourceType();
        
//        var insets = this.legendsInsets();
        var insets = hyperic.util.Util.zeroMinInsets(this.legendsInsets());
        
        var url = this.baseImgUrl + status + "-" + rStr + ".png";
        var x = insets.left;
        var y = insets.top;
        var width = this.width - insets.right - insets.left;
        var height = this.height - insets.top - insets.bottom;
        this.surface.createImage({x:x,y:y,width:width, height:height, src: url});
        
        // don't even try to draw legends if those are
        // not marked as supported
        if(this.supportLegends)
            this.drawLegends();
    },
    
    legendsInsets: function() {
    	if(!this.supportLegends)
    	   return this.inherited(arguments);
    	// plan to support legend on all 4 corners.
    	
    	// we need to estimate the height of the legend so that
    	// when estra space is reserved, legend would fit 3 (z) times
    	// to the size of the drawn icon.
    	
    	// lets assume that legend initial centre is mounted to
    	// the corner of the icon.
    	
    	// function to calculate radius of the legend initial size:
    	// r = height / (2*z + 2)
    	var z = 3;
    	var r = this.height / (2*z+2);
    	
    	return {top:r,left:r,bottom:r,right:r};
    },

    getLegendSize: function(){
    	return this.legendsInsets().top;
    }


});