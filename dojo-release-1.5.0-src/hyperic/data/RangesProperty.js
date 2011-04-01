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

dojo.provide("hyperic.data.RangesProperty");

dojo.declare("hyperic.data.RangesProperty",null,{

    // minRange: Object
    //
    // value: value of range min range
    // min: min constraint for value
    // max: max constraint for value

    // internal data
    _rangeData: null,


    constructor: function(){
    },
        
    _setRangesAttr: function(ranges){
        this._rangeData = ranges;
    },

    getInRange: function(value){
    	// summary:
    	//     Returns defined range if matching agains given value
    	//
    	// description:
    	//     xxx
        if(this._rangeData === null) return null;       
        
        for(var i=0; i<this._rangeData.length; i++){
        	var r = this._rangeData[i];
        	if(r.comparator === "&gt;" || r.comparator === ">") {
        		if(value > r.value) return r;
        	} else if(r.comparator === "&lt;" || r.comparator === "<") {
                if(value < r.value) return r;        		
        	}
        }
          
       return null;
    },

    addRange: function(/*Object*/range){
        // summary:
        //      This method is used to add a range to the wallmount component.
        // description:
        //      Creates a range used to determine special behaviour if
        //      metric value spans through the different ranges. For example we
        //      can setup component to change background or text color from
        //      normal -> warning -> alert (aka green/yellow/red)
        // range:
        //      A range is either a hyperic.data.Range object, or a object
        //      with similar parameters (low, high, color, etc.).
        this.addRanges([range]);
    },
    
    addRanges: function(/*Array*/ranges){
        if(!this._rangeData){ 
            this._rangeData = [];
        }
        var range;
        for(var i=0; i<ranges.length; i++){
            range = ranges[i];
            this._rangeData[this._rangeData.length] = range;
        }       
    },
    
    removeRange: function(range){
    	if(this._rangeData == null) return;
        for(var i=0; i<this._rangeData.length; i++){
        	if(this._rangeData[i] === range) {
        	   this._rangeData.splice(i, 1);
        	   break;	
        	}
        }
    },

    removeRanges: function(){
        this._rangeData = null;
    }, 
    
    getRanges: function(){
    	return this._rangeData;
    },
    
    asRangesParams: function(){
    	var paramArr = [];
    	if(!this._rangeData) return paramArr;
    	for(var i=0; i<this._rangeData.length; i++){
    		paramArr.push({value:this._rangeData[i].value, comparator:this._rangeData[i].comparator, color: this._rangeData[i].color});
    	}
    	return paramArr;
    }
    
});