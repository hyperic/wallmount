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

dojo.provide("hyperic.unit.UnitsUtil");

hyperic.unit.UnitsUtil.FACT_NONE = 1;
hyperic.unit.UnitsUtil.FACT_BIT = 0.125;

hyperic.unit.UnitsUtil.FACT_KILO_BIN = (1 << 10);
hyperic.unit.UnitsUtil.FACT_MEGA_BIN = 
    hyperic.unit.UnitsUtil.FACT_KILO_BIN * hyperic.unit.UnitsUtil.FACT_KILO_BIN;

hyperic.unit.UnitsUtil.FACT_GIGA_BIN = 
    hyperic.unit.UnitsUtil.FACT_MEGA_BIN * hyperic.unit.UnitsUtil.FACT_KILO_BIN;

hyperic.unit.UnitsUtil.FACT_TERA_BIN = 
    hyperic.unit.UnitsUtil.FACT_GIGA_BIN * hyperic.unit.UnitsUtil.FACT_KILO_BIN;

hyperic.unit.UnitsUtil.FACT_PETA_BIN = 
    hyperic.unit.UnitsUtil.FACT_TERA_BIN * hyperic.unit.UnitsUtil.FACT_KILO_BIN;

    
    
hyperic.unit.UnitsUtil.FACT_NANOS = 1;
hyperic.unit.UnitsUtil.FACT_MICROS = 1000;
hyperic.unit.UnitsUtil.FACT_MILLIS = 1000000;
hyperic.unit.UnitsUtil.FACT_JIFFYS = 10000000;

hyperic.unit.UnitsUtil.FACT_SECS = 
    hyperic.unit.UnitsUtil.FACT_MILLIS * 1000;

hyperic.unit.UnitsUtil.FACT_MINS = 
    hyperic.unit.UnitsUtil.FACT_SECS * 60;
    
hyperic.unit.UnitsUtil.FACT_HOURS = 
    hyperic.unit.UnitsUtil.FACT_MINS * 60; 

hyperic.unit.UnitsUtil.FACT_DAYS = 
    hyperic.unit.UnitsUtil.FACT_HOURS * 24;
    
hyperic.unit.UnitsUtil.FACT_WEEKS =
    hyperic.unit.UnitsUtil.FACT_DAYS * 7;
    
hyperic.unit.UnitsUtil.FACT_YEARS = 
    hyperic.unit.UnitsUtil.FACT_DAYS * 365;
    
hyperic.unit.UnitsUtil.findNonNumberIdx = function(txt) {
    var validChars = "0123456789.";
    var isNumber = true;
    var idx = 0;
    var c; 
    for (; idx < txt.length; idx++) { 
        c = txt.charAt(idx); 
        if (validChars.indexOf(c) == -1) break; 
    }
    if(idx == txt.length) return -1;
    return idx;
};

    