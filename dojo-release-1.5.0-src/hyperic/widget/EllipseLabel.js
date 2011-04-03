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

dojo.provide("hyperic.widget.EllipseLabel");

dojo.require("hyperic.widget.label._Label");

dojo.declare("hyperic.widget.EllipseLabel",[hyperic.widget.label._Label],{

    // baseImgUrl: String
    //      base path to resources, images, etc
    baseImgUrl: dojo.baseUrl + "../hyperic/widget/label/resources/",
    
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

        var width = dojo.number.round(this.width);
        var height = dojo.number.round(this.height);
        
        // check if registry is giving us new URI for bg image
        var url;
        if(typeof(this.bgImageURI) === 'undefined') {
        	url = this.baseImgUrl + "ellipse-green.png";
        } else {
        	// keys ${bgImageWidth} ${bgImageHeight}
        	url = dojo.string.substitute(this.bgImageURI,{bgImageWidth:width, bgImageHeight:height});
        }

        this.surface.createImage({x:0,y:0,width:width, height:height, src: url});        	

        this.drawMetric();
    },
        
    _setSizeAttr: function(size){
    	this.aspectSize = size;
        var ratio = 446 / 759;
        this.width = size;
        this.height = ratio * size;
    }
      

});