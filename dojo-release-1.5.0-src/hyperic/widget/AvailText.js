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

dojo.provide("hyperic.widget.AvailText");

dojo.require("hyperic.widget.avail._Availability");
dojo.require("hyperic.util.Util");
dojo.require("dojo.number");

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
        
                
        var width = dojo.number.round(this.width - insets.right - insets.left);
        var height = dojo.number.round(this.height - insets.top - insets.bottom);

        var url;
        if(typeof(this.bgImageURI) === 'undefined') {
            url = this.baseImgUrl + status + "-ellipse.png";
        } else {
            // keys ${bgImageStatus} ${bgImageWidth} ${bgImageHeight}
            url = dojo.string.substitute(this.bgImageURI,{bgImageStatus:status, bgImageWidth:width, bgImageHeight:height});
        }

        this.surface.createImage({x:x,y:y,width:width, height:height, src: url});
        
        // don't even try to draw legends if those are
        // not marked as supported. also check if value
        // state is ok
        if(this.supportLegends && this.isValueStateOk())
            this.drawLegends();
        
        this.handleOverlay();    
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