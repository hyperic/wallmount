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
    