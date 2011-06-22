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

dojo.provide("hyperic.data.ArrowProperty");

dojo.declare("hyperic.data.ArrowProperty",null,{

    // arrowCount: Object
    //
    // value: how many arrows component is using
    // min: min constraint for value
    // max: max constraint for value

    // arrowWidth: Object
    //
    // value: arrow width
    // min: min constraint for value
    // max: max constraint for value

    // arrowGap: Object
    //
    // gap between arrows
    // min: min constraint for value
    // max: max constraint for value
    
    // arrowHeadLength: Object
    //
    // length of the arrow head
    // min: min constraint for value
    // max: max constraint for value

    constructor: function(){
        this.arrowCountObj = {value:3, min: 2, max: 6};
        this.arrowWidthObj = {value:25, min: 15, max: 30};
        this.arrowGapObj = {value:25, min: 5, max: 40};
        this.arrowHeadLengthObj = {value:15, min: 5, max: 40};
    },
    
    getArrowCount: function(){
    	return this.arrowCountObj.value;
    },
    
    _setArrowCountAttr: function(count){
    	this.arrowCountObj.value = count;
    },

    getArrowWidth: function(){
        return this.arrowWidthObj.value;
    },

    _setArrowWidthAttr: function(width){
        this.arrowWidthObj.value = width;
    },

    getArrowGap: function(){
        return this.arrowGapObj.value;
    },

    _setArrowGapAttr: function(gap){
        this.arrowGapObj.value = gap;
    },

    getArrowHeadLength: function(){
        return this.arrowHeadLengthObj.value;
    },
    
    _setArrowHeadLengthAttr: function(length){
        this.arrowHeadLengthObj.value = length;
    },
    
    getColor: function(){
        return this.color; 	
    },
    
    _setColorAttr: function(color){
        this.color = color;     
    }
});