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

dojo.provide("hyperic.charting.themes.Glossy");

dojo.require("dojo.colors");
dojo.require("dojox.charting.Theme");
dojo.require("dojox.charting.themes.gradientGenerator");

(function(){
	
    var dc = dojox.charting, themes = dc.themes, Theme = dc.Theme,
        gi = themes.gradientGenerator.generateGradientByIntensity,
        defaultFill = {type: "linear", space: "shape", x1: 0, y1: 0, x2: 100, y2: 0},
        // 3D cylinder map is calculated using dojox.gfx3d
        cyl3dMap = [
            {o: 0.00, i: 174}, {o: 0.08, i: 231}, {o: 0.18, i: 237}, {o: 0.30, i: 231},
            {o: 0.39, i: 221}, {o: 0.49, i: 206}, {o: 0.58, i: 187}, {o: 0.68, i: 165},
            {o: 0.80, i: 128}, {o: 0.90, i: 102}, {o: 1.00, i: 174}
        ],
        hiliteIndex = 2, hiliteIntensity = 100, lumStroke = 50

    dojo.declare("hyperic.charting.themes.Glossy",
        [ dojox.charting.Theme ] ,{

        constructor: function(kwArgs) {
            this.series.shadow = {dx: 1, dy: 1, width: 3, color: [0, 0, 0, 0.15]};
            this.maincolors = kwArgs.colors || kwArgs.maincolors;
            this.cyl3dFills = dojo.map(this.maincolors, function(c){
                var fill = dojo.delegate(defaultFill),
                    colors = fill.colors = themes.gradientGenerator.generateGradientByIntensity(c, cyl3dMap),
                    hilite = colors[hiliteIndex].color;
                // add highlight
                hilite.r += hiliteIntensity;
                hilite.g += hiliteIntensity;
                hilite.b += hiliteIntensity;
                hilite.sanitize();
                return fill;
            }); 
        },
        
        next: function(elementType, mixin, doPost){
            if(elementType == "bar" || elementType == "column"){
                // custom processing for bars and columns: substitute fills
                var index = this._current % this.seriesThemes.length,
                    s = this.seriesThemes[index], old = s.fill;
                s.fill = this.cyl3dFills[index];
                var theme = this.inherited(arguments);
                // cleanup
                s.fill = old;
                return theme;
            }
            return this.inherited(arguments);
        },

        clone: function(){
            //  summary:
            //      Clone the current theme.
            //  returns: dojox.charting.Theme
            //      The cloned theme; any alterations made will not affect the original.
            var theme = new hyperic.charting.themes.Glossy({
                // theme components
                chart: this.chart,
                plotarea: this.plotarea,
                axis: this.axis,
                series: this.series,
                marker: this.marker,
                // individual arrays
                colors: this.colors,
                maincolors: this.maincolors,
                markers: this.markers,
                seriesThemes: this.seriesThemes,
                markerThemes: this.markerThemes,
                // flags
                noGradConv: this.noGradConv,
                noRadialConv: this.noRadialConv
            });
            // copy custom methods
            dojo.forEach(
                ["clone", "clear", "next", "skip", "addMixin", "post", "getTick"],
                function(name){
                    if(this.hasOwnProperty(name)){
                        theme[name] = this[name];
                    }
                },
                this
            );
            return theme;   //  dojox.charting.Theme
        }

    });

})();