dojo.provide("hyperic.unit.CurrencyFormatter");

dojo.require("hyperic.unit.SimpleFormatter");
dojo.require("dojo.currency");

dojo.declare("hyperic.unit.CurrencyFormatter",
    [ hyperic.unit.SimpleFormatter ],{
        
    // rights, so HQ base format is cents, not dollars
    // just divide
    formatNumber: function(/*Number*/rawValue, f){
        return f(rawValue/100,{currency: "USD"});
    },
    
    getNumberFormat: function() {
            return dojo.currency.format;
    }
    
        
});