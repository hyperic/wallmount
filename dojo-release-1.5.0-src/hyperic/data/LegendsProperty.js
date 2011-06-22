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

dojo.provide("hyperic.data.LegendsProperty");

dojo.declare("hyperic.data.LegendsProperty",null,{
	// summary:
	//     Defines legends propertys
	//
	// description:
	//     Legend object has 3 fields {position:1,type:'alert',value:arg,color:'red'}
	//
	//     position: (we reserve these positions but only 0 and 2 are supported for now)
	//                left center right
	//         top    0    1      2
	//         middle 3    4      5
	//         bottom 6    7      8
	//
    //     type: type of legend (alert or escalation)
    //
	//     value: actual legend value
	//
	//     color: legend main color

    // supportLegends: Boolean
    //      Flag telling if this component supports or is
    //      planning to add legends at some point. We need to
    //      know extra space outside of the main component if
    //      legend spans itself there.
    supportLegends: false,

    // internal data:
    _legendData: null,

    _setLegendsAttr: function(legends){
        this._legendData = legends;
    },
    
    getLegends: function() {
    	return this._legendData;
    },

    addLegend: function(/*Object*/legend){
        // summary:
        //      This method is used to add a legend to the component.
        this.addLegends([legend]);
        return legend;
    },
    
    addLegends: function(/*Array*/legends){
        // summary:
        //      This method is used to add a legends to the component.
        if(!this._legendData){ 
            this._legendData = [];
        }
        var legend;
        for(var i=0; i<legends.length; i++){
            legend = legends[i];
            // we add legend to its own position on array
            // based on position value in legend itself
            this._legendData[legend.position] = legend;
//            this._legendData[this._legendData.length] = legend;
        }       
    },
    
    removeLegend: function(/*Object*/legend){
        // summary:
        //      Removes the given legend from component.        
        for(var i=0; i<this._legendData.length; i++){
            if(this._legendData[i] === legend){
                this._legendData.splice(i, 1);
                break;
            }
        }
    },
    
    clearLegends: function() {
    	this._legendData = [];
    },

    asLegendsParams: function(){
        var paramArr = [];
        if(!this._legendData) return paramArr;
        for(var i=0; i<this._legendData.length; i++){
        	if(typeof(this._legendData[i]) !== 'undefined')
                paramArr.push({position:this._legendData[i].position, type:this._legendData[i].type , color: this._legendData[i].color});
        }
        return paramArr;
    }
    

});