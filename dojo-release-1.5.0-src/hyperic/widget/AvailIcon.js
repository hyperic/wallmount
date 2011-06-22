/**
 * NOTE: This copyright does *not* cover user programs that use HQ
 * program services by normal system calls through the application
 * program interfaces provided as part of the Hyperic Plug-in Development
 * Kit or the Hyperic Client Development Kit - this is merely considered
 * normal use of the program, and does *not* fall under the heading of
 *  "derived work".
 *
 *  Copyright (C) [2011], VMware, Inc.
 *  This file is part of HQ.
 *
 *  HQ is free software; you can redistribute it and/or modify
 *  it under the terms version 2 of the GNU General Public License as
 *  published by the Free Software Foundation. This program is distributed
 *  in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 *  even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 *  PARTICULAR PURPOSE. See the GNU General Public License for more
 *  details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 *  USA.
 *
 */

dojo.provide("hyperic.widget.AvailIcon");

dojo.require("hyperic.widget.avail._Availability");
dojo.require("hyperic.util.Util");
dojo.require("dojo.number");

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
        
        var insets = hyperic.util.Util.zeroMinInsets(this.legendsInsets());
        var x = insets.left;
        var y = insets.top;
        var width = dojo.number.round(this.width - insets.right - insets.left);
        var height = dojo.number.round(this.height - insets.top - insets.bottom);
        
        var url;
        if(typeof(this.bgImageURI) === 'undefined') {
            url = this.baseImgUrl + status + "-" + rStr + ".png";
        } else {
            // keys ${bgImageRes} ${bgImageStatus} ${bgImageWidth} ${bgImageHeight}
            url = dojo.string.substitute(this.bgImageURI,{bgImageRes:rStr, bgImageStatus:status, bgImageWidth:width, bgImageHeight:height});
        }

        this.surface.createImage({x:x,y:y,width:width, height:height, src: url});
        
        // don't even try to draw legends if those are
        // not marked as supported. also check if value
        // state is ok
        if(this.supportLegends && this.isValueStateOk())
            this.drawLegends();
        
        this.handleOverlay();    
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