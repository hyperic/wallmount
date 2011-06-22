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

dojo.provide("hyperic.unit.SimpleFormatter");

dojo.require("dojo.number");
dojo.require("hyperic.unit.UnitNumber");
dojo.require("hyperic.unit.UnitsConstants");

dojo.declare("hyperic.unit.SimpleFormatter",
    null,{

    format: function(/*Object*/val) {
        return this.formatNumber(val.value,this.getNumberFormat());
    },
      
    getNumberFormat: function() {
        // summary:
        //      defines the number formatter. We define this
        //      as a function for implementors to define
        //      its own formatters
        return dojo.number.format;
    },

    parse: function(/*String*/val, unitType, /*String*/locale){
        // summary:
        var parsedNumber = this.parseValue(val,this.getParser());
        return new hyperic.unit.UnitNumber({value: parsedNumber,
                                            units: hyperic.unit.UnitsConstants.UNIT_NONE,
                                            scale: hyperic.unit.UnitsConstants.SCALE_NONE});
    },

    getParser: function() {
        // summary:
        return dojo.number.parse;
    },

    getBaseValue: function(/*double*/value, /*int*/scale){
        return value;
    },

    getScaledValue: function(/*Number*/value, /*int*/targScale){
        return value;
    }

});