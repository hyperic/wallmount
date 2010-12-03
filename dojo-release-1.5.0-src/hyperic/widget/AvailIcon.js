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
    
    // alertLegend: Object
    //      Handle to alert legend.
    //      Legend on top-left corner telling how
    //      many active alerts there is. 
    alertLegend: null,
    
    // escalationLegend: Object
    //      Handle to escalation legend.
    //      Legend on top-right corner telling how
    //      many active escalations there is.
    escalationLegend: null,      
    
    constructor: function(){
    	this.legends = true;
    	
    },

    startup: function(){
        this.inherited(arguments);
        this.draw();
    },

    storeAvailCallback: function(arg) {
        // summary:
        this._setAlertLegendValue(arg.alerts);
        this._setEscalationLegendValue(arg.escalations);
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

    _setEscalationLegendValue: function(arg){
        // summary:
        if(arg == 0) {
            if(this.escalationLegend){
                this.removeLegend(this.escalationLegend);
                this.escalationLegend = null;                
            }
        } else {
            if(this.escalationLegend){
                this.escalationLegend.value = arg;
            } else {
                this.escalationLegend = 
                    this.addLegend({position:3,value:arg,color:'blue'});
            }
        }
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
        if(this.legends)
            this.drawLegends();
    },
    
    legendsInsets: function() {
    	if(!this.legends)
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