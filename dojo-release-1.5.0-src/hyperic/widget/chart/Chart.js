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

dojo.provide("hyperic.widget.chart.Chart");

dojo.require("hyperic.widget.base._WallMountItem");
dojo.require("hyperic.data.ChartProperty");
dojo.require("hyperic.unit.UnitsConvert");
dojo.require("hyperic.charting.Chart2D");
dojo.require("dojox.charting.plot2d.Lines");
dojo.require("hyperic.charting.plot2d.Columns");
dojo.require("hyperic.charting.themes.Glossy");
dojo.require("dojox.charting.Theme");

(function(){
	
	// Abstraction of supported chart types
	var types = {
		Lines: dojo.getObject('dojox.charting.plot2d.Lines'),
        Bars: dojo.getObject('hyperic.charting.plot2d.Columns')
	};

    // Abstraction of supported chart time scales
    var timeScales = {
    	'1h': 60,
    	'8h': 480,
        '1d': 1440,
        '1w': 10080,
        '1m': 43200,
        '1y': 525600
    };

    dojo.declare("hyperic.widget.chart.Chart",
        [ hyperic.widget.base._WallMountItem,
          hyperic.data.ChartProperty ],{
        // summary:
        //     Base chart implementation to bring all needed
        //     functionality under same roof.
        //
        // description:
        //     xxx
        //
        // TODO:
        // - include zero
        // - axis color
        // - theme/coloring. theming is ok, but we may want to change "main" color.

        // internal data
        _chart: null,
        _subscribeHandle:null,

        createSurface: function(){
        	// summary:
    	    //     Creates the surface, builds the graph and renders it
    	
    	    dojo.style(this.wallMountItemContent, { width: this.width+"px", height: this.height+"px" });
    	
        	this._chart = new hyperic.charting.Chart2D(this.wallMountItemContent, null, this.width, this.height);
        	this._addPlot(this._chart);
    	    this._addTheme(this._chart);
            this._addXAxis(this._chart);
            this._addYAxis(this._chart);
            this._addSeries(this._chart);
        	this._chart.render();
        },
    
        _addPlot: function(chart){
            // summary:
            //     xxx
        
        	var args = {};
        	args.type = types[this.chartType];
            args.lines = true;
            if(this.chartType == 'Lines') args.tension = 0;
            if(this.chartType == 'Bars') args.gap = 2;
            chart.addPlot("default",args);
        },
    
        _addXAxis: function(chart){
            // summary:
            //     xxx
        
            var args = {
                minorTicks: false,
                labelFunc: dojo.hitch(this, "_labelXFunc")        	
            };
    	    chart.addAxis("x",args);
        },
    
        _addYAxis: function(chart){
            // summary:
            //     xxx
        
            var args = {
                vertical: true,
                fixUpper: "major",
                fixLower: "major",
                minorTicks: false,        	
                labelFunc: dojo.hitch(this, "_labelYFunc")          
            };
            chart.addAxis("y",args);
        },
    
        _addSeries: function(chart){
            // summary:
            //     xxx
        
        	chart.addSeries("series", this._getSeries());
        },
    
        _addTheme: function(chart){
            // summary:
            //     xxx
            var _cArray = this.chartColors;
            var _theme;
            if(this.chartTheme == 'glossy') {
            	var defaultFill = {type: "linear", space: "shape", x1: 0, y1: 0, x2: 100, y2: 0};
                _theme = new hyperic.charting.themes.Glossy(
                    {colors:_cArray,
                     seriesThemes: dojox.charting.themes.gradientGenerator.generateMiniTheme(_cArray, defaultFill, 90, 40, 25)});            	
            } else {
                _theme = new dojox.charting.Theme({colors:_cArray});            	
            }
            chart.setTheme(_theme);
        },

        setSerie: function(serie) {
            // summary:
            //     xxx
        
            this._serie = serie;    	
        },
    
        setTheme: function(theme) {
            // summary:
            //     xxx
        
        	this.chartTheme = theme;
        	
        },
    
        _getSeries: function(){
            // summary:
            //     xxx
            
            if(typeof(this._serie) === 'undefined') return []; 
        	return this._serie;
        },
        
        storeCallback: function(arg) {
            // summary:
            //     Store callback to listen series updates from metric store.
        
            this._chart.updateSeries("series", arg.serie);
            this._chart.render();
        },
    
        setMetric: function(m) {
            // summary:
            //     Sets used metric and subscribes to correct store topic.
        
            this.subscribeId = m;
            if(this.store) {
            	if(this._subscribeHandle != null) this.store.unsubscribe(this._subscribeHandle);
                this._subscribeHandle = this.store.subscribe("metric/" + timeScales[this.chartTimeScale] + "/" + m, this, "storeCallback");        	
            }
        },
    
        _labelXFunc: function(/*Number*/val){
            // summary:
            //     Labeling for x-axis
        
            var f = {
                formatLength:'medium',
            };
        
            if(timeScales[this.chartTimeScale] < 1441) {
            	f.timePattern = "HH:mm";
            	f.selector = "time";
            } else {
                f.datePattern = "dd/MM";        	
                f.selector = "date";
            }
            
        	return hyperic.unit.UnitsConvert.convert(val, "epoch-millis", f);
        },

        _labelYFunc: function(/*Number*/val){
            // summary:
            //     Labeling for y-axis
        
            return hyperic.unit.UnitsConvert.convert(val, this.format, {places:'0,2'});
        },
    
        reset: function(){
            // summary:
            //     Simple reset just destroys the chart and re-creates it.
        
        	this._chart.destroy();
        	this.createSurface();
        },
        
        asParams: function(){
            // summary:
            //     Returns component parameters as object.
            var paramObj = this.inherited(arguments);
            paramObj['chartType'] = this.getChartType();
            paramObj['chartTheme'] = this.getChartTheme();
            paramObj['chartColors'] = this.getChartColors();
            paramObj['chartTimeScale'] = this.getChartTimeScale();
            return paramObj;
        }

    });

})();