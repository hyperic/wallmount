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

dojo.provide("hyperic.util.FontUtil");

dojo.require("dojox.gfx");
dojo.require("dojox.collections.Dictionary");
dojo.require("dojo.number");

// we have bounding box - width and height. given label
// is fitted to the box.
// for now there's only one font to use.
// create a lookup table for bounding box
// label:size width:50, height:60 > 8-50-60
// we approximate label width by using capital X
// which should give maximum font size.

(function(){
	
	// caching storage
    var dictionary = new dojox.collections.Dictionary();

    // TODO: add caching, don't want to create offline div everytime
    hyperic.util.FontUtil.findGoodSizeFontByRect = function(label,width,height) {
        // summary:
	    //     Calculate best match for font size within rectangle.
	    //
	    // label:
	    //     String (label) used to determine the best font size
	    // width:
	    //     Width of the are where label should be fitted
	    // height:
        //     Height of the are where label should be fitted
        //
	    // description:
	    //     This function gets string, width and height as parameters.
	    //     Based on the values, best match for font size is calculated.
	
	    var dkey = label.length + '-' + Math.round(width) + '-' + Math.round(height);
	    var dval = dictionary.item(dkey);
	    if(!dval){
    	    var size = 100;
    	    var box = hyperic.util.FontUtil.getTextBox(label,{fontFamily:"Helvetica",fontSize:size,fontWeight:"bold"});
	
            var rW = width/box.w;
            var rH = height/box.h;
 
            var scale = Math.min(rW,rH);
            var newBaseSize = size*scale;
            // scaling font size lineary doesn't give accurate results.
            // so just take 5% of from the estimated font size
            dval = dojo.number.round(newBaseSize - newBaseSize*0.05);
            dictionary.add(dkey, dval);
            // XXX: we might need to adjust font on IE even more down
        }
        return dval;
    };

    hyperic.util.FontUtil.findGoodSizeFontByCircle = function(label,radius) {
        // summary:
        //     Calculate best match for font size withing circle.
        //
        // label:
        //     String (label) used to determine the best font size
        // radius:
        //     Radius of the circle
        //
        // description:
        //     This function gets string and circle radius as parameters.
        //     Based on the values, best match for font size is calculated.
        //     We first find max rectange which fits within circle and then
        //     continue with findGoodSizeFontByRect().
        //
        //     There's no heavy calculation needed since this math is pretty
        //     static. We just do a quick approximation here; Max area within
        //     circle is a square, size of that square is rad*sqrt(2).
        var x = radius * Math.sqrt(2);
        return hyperic.util.FontUtil.findGoodSizeFontByRect(label,x,x);
    };
    
    var measuringNode = null, empty = {};
    hyperic.util.FontUtil.getTextBox = function(/*String*/ text,
                                                /*Object*/ style,
                                                /*String?*/ className){
    	// description:
    	//     This function is copied from dojox.gfx._base._getTextBox.
    	//     There's a change that requests to that function, if done
    	//     from multiple places will cause wrong results.
    	//     e.g. at some point Chrome started to get wrong results.
        var m, s, al = arguments.length;
        if(!measuringNode){
            m = measuringNode = dojo.doc.createElement("div");
            s = m.style;
            s.position = "absolute";
            s.left = "-10000px";
            s.top = "0";
            dojo.body().appendChild(m);
        }else{
            m = measuringNode;
            s = m.style;
        }
        // reset styles
        m.className = "";
        s.borderWidth = "0";
        s.margin = "0";
        s.padding = "0";
        s.outline = "0";
        // set new style
        if(al > 1 && style){
            for(var i in style){
                if(i in empty){ continue; }
                s[i] = style[i];
            }
        }
        // set classes
        if(al > 2 && className){
            m.className = className;
        }
        // take a measure
        m.innerHTML = text;

        if(m["getBoundingClientRect"]){
            var bcr = m.getBoundingClientRect();
            return {l: bcr.left, t: bcr.top, w: bcr.width || (bcr.right - bcr.left), h: bcr.height || (bcr.bottom - bcr.top)};
        }else{
            return dojo.marginBox(m);
        }
    };
    

})();
