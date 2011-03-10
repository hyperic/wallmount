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
