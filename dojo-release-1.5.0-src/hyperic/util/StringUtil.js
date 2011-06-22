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

dojo.provide("hyperic.util.StringUtil");

dojo.require("dojo.number");

hyperic.util.StringUtil.formatDuration = function(duration, scale, minDigits){
	var hours, mins, digits, millis;

    // int style divisions to get full hours, minutes, millis	
	hours = Math.floor(duration / 3600000);
	duration -= hours * 3600000;
	
	mins = Math.floor(duration / 60000);
	duration -= mins * 60000;
	
	millis = Math.floor(duration / 1000);
	var buf = "";
	
	if (hours > 0 || minDigits == false) {
		buf = buf + (hours < 10 && minDigits == false ? "0" + hours : hours) + ":";
		minDigits = false;
	}
	
	if (mins > 0 || minDigits == false) {
		buf = buf + (mins < 10 && minDigits == false ? "0" + mins : mins) + ":";
		minDigits = false;
	}
	
	digits = (minDigits == false || (scale == 0 && millis >= 9.5) ? 2 : 1);
	buf = buf + dojo.number.format(millis, {pattern:'0#'});
	
	return buf;
};
