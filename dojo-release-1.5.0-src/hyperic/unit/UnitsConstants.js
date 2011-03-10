dojo.provide("hyperic.unit.UnitsConstants");


hyperic.unit.UnitsConstants.UNIT_NONE       = 0;
hyperic.unit.UnitsConstants.UNIT_CURRENCY   = 1;
hyperic.unit.UnitsConstants.UNIT_BYTES      = 2;
hyperic.unit.UnitsConstants.UNIT_BITS       = 3;
hyperic.unit.UnitsConstants.UNIT_DURATION   = 4;
hyperic.unit.UnitsConstants.UNIT_DATE       = 5;
hyperic.unit.UnitsConstants.UNIT_PERCENTAGE = 6;
hyperic.unit.UnitsConstants.UNIT_PERCENT    = 7;
hyperic.unit.UnitsConstants.UNIT_APPROX_DUR = 8;
hyperic.unit.UnitsConstants.UNIT_BYTES2BITS = 9;
hyperic.unit.UnitsConstants.UNIT_MAX        = 10; //used for checkValidUnits()

hyperic.unit.UnitsConstants.SCALE_NONE  = 0;

// Binary based scaling factors
hyperic.unit.UnitsConstants.SCALE_KILO  = 1;
hyperic.unit.UnitsConstants.SCALE_MEGA  = 2;
hyperic.unit.UnitsConstants.SCALE_GIGA  = 3;
hyperic.unit.UnitsConstants.SCALE_TERA  = 4;
hyperic.unit.UnitsConstants.SCALE_PETA  = 5;

// Time based scaling factors
hyperic.unit.UnitsConstants.SCALE_YEAR  = 6;
hyperic.unit.UnitsConstants.SCALE_WEEK  = 7;
hyperic.unit.UnitsConstants.SCALE_DAY   = 8;
hyperic.unit.UnitsConstants.SCALE_HOUR  = 9;
hyperic.unit.UnitsConstants.SCALE_MIN   = 10;
hyperic.unit.UnitsConstants.SCALE_SEC   = 11;
hyperic.unit.UnitsConstants.SCALE_JIFFY = 12;
hyperic.unit.UnitsConstants.SCALE_MILLI = 13;
hyperic.unit.UnitsConstants.SCALE_MICRO = 14;
hyperic.unit.UnitsConstants.SCALE_NANO  = 15;

hyperic.unit.UnitsConstants.SCALE_BIT   = 16;

hyperic.unit.UnitsConstants.GRANULAR_YEARS  = 1;  // Time > 1 year
hyperic.unit.UnitsConstants.GRANULAR_DAYS   = 2;  // 1 day < time < 1 year 
hyperic.unit.UnitsConstants.GRANULAR_HOURS  = 3;  // 1 hour < time < 1 day
hyperic.unit.UnitsConstants.GRANULAR_MINS   = 4;  // 1 min < time < 1 hour
hyperic.unit.UnitsConstants.GRANULAR_SECS   = 5;  // 1 sec < time < 1 min
hyperic.unit.UnitsConstants.GRANULAR_MILLIS = 6;  // 0 < time < 1 sec
