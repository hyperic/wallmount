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

dojo.provide("hyperic.widget.avail._Availability");

dojo.require("hyperic.widget.base.ResourceItem");
dojo.require("hyperic.data.LegendsProperty");
dojo.require("hyperic.util.MathUtil");
dojo.require("hyperic.util.FontUtil");

dojo.declare("hyperic.widget.avail._Availability",
    [ hyperic.widget.base.ResourceItem,
      hyperic.data.LegendsProperty,
      hyperic.widget.base.MetricMixin],{
    // summary:
    //      This is a base class for widgets tracking resource
    //      availabilities.
    //
    // description:
    //      Other "normal" widgets are usually
    //      attached to certain metric id which gives enough
    //      information for widget to do its magic. This class
    //      ant its childs need to know the resource id to track
    //      internals of groups, types, etc.
    //
    //      Widget supports showing individual information for
    //      underlying alerts and escalations. It's up to the
    //      child how these are shown in the actual widget. This
    //      base class can hold info on how many active alerts for
    //      past day there is or how many escalations are
    //      currently running.
    //
    // resource avail values from main dist:
    //      AVAIL_UNKNOWN = 2.0
    //      AVAIL_UP = 1.0
    //      AVAIL_DOWN = 0.0
    //      AVAIL_WARN = 0.5
    //      AVAIL_PAUSED = -0.01
    //      AVAIL_POWERED_OFF = -0.02
    //
    // resource avail tracking:
    //      resource - avail from single resource
    //      group - tracks avail from all group members.
    //      resource type - tracks avail from all same types
    //      application - tracks avail off an application
    // 
    // legends:
    //      Legend is a extra information usually drawn to top of
    //      corner to give little numerical information how many
    //      "something" is behind the resource. It might for example
    //      tell that resource has 2 active alerts, etc.
    //  
    
    // baseImgUrl: String
    //      base path to resources, images, etc
    baseImgUrl: dojo.baseUrl + "../hyperic/widget/avail/resources/",
    
    // proto: Boolean
    //      Indicates whether eid is a resource prototype
    proto: false,
    
    // eid:
    //      Resource entity id
//    eid: null,
    
    startup: function(){
        this.inherited(arguments);
    },
    
    getStatus: function() {
    	// summary:
    	//     Returns availability string reflecting
    	//     the actual metric value. 
    	switch(this.value) {
            case 1:
                return "ok";
            case 0:
                return "alert";
            case 0.5:
                return "warn";
            case -0.01:
                return "disabled";
            case -0.02:
                return "off";
            default:
                return "unknown";
        }
    },

//    setEid: function(m) {
//        // summary:
//        this.eid = m;
//        if(this.store) {
//        	this._storeSubsHdl = this.store.subscribe("ravail/" + m, this, "storeAvailCallback");
//        }
//    },

    storeAvailCallback: function(arg) {
        // summary:
    	this.setValue(arg.last);
        this.reset();
    },
    
    
    getResourceType: function() {
        // summary:
        //     eturns resource type string
        if(this.eid){
            if(this.proto)
               return "t";
            if(this.eid.indexOf("5:") === 0)
               return "g";
            if(this.eid.indexOf("4:") === 0)
               return "a";
            else return "r"; // if here either plat, server or service
        } else {
        	return "t"; // XXX: for testing
        }
    },
    
    drawLegend: function(data){
        // summary:
        //     Draws a single legend
        
        // don't draw if legend value is zero or undefined
        if(typeof(data.value) === 'undefined' || data.value === 0) return;
    	    	
    	var insets = this.legendsInsets();
    	var val = data.value+''; // make sure it's a string
    	    	
    	// for now, inRad is e.g. top from insets    	
    	var inRad = this.getLegendSize();//insets.top;

        // just estimate border width from total size    	
        var bW = Math.max(Math.round(inRad/6), 1); 
        
        var ret = this._getLegendPath(inRad,val);
        var pathstr = ret.path;
        var center = ret.center;        
        var glossystr = ret.glossy;

        var trans = {};
        if(data.position == 0){ // top-left
            // shift by half a border + one pixel
            trans.dx = 1+bW/2;
            // shift by half a border + one pixel
            trans.dy = 1+bW/2;
        } else if(data.position == 2){ // top-right
            // shift to right total component width, then
            // shift back by legend width, half a border
            // and one pixel
            trans.dx = this.width - 2*center - bW/2 - 1;
            trans.dy = 1+bW/2;            
        } else {
            return;
        }

        //shadow
        var shadowpath1 = this.surface.createPath({path: pathstr});
        shadowpath1.setTransform([{dx:trans.dx,dy:trans.dy+bW*1.5}]);
        shadowpath1.setFill([0,0,0,0.5]);


        //legend
        var path = this.surface.createPath({path: pathstr});
        path.setTransform(trans);
        path.setFill(data.color);
        path.setStroke({color: "whitesmoke", width: bW, join: "round" });
                
        var fS = hyperic.util.FontUtil.findGoodSizeFontByRect('X', inRad*2, inRad*2);
        var text = this.drawText(data.value, center, inRad+fS*0.35 , "middle", "white", {family:"Helvetica",weight:"bold",size:fS+'px'});
        text.setTransform(trans);

        //glossy
        var glossy = this.surface.createPath({path: glossystr});
        glossy.setTransform(trans);
        glossy.setFill([255,255,255,0.5]);
        
    },
    
    getLegendSize: function(){
        // summary:
        //     Returns the legend size.
        //
        // description:
        //      This value determines the legend radius.
        //      Childs may overwrite this to provide its
        //      own way to set the size.
    	return 10;
    },
    
    _getLegendPath: function(inRad,val) {
        // summary:
        //     Constructs legend svg path as string
        var x = inRad;
        var y = 0;
        var path = 'M' + x + ',' + y + ' ';
        var glossy = 'M' + x + ',' + y + ' ';
        var center = 0;
        var radX = hyperic.util.MathUtil.arcXPointByDegree(inRad,15);
        var radY = hyperic.util.MathUtil.arcYPointByDegree(inRad,15);
        if(val.length < 2) {
            center = inRad;
            y = 2*inRad;
            path += 'A'+inRad+','+inRad+','+'0,0,0,'+x+','+y+' ';
            y = 0;
            path += 'A'+inRad+','+inRad+','+'0,0,0,'+x+','+y+' ';
            path += 'z';
            
            glossy += 'A'+inRad+','+inRad+','+'0,0,0,'+(inRad-radX)+','+(inRad-radY)+' ';
            glossy += 'C'+center+','+inRad+','+center+','+inRad+','+(inRad+radX)+','+(inRad-radY)+' ';
            glossy += 'A'+inRad+','+inRad+','+'0,0,0,'+x+','+y+' ';
            glossy += 'z';
            
        } else {
            center = (2*inRad + (val.length-1) * inRad) / 2;
            y = 2*inRad;
            path += 'A'+inRad+','+inRad+','+'0,0,0,'+x+','+y+' ';
            glossy += 'A'+inRad+','+inRad+','+'0,0,0,'+(inRad-radX)+','+(inRad-radY)+' ';
            var _x = x;
            x += (val.length-1) * inRad;
            path += 'H'+x+' ';
            glossy += 'C'+center+','+inRad+','+center+','+inRad+','+(x+radX)+','+(inRad-radY)+' ';
            y = 0;
            path += 'A'+inRad+','+inRad+','+'0,0,0,'+x+','+y+' ';
            glossy += 'A'+inRad+','+inRad+','+'0,0,0,'+x+','+y+' ';
            x = _x;
            path += 'H'+x+' ';
            path += 'z';

            glossy += 'z';            
        }
        return {path:path,center:center,glossy:glossy};             
    },
        
    drawLegends: function(){
        // summary:
        //      Draws all legends added to this component.
        
        if(this._legendData){
        	for(var i=0; i<this._legendData.length; i++){
        	    if(typeof(this._legendData[i]) !== 'undefined' && typeof(this._legendData[i].value) !== 'undefined')
        	        this.drawLegend(this._legendData[i]);	
        	}
        }
    },
    
    legendsInsets: function() {
        // summary:
        //      Returns insets where legends will be placed.
        //
        // description:
        //      This function returns insets reserved for
        //      legends. Insets define space for top, left,
        //      bottom and right sides of the component.
        //
        //      If value is positive, extra space is reserved
        //      for the legend. Legend itself may make its own
        //      desisions but it should place itself to the
        //      corner.
        //
        //      If value is negative, legend should place itself
        //      inside the component depending on the inset value.
        //
        //      For now, just return zero insets and let childs
        //      spesify their own needs.
        return {top:0,left:0,bottom:0,right:0};
    },

    _setAlertLegendValue: function(arg){
        // summary:
        
        if(this._legendData){
            for(var i=0; i<this._legendData.length; i++){
                if(typeof(this._legendData[i]) !== 'undefined') {
                    if(this._legendData[i].type === 'alert')
                       this._legendData[i].value = arg;
                }
            }
        }
    },

    _setEscalationLegendValue: function(arg){
        // summary:
        
        if(this._legendData){
            for(var i=0; i<this._legendData.length; i++){
                if(typeof(this._legendData[i]) !== 'undefined') {
                    if(this._legendData[i].type === 'escalation')
                       this._legendData[i].value = arg;
                }
            }
        }
    },
    
    asParams: function(){
    	var paramObj = this.inherited(arguments);
    	if(this.eid) {
    		paramObj['eid'] = this.eid;
    	}
        paramObj['legends'] = this.asLegendsParams();
        paramObj['supportLegends'] = this.supportLegends;
    	return paramObj;
    }

});