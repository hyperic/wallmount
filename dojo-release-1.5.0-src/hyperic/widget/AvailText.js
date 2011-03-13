dojo.provide("hyperic.widget.AvailText");

dojo.require("hyperic.widget.avail._Availability");
dojo.require("hyperic.util.Util");

dojo.declare("hyperic.widget.AvailText",
    [ hyperic.widget.avail._Availability ],{
    // summary:
    //      Provides text representation of availability information.
    //
    // description:
    //      xxx

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
        var status = this.getStatus();
        
        var insets = hyperic.util.Util.zeroMinInsets(this.legendsInsets());
        var x = insets.left;
        var y = insets.top;
        
        var url = this.baseImgUrl + status + "-ellipse.png";
                
        var width = this.width - insets.right - insets.left;
        var height = this.height - insets.top - insets.bottom;
        this.surface.createImage({x:x,y:y,width:width, height:height, src: url});
        
        // don't even try to draw legends if those are
        // not marked as supported
        if(this.supportLegends)
            this.drawLegends();
    },

    storeAvailCallback: function(arg) {
        // summary:
        if(this.supportLegends) {
            if(typeof(arg.alerts) !== 'undefined') this._setAlertLegendValue(arg.alerts);
            if(typeof(arg.escalations) !== 'undefined') this._setEscalationLegendValue(arg.escalations);
        }
        this.inherited(arguments);
    },

    _setSizeAttr: function(/*Number*/size){
        var ratio = 446 / 759;
        this.width = size;
        this.height = ratio * size;
        this.aspectSize = size;
    },
    
    legendsInsets: function() {
        if(!this.legends)
           return this.inherited(arguments);
        
        return {top:0,left:0,bottom:0,right:0};
    },

    getLegendSize: function(){
    	
    	// since this is using fixed ratio picture,
    	// we can also set legend size relative to height
        return this.height / 7;
    }

});