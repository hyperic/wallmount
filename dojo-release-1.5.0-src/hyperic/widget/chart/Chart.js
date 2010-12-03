dojo.provide("hyperic.widget.chart.Chart");

dojo.require("hyperic.widget.base._WallMountItem");
dojo.require("hyperic.unit.UnitsConvert");
dojo.require("hyperic.charting.Chart2D");
dojo.require("dojox.charting.themes.PlotKit.blue");


dojo.declare("hyperic.widget.chart.Chart",
    [hyperic.widget.base._WallMountItem],{

    _chart: null,

    createSurface: function(){
    	dojo.style(this.wallMountItemContent, { width: this.width+"px", height: this.height+"px" });
    	
    	var epoch = new Date().getTime();
    	
    	this._chart = new hyperic.charting.Chart2D(this.wallMountItemContent, null, this.width, this.height);
    	this._chart.
//            setTheme(dojox.charting.themes.PlotKit.blue).
            addPlot("default", {
                type: "Default",
                lines: true,
                markers: false,
                tension: 0
            }).
            addAxis("x", {
//                min: epoch-240000,
//                max: epoch+60000,
                majorTick: { stroke: "black", length: 5 },
                minorTicks: false,
                labelFunc: dojo.hitch(this, "_labelFunc")
            }).
            addAxis("y", {
                vertical: true,
                fixUpper: "major",
                fixLower: "major",
                majorTickStep: 1,
                majorTick: { stroke: "black", length: 5 },
                minorTicks: false
            }).
            addSeries("Series A", [
                { x: epoch-180000, y: 5 },
                { x: epoch-120000, y: 1.5 },
                { x: epoch-60000, y: 9 },
                { x: epoch, y: 0.3 }
            ],{stroke: {color: "red"}}).
            render();
    },
//    startup: function(){
//
//        this.inherited(arguments);
//        this.draw();
//       
//    },
//    
//    draw: function(){
//    	this._chart.render();
//    },

    storeCallback: function(arg) {
        // summary:
        this._chart.updateSeries("Series A", arg);
        this._chart.render();
//        this.reset();
    },
    setMetric: function(m) {
        // summary:
        this.subscribeId = m;
        this.store.subscribe("metric/60/" + m, this, "storeCallback");
    },
    
    _labelFunc: function(/*Number*/val){
        var f = {
            formatLength:'medium',
            timePattern: "HH:mm",
            selector: "time"
            };
    	return hyperic.unit.UnitsConvert.convert(val, "epoch-millis", f);
    },
    
    reset: function(){
    	this._chart.destroy();
    	this.createSurface();
    }
    

});