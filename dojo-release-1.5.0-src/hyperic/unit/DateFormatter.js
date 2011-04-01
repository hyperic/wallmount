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

dojo.provide("hyperic.unit.DateFormatter");

dojo.require("dojo.number");
dojo.require("dojo.date.locale");

dojo.declare("hyperic.unit.DateFormatter",
    null,{

    format: function(/*Object*/val, /*Object*/format, /*String*/locale) {
    	
        var f = format || {
            formatLength:'medium'
            };
            
        f.locale = locale || f.locale || 'en-us';
            
        var baseVal = val.getBaseValue() / hyperic.unit.UnitsUtil.FACT_MILLIS;
        var date = new Date(baseVal);
        return dojo.date.locale.format(date, f);
    },
        
    getBaseValue: function(/*double*/value, /*int*/scale){
        return this.getBaseTime(value, scale);	
    },
        
    getScaledValue: function(/*Number*/value, /*int*/targScale){
        return this.getScaledTime(value, targScale);	
    },
    
    getScaledTime: function(/*Number*/value, /*Number*/targScale){
    	return value / this.getScaleCoeff(targScale);
    },
    
    getBaseTime: function (/*Number*/value, /*Number*/scale){
        return value * this.getScaleCoeff(scale);
    },
    
    getScaleCoeff: function (/*Number*/scale){
        switch(scale){
            case hyperic.unit.UnitsConstants.SCALE_NONE:
                return hyperic.unit.UnitsUtil.FACT_NONE;
            case hyperic.unit.UnitsConstants.SCALE_NANO:
                return hyperic.unit.UnitsUtil.FACT_NANOS;
            case hyperic.unit.UnitsConstants.SCALE_MICRO:
                return hyperic.unit.UnitsUtil.FACT_MICROS;
            case hyperic.unit.UnitsConstants.SCALE_MILLI:
                return hyperic.unit.UnitsUtil.FACT_MILLIS;
            case hyperic.unit.UnitsConstants.SCALE_JIFFY:
                return hyperic.unit.UnitsUtil.FACT_JIFFYS;
            case hyperic.unit.UnitsConstants.SCALE_SEC:
                return hyperic.unit.UnitsUtil.FACT_SECS;
            case hyperic.unit.UnitsConstants.SCALE_MIN:
                return hyperic.unit.UnitsUtil.FACT_MINS;
            case hyperic.unit.UnitsConstants.SCALE_HOUR:
                return hyperic.unit.UnitsUtil.FACT_HOURS;
            case hyperic.unit.UnitsConstants.SCALE_DAY:
                return hyperic.unit.UnitsUtil.FACT_DAYS;
            case hyperic.unit.UnitsConstants.SCALE_WEEK:
                return hyperic.unit.UnitsUtil.FACT_WEEKS;
            case hyperic.unit.UnitsConstants.SCALE_YEAR:
                return hyperic.unit.UnitsUtil.FACT_YEARS;
        }
        
//        throw new IllegalArgumentException("Value did not have time " +
//                                           "based scale");
    }
        
});
