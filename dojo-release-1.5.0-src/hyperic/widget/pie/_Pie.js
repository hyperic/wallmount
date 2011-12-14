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

dojo.provide("hyperic.widget.pie._Pie");

dojo.require("hyperic.widget.base.MetricItem");
dojo.require("hyperic.data.LabelProperty");
dojo.require("hyperic.unit.UnitsConvert");
dojo.require("hyperic.charting.Chart2D");
dojo.require("dojox.charting.plot2d.Lines");
dojo.require("hyperic.charting.plot2d.Columns");
dojo.require("hyperic.charting.themes.Glossy");
dojo.require("dojox.charting.Theme");

(function(){
	    
    // transparent color
    var tC = new dojo.Color({ r:1, g:1, b:1, a:0 });

    dojo.declare("hyperic.widget.pie._Pie",
   	    [ hyperic.widget.base.MetricItem,
          hyperic.data.LabelProperty ],{
        // summary:
        //
        // description:
        //     xxx
        //

        // internal data
        _chart: null,

        createSurface: function(){
        	// summary:
    	    //     Creates the surface, builds the graph and renders it
    	
    	    dojo.style(this.wallMountItemContent, { width: this.width+"px", height: this.height+"px" });
    	
        	this._chart = new hyperic.charting.Chart2D(this.wallMountItemContent, {fill:tC}, this.width, this.height);
        	this._addPlot(this._chart);
    	    this._addTheme(this._chart);
            this._addSeries(this._chart);
        	this._chart.render();
        },
    
        _addPlot: function(chart){
            // summary:
            //     xxx
        
        	var args = {};
        	args.type = "Pie";
            args.lines = true;
            chart.addPlot("default",args);
        },
        
        _addSeries: function(chart){
            // summary:
            //     xxx
        
        	chart.addSeries("series", this._getSeries());
//        	chart.addSeries("series", [4, 2, 1, 1]);
        },
    
        _addTheme: function(chart){
            // summary:
            //     xxx
            var _cArray = this.chartColors;
            var _theme = new dojox.charting.Theme(
                	{colors:_cArray,
                     axis:{stroke:{color:this.getLabelColor(),width:1},tick:{color:this.getLabelColor(),position:"center",font:"normal normal normal 7pt Helvetica, Arial, sans-serif",fontColor:this.getLabelColor()}},
                	 plotarea:{fill:tC}});            	
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
        	for (key in arg) {
            	console.log("storeCallback in Pie: " + key + "=" + arg[key] );        		
        	}
//        	this.setSerie(arg.serie);
//            this._chart.updateSeries("series", arg.serie);
//            this._chart.render();
        },
    
        setMetric: function(m) {
            // summary:
            //     Sets used metric and subscribes to correct store topic.
        
//            this.subscribeId = m;
//            if(this.store) {
//            	if(this._storeSubsHdl) this.store.unsubscribe(this._storeSubsHdl);
//                this._storeSubsHdl = this.store.subscribe("metric/" + timeScales[this.chartTimeScale] + "/" + m, this, "storeCallback");        	
//            }
        },
    
        reset: function(){
            // summary:
            //     Simple reset just destroys the chart and re-creates it.
        
//            if(this.store && this._storeSubsHdl) this.store.unsubscribe(this._storeSubsHdl);
        	this._chart.destroy();
        	this.createSurface();
//            if(this.store) this._storeSubsHdl = this.store.subscribe("metric/" + timeScales[this.chartTimeScale] + "/" + this.subscribeId, this, "storeCallback");
        },
        
        asParams: function(){
            // summary:
            //     Returns component parameters as object.
            var paramObj = this.inherited(arguments);
            paramObj['labelColor'] = this.getLabelColor();
            return paramObj;
        }

    });

})();