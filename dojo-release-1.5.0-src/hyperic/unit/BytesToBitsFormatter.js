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

dojo.provide("hyperic.unit.BytesToBitsFormatter");

dojo.require("hyperic.unit.BitRateFormatter");

dojo.declare("hyperic.unit.BytesToBitsFormatter",
    [ hyperic.unit.BitRateFormatter ],{
        
    createFormattedValue: function(value, scale, fmt) {
    	arguments[0] = arguments[0]*8;
    	return this.inherited(arguments);
    },
    
    parseTag: function(number, t, tagIdx){
        var scale;
        var tag = t.toLowerCase();
        if(tag == ("b") || tag == ("b/sec")) {
            scale = hyperic.unit.UnitsConstants.SCALE_NONE;
        } else if(tag == ("k") || tag == ("kb") || tag == ("kb/sec")) {
            scale = hyperic.unit.UnitsConstants.SCALE_KILO;
        } else if(tag == ("m") || tag == ("mb") || tag == ("mb/sec")) {
            scale = hyperic.unit.UnitsConstants.SCALE_MEGA;
        } else if(tag == ("g") || tag == ("gb") || tag == ("gb/sec")) {
            scale = hyperic.unit.UnitsConstants.SCALE_GIGA;
        } else if(tag == ("t") || tag == ("tb") || tag == ("tb/sec")) {
            scale = hyperic.unit.UnitsConstants.SCALE_TERA;
        } else if(tag == ("p") || tag == ("pb") || tag == ("pb/sec")) {
            scale = hyperic.unit.UnitsConstants.SCALE_PETA;
        } else {
            // TODO: handle this correctly
            console.log("Unknown bitrate type '" + tag + "' " + tagIdx);
        }
        var parsedNumber = dojo.number.parse(number,{})/8;
        return new hyperic.unit.UnitNumber({value: parsedNumber, units: hyperic.unit.UnitsConstants.UNIT_BITS, scale: scale});
    }
    
});