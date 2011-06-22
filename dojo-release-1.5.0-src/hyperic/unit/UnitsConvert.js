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

dojo.provide("hyperic.unit.UnitsConvert");

dojo.require("hyperic.unit.UnitsFormat");
dojo.require("hyperic.unit.UnitNumber");
dojo.require("hyperic.unit.UnitsConstants");

hyperic.unit.UnitsConvert.convert = function(/*Double*/val, /*String*/units, /*Object*/format, /*String*/locale) {
    // summary:
    //     xxx
	
    var un = hyperic.unit.UnitsConvert.getUnitNumber(val,units,format,locale);
    return hyperic.unit.UnitsFormat.format(un, format, locale);
};

hyperic.unit.UnitsConvert.getUnitNumber = function(/*Double*/val, /*String*/units, /*Object*/format, /*String*/locale) {
    // summary:
    //     xxx
    
    var unit, scale;

    unit  = hyperic.unit.UnitsConvert.getUnitForUnit(units);
    scale = hyperic.unit.UnitsConvert.getScaleForUnit(units);

    return new hyperic.unit.UnitNumber({value: val, units: unit, scale: scale});
};


hyperic.unit.UnitsConvert.getUnitForUnit = function(/*String*/unit){
    // summary:
    //     xxx
    
    var res; // integer
    if((res = hyperic.unit.UnitsConvert.unitsToUnit[unit]) == null)
        return hyperic.unit.UnitsConvert.unitsToUnit["none"];
    return res;
};

hyperic.unit.UnitsConvert.getScaleForUnit = function(/*String*/unit){
    // summary:
    //     xxx
    
    var res; // integer
    if((res = hyperic.unit.UnitsConvert.unitsToScale[unit]) == null)
        return hyperic.unit.UnitsConvert.unitsToScale["none"];
    return res;
};

// units to unit mapping table
hyperic.unit.UnitsConvert.unitsToUnit = {
	none:          hyperic.unit.UnitsConstants.UNIT_NONE,
	percentage:    hyperic.unit.UnitsConstants.UNIT_PERCENTAGE,
	percent:       hyperic.unit.UnitsConstants.UNIT_PERCENT,
	B:             hyperic.unit.UnitsConstants.UNIT_BYTES,
    KB:            hyperic.unit.UnitsConstants.UNIT_BYTES,
    MB:            hyperic.unit.UnitsConstants.UNIT_BYTES,
    GB:            hyperic.unit.UnitsConstants.UNIT_BYTES,
    TB:            hyperic.unit.UnitsConstants.UNIT_BYTES,
    PB:            hyperic.unit.UnitsConstants.UNIT_BYTES,
    b:             hyperic.unit.UnitsConstants.UNIT_BITS,
    bytesToBits:   hyperic.unit.UnitsConstants.UNIT_BYTES2BITS,
    Kb:            hyperic.unit.UnitsConstants.UNIT_BITS,
    Mb:            hyperic.unit.UnitsConstants.UNIT_BITS,
    Gb:            hyperic.unit.UnitsConstants.UNIT_BITS,
    Tb:            hyperic.unit.UnitsConstants.UNIT_BITS,
    Pb:            hyperic.unit.UnitsConstants.UNIT_BITS,
    'epoch-millis': hyperic.unit.UnitsConstants.UNIT_DATE,
    'epoch-seconds': hyperic.unit.UnitsConstants.UNIT_DATE,
    ns:            hyperic.unit.UnitsConstants.UNIT_DURATION,
    mu:            hyperic.unit.UnitsConstants.UNIT_DURATION,
    ms:            hyperic.unit.UnitsConstants.UNIT_DURATION,
    jiffys:        hyperic.unit.UnitsConstants.UNIT_DURATION,
    sec:           hyperic.unit.UnitsConstants.UNIT_DURATION,
    cents:         hyperic.unit.UnitsConstants.UNIT_CURRENCY
};

// units to scale mapping table
hyperic.unit.UnitsConvert.unitsToScale = {
    none:          hyperic.unit.UnitsConstants.SCALE_NONE,
    percentage:    hyperic.unit.UnitsConstants.SCALE_NONE,
    percent:       hyperic.unit.UnitsConstants.SCALE_NONE,
    B:             hyperic.unit.UnitsConstants.SCALE_NONE,
    KB:            hyperic.unit.UnitsConstants.SCALE_KILO,
    MB:            hyperic.unit.UnitsConstants.SCALE_MEGA,
    GB:            hyperic.unit.UnitsConstants.SCALE_GIGA,
    TB:            hyperic.unit.UnitsConstants.SCALE_TERA,
    PB:            hyperic.unit.UnitsConstants.SCALE_PETA,
    b:             hyperic.unit.UnitsConstants.SCALE_NONE,
    bytesToBits:   hyperic.unit.UnitsConstants.SCALE_NONE,
    Kb:            hyperic.unit.UnitsConstants.SCALE_KILO,
    Mb:            hyperic.unit.UnitsConstants.SCALE_MEGA,
    Gb:            hyperic.unit.UnitsConstants.SCALE_GIGA,
    Tb:            hyperic.unit.UnitsConstants.SCALE_TERA,
    Pb:            hyperic.unit.UnitsConstants.SCALE_PETA,
    'epoch-millis': hyperic.unit.UnitsConstants.SCALE_MILLI,
    'epoch-seconds': hyperic.unit.UnitsConstants.SCALE_SEC,
    ns:            hyperic.unit.UnitsConstants.SCALE_NANO,
    mu:            hyperic.unit.UnitsConstants.SCALE_MICRO,
    ms:            hyperic.unit.UnitsConstants.SCALE_MILLI,
    jiffys:        hyperic.unit.UnitsConstants.SCALE_JIFFY,
    sec:           hyperic.unit.UnitsConstants.SCALE_SEC
};