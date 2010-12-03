dojo.provide("hyperic.unit.SimpleFormatter");

dojo.require("dojo.number");

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
      	}
      	
});