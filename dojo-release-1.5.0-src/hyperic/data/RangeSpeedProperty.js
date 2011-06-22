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

dojo.provide("hyperic.data.RangeSpeedProperty");

dojo.declare("hyperic.data.RangeSpeedProperty",null,{

    // minRange: Object
    //
    // value: value of range min range
    // min: min constraint for value
    // max: max constraint for value

    // maxRange: Object
    //
    // value: value of range max range
    // min: min constraint for value
    // max: max constraint for value

    // speedTime: Object
    //
    // value: speed time to do full rotation or full pipe slide
    //        when component is its full speed.
    // min: min constraint for value
    // max: max constraint for value

    constructor: function(){
        this.minRangeObj = {value:0, min: 0, max: 100};
        this.maxRangeObj = {value:100, min: 0, max: 999999999};
        this.speedTimeObj = {value:1000, min: 500, max: 10000};
    },
    
    getMinRange: function(){
        return this.minRangeObj.value;
    },
    
    _setMinRangeAttr: function(value){
        this.minRangeObj.value = value;
    },

    getMaxRange: function(){
        return this.maxRangeObj.value;
    },
    
    _setMaxRangeAttr: function(value){
        this.maxRangeObj.value = value;
    },

    getSpeedTime: function(){
        return this.speedTimeObj.value;
    },
    
    _setSpeedTimeAttr: function(value){
        this.speedTimeObj.value = value;
    }
    
});