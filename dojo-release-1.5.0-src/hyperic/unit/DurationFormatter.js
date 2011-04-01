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

dojo.provide("hyperic.unit.DurationFormatter");

dojo.require("dojo.number");
dojo.require("hyperic.unit.UnitNumber");
dojo.require("hyperic.unit.UnitsConstants");
dojo.require("hyperic.unit.UnitsUtil");
dojo.require("hyperic.util.StringUtil");
dojo.require("hyperic.unit.DateFormatter");

dojo.declare("hyperic.unit.DurationFormatter",
    null,{

    format: function(/*Object*/val) {
        // summary:
        //     xxx
    	
    	var granularity = this._getGranularity(val);
    	return this._format(val.getBaseValue(), granularity, 3);
    },
    
    _format: function(/*Number*/baseTime, /*Number*/granularity, /*Number*/milliDigits){
        // summary:
        //     xxx
    	var res = "";
    	var tbd;
    	
    	if(granularity == hyperic.unit.UnitsConstants.GRANULAR_YEARS){
            tbd = this._breakDownTime(baseTime);
            res = tbd.nYears + "y " + tbd.nDays + "d";
        } else if (granularity == hyperic.unit.UnitsConstants.GRANULAR_DAYS) {
            tbd  = this._breakDownTime(baseTime);
            var nDays = tbd.nYears * 365 + tbd.nDays;
            res = nDays + (nDays == 1 ? " day " : " days ") + 
                hyperic.util.StringUtil.formatDuration(tbd.nHours * 60 * 60 * 1000 +
                                                       tbd.nMins * 60 * 1000 +
                                                       tbd.nSecs * 1000 +
                                                       tbd.nMilli, 0, false);        	
        } else if(granularity == hyperic.unit.UnitsConstants.GRANULAR_HOURS ||
                  granularity == hyperic.unit.UnitsConstants.GRANULAR_MINS ||
                  granularity == hyperic.unit.UnitsConstants.GRANULAR_SECS) {
        	var nMillis = baseTime / hyperic.unit.UnitsUtil.FACT_MILLIS;
        	res = hyperic.util.StringUtil.formatDuration(nMillis, milliDigits, granularity == hyperic.unit.UnitsConstants.GRANULAR_SECS);
        	if(granularity == hyperic.unit.UnitsConstants.GRANULAR_SECS) res = res + 's';        	
        } else if (granularity == hyperic.unit.UnitsConstants.GRANULAR_MILLIS) {
        	var dMillis = baseTime / 1000000;
        	res = dojo.number.format(dMillis,{places:2}) + "ms";
    	}
    	return res;
    },
      
    parse: function(/*String*/val, unitType, /*String*/locale){
        // summary:
        //     xxx
    	
    	var regular = this._parseRegular(val);
    	if(regular != null) return regular;
    	
    	var nonIdx = hyperic.unit.UnitsUtil.findNonNumberIdx(val);
    	var numberPart = val.substr(0,nonIdx);
    	var nonNumberPart = val.substr(nonIdx,val.length);
    	
    	var scale;
    	var tag = nonNumberPart.toLowerCase();
    	if(tag === "y" || tag === "yr" || tag === "yrs" || tag === "year" || tag === "years") {
    		scale = hyperic.unit.UnitsConstants.SCALE_YEAR;
    	} else if(tag === "w" || tag === "wk" || tag === "wks" || tag === "week" || tag === "weeks") {
    		scale = hyperic.unit.UnitsConstants.SCALE_WEEK;
        } else if(tag === "d" || tag === "day" || tag === "days") {
            scale = hyperic.unit.UnitsConstants.SCALE_DAY;
        } else if(tag === "h" || tag === "hr" || tag === "hrs" || tag === "hour" || tag === "hours") {
            scale = hyperic.unit.UnitsConstants.SCALE_HOUR;
        } else if(tag === "m" || tag === "min" || tag === "mins" || tag === "minute" || tag === "minutes") {
            scale = hyperic.unit.UnitsConstants.SCALE_MIN;
        } else if(tag === "s" || tag === "sec" || tag === "secs" || tag === "second" || tag === "seconds") {
            scale = hyperic.unit.UnitsConstants.SCALE_SEC;        	
        } else if(tag === "ms" || tag === "milli" || tag === "millis" || tag === "millisecond" || tag === "milliseconds") {
            scale = hyperic.unit.UnitsConstants.SCALE_MILLI;          
        } else if(tag === "us" || tag === "micro" || tag === "micros" || tag === "microsecond" || tag === "microseconds") {
            scale = hyperic.unit.UnitsConstants.SCALE_MICRO;          
        } else if(tag === "ns" || tag === "nano" || tag === "nanos" || tag === "nanosecond" || tag === "nanoseconds") {
            scale = hyperic.unit.UnitsConstants.SCALE_NANO;          
        } else if(tag === "j" || tag === "jif" || tag === "jifs" || tag === "jiffy" || tag === "jiffys" || tag === "jifferoonies") {
            scale = hyperic.unit.UnitsConstants.SCALE_JIFFY;          
    	}
    	var parsedNumber = dojo.number.parse(numberPart,{});
    	return new hyperic.unit.UnitNumber({value: parsedNumber, units: hyperic.unit.UnitsConstants.UNIT_DURATION, scale: scale});
    },
    
    _parseRegular: function(val){
        // summary:
        //     xxx
    	var vals = val.split(" ");
    	var value;
    	var scale = hyperic.unit.UnitsConstants.SCALE_SEC;
    	if (vals.length == 2 &&
    	    vals[0].charAt(vals[0].length - 1) == 'y' &&
    	    vals[1].charAt(vals[1].length - 1) == 'd') {
    		var yStr = vals[0].substring(0, vals[0].length - 1);
    		var dStr = vals[1].substring(0, vals[1].length - 1);
    		value = parseInt(yStr) * 365 + parseInt(dStr);
    		scale = hyperic.unit.UnitsConstants.SCALE_DAY;
    	} else if (vals.length == 3 &&
    	           (vals[1] === "day" || vals[1] === "days")) {
    		value = parseInt(vals[0]) * 24 * 60 * 60 + this._parseTimeStr(vals[2]);
        } else if (vals.length == 1) {
        	value = this._parseTimeStr(vals[0]);
    	} else {
    		return null;
    	}
    	if(value==null) return null;
    	return new hyperic.unit.UnitNumber({value:value, units:hyperic.unit.UnitsConstants.UNIT_DURATION, scale:scale});
    },
    
    _parseTimeStr: function(duration) {
        // summary:
        //     xxx
    	var nHours, nMins, nSecs;
    	var vals = duration.split(":");
    	nHours = parseFloat(vals[0]);
        nMins = parseFloat(vals[1]);
        nSecs = parseFloat(vals[2]);
        if(isNaN(nHours) || isNaN(nMins) || isNaN(nSecs)) return null;
        return nHours * 60 * 60 + nMins * 60 + nSecs;
    },

    getBaseValue: function(/*double*/value, /*int*/scale){
        // summary:
        //     xxx
    	var dFormat = new hyperic.unit.DateFormatter();
    	return dFormat.getBaseValue(value, scale);
    },

    getScaledValue: function(/*Number*/value, /*int*/scale){
        // summary:
        //     xxx
        var dFormat = new hyperic.unit.DateFormatter();
        return dFormat.getScaledValue(value, scale);
    },
    
    _getGranularity: function(/*UnitNumber*/val){
        // summary:
        //     xxx
    	var nanoSecs = val.getBaseValue();
    	if (nanoSecs > 0) {
    		var tbd = this._breakDownTime(nanoSecs);
    		if(tbd.nYears > 0) {
    			return hyperic.unit.UnitsConstants.GRANULAR_YEARS;
    		} else if(tbd.nDays > 0) {
    			return hyperic.unit.UnitsConstants.GRANULAR_DAYS;
    		} else if(tbd.nHours > 0) {
    			return hyperic.unit.UnitsConstants.GRANULAR_HOURS;
    		} else if(tbd.nMins > 0) {
    			return hyperic.unit.UnitsConstants.GRANULAR_MINS;
    		} else if(tbd.nSecs > 0) {
    			return hyperic.unit.UnitsConstants.GRANULAR_SECS;
    		} else {
                return hyperic.unit.UnitsConstants.GRANULAR_MILLIS;
            }                 		
    	} else {
    		switch (val.scale) {
    			case hyperic.unit.UnitsConstants.SCALE_YEAR:
    			    return hyperic.unit.UnitsConstants.GRANULAR_YEARS;
                case hyperic.unit.UnitsConstants.SCALE_DAY:
                    return hyperic.unit.UnitsConstants.GRANULAR_DAYS;
                case hyperic.unit.UnitsConstants.SCALE_HOUR:
                    return hyperic.unit.UnitsConstants.GRANULAR_HOURS;
                case hyperic.unit.UnitsConstants.SCALE_MIN:
                    return hyperic.unit.UnitsConstants.GRANULAR_MINS;
                case hyperic.unit.UnitsConstants.SCALE_SEC:
                    return hyperic.unit.UnitsConstants.GRANULAR_SECS;
                default:
                    return hyperic.unit.UnitsConstants.GRANULAR_MILLIS;
    		}
    	}
    },
    
    _breakDownTime: function(/*Number*/val){
    	// summary:
    	//     Breaks given time to individual years, days, etc.
    	//
    	var r = {};
    	r.nYears = Math.floor(val / hyperic.unit.UnitsUtil.FACT_YEARS);
    	if(r.nYears > 0) val = val - (hyperic.unit.UnitsUtil.FACT_YEARS * r.nYears);

        r.nDays = Math.floor(val / hyperic.unit.UnitsUtil.FACT_DAYS);
        if(r.nDays > 0) val = val - (hyperic.unit.UnitsUtil.FACT_DAYS * r.nDays);

        r.nHours = Math.floor(val / hyperic.unit.UnitsUtil.FACT_HOURS);
        if(r.nHours > 0) val = val - (hyperic.unit.UnitsUtil.FACT_HOURS * r.nHours);

        r.nMins = Math.floor(val / hyperic.unit.UnitsUtil.FACT_MINS);
        if(r.nMins > 0) val = val - (hyperic.unit.UnitsUtil.FACT_MINS * r.nMins);

        r.nSecs = Math.floor(val / hyperic.unit.UnitsUtil.FACT_SECS);
        if(r.nSecs > 0) val = val - (hyperic.unit.UnitsUtil.FACT_SECS * r.nSecs);
        
        r.nMilli = Math.floor(val / hyperic.unit.UnitsUtil.FACT_MILLIS);
    	
    	return r; 
    }

});