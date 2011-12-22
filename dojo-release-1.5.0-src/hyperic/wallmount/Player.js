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

dojo.provide("hyperic.wallmount.Player");

dojo.require("hyperic.wallmount.WindowUtil");
dojo.require("hyperic.data.MetricStore");

hyperic.wallmount.Player.loadLayout = function(/*String*/url, /*Boolean*/ sendAnim, /*String*/node) {
    // summary:
    //
	
    dojo.xhrGet({
        url: url,
        handleAs: "json-comment-optional",
        timeout: 5000,
        preventCache: true,
        load: function(response, ioArgs) {
            hyperic.wallmount.Player.createLayout(response, node);
            if(sendAnim)
                dojo.publish("/hyperic/anim/start", [this]);
            return response;
        },
        error: function(response, ioArgs) {
            alert('error ' + response);
            return response;
        }
    });
	
};

hyperic.wallmount.Player.loadLayouts = function(/*Array*/urls, /*Boolean*/ sendAnim) {
	for (var i=0; i<urls.length; i++) {
		var node = 'wallmountpane' + i;
		hyperic.wallmount.Player.loadLayout(urls[i], sendAnim, node);
	}
};

hyperic.wallmount.Player.useLayout = function(/*String*/json, /*Boolean*/ sendAnim) {
    hyperic.wallmount.Player.createLayout(json);
    if(sendAnim) dojo.publish("/hyperic/anim/start", [this]);	
};

hyperic.wallmount.Player.createLayout = function(/*jsondata*/data, /*String*/node) {
	// summary:
	//
	//
	// data:
	//     Layout data in json format
	//
	// node:
	//     Node where layout items are created. If doesn't exist,
	//     node is created to root level.
	
	if(data.theme) hyperic.wallmount.LayoutUtil.changeCSSTheme(data.theme);
	
	
	var wallmountPane = hyperic.wallmount.WindowUtil.getWallmountPane(node);
	
	// if size is not in layout, just make it big enough
    dojo.style(wallmountPane,'width',data.w||9999);
    dojo.style(wallmountPane,'height',data.h||9999);
	
    var items = data.items;
    for(var i=0; i<items.length; i++) {
    	var args = {
    		x: items[i].x,
            y: items[i].y,
            w: items[i].w,
            h: items[i].h,
            title: items[i].title
    	};

        if(items[i].type === "table"){
        	var rows = items[i].table.cells.length;
        	var cols = items[i].table.cells[0].length;
        	var sources = hyperic.wallmount.WindowUtil.newTableWindow(dojo.mixin({rows:rows,cols:cols},args), wallmountPane);
        	
        	for(var rr=0;rr<rows;rr++) {
            	for(var cc=0;cc<cols;cc++) {

                    for(var j = 0; j<items[i].table.cells[rr][cc].items.length; j++){
                        var witem = items[i].table.cells[rr][cc].items[j];
                          sources[rr][cc].insertNodes(false, [witem]);
                    }        	
            		
            	}
        	}
        	
        	
        } else {
            var source;
            if(items[i].type === "single"){
                source = hyperic.wallmount.WindowUtil.newItemFloater(args);          
            } else {
                source = hyperic.wallmount.WindowUtil.newWindow(args, wallmountPane);          
            }
            
            for(var j = 0; j<items[i].items.length; j++){
                var witem = items[i].items[j];
                  source.insertNodes(false, [witem]);
            }        	
        }

    }
};