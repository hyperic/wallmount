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

    alertLegend: null,

    constructor: function(){
        this.legends = true;
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
        if(this.legends)
            this.drawLegends();
    },

    storeAvailCallback: function(arg) {
        // summary:
        this._setAlertLegendValue(arg.alerts);
        this.inherited(arguments);
    },

    _setAlertLegendValue: function(arg){
        // summary:
        if(arg == 0) {
            if(this.alertLegend){
                this.removeLegend(this.alertLegend);
                this.alertLegend = null;                
            }
        } else {
            if(this.alertLegend){
                this.alertLegend.value = arg;
            } else {
                this.alertLegend = 
                    this.addLegend({position:1,value:arg,color:'red'});
            }
        }
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