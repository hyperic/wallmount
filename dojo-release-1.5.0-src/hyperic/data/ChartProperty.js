dojo.provide("hyperic.data.ChartProperty");

dojo.declare("hyperic.data.ChartProperty",null,{

    // chartType: String
    //     Type of chart. Either Lines or Bars.
    chartType: "Lines",
    
    // theme: String
    //     Used chart theme.
    chartTheme: "Julie",
    
    // timeScale: String
    //     Defines chart time window. One of 1h, 8h, 1d, 1w, 1m, 1y
    chartTimeScale: "8h",


    constructor: function(){
    },
    
    getChartType: function(){
        return this.chartType;
    },
    
    _setChartTypeAttr: function(value){
        this.chartType = value;
    },

    getChartTheme: function(){
        return this.chartTheme;
    },
    
    _setChartThemeAttr: function(value){
        this.chartTheme = value;
    },

    getChartTimeScale: function(){
        return this.chartTimeScale;
    },
    
    _setChartTimeScaleAttr: function(value){
        this.chartTimeScale = value;
    }

    
});