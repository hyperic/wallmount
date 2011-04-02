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

dojo.provide("hyperic.wallmount.Designer");

dojo.require("hyperic.wallmount.WindowUtil");
dojo.require("hyperic.wallmount.LayoutUtil");
dojo.require("hyperic.layout.LayoutName");
dojo.require("dijit.form.RadioButton");
dojo.require("dojox.widget.Toaster");
dojo.require("dojo.parser");

hyperic.wallmount.Designer.loadLayout = function(/*String*/url) {
    // summary:
    //
  
    hyperic.wallmount.Designer.closeAllWindows();
    
    dojo.xhrGet({
        url: url,
        handleAs: "json-comment-optional",
        timeout: 5000,
        preventCache: true,
        load: function(response, ioArgs) {
            hyperic.wallmount.Designer.createLayout(response);
            return response;
        },
        error: function(response, ioArgs) {
            alert('error ' + response);
            return response;
        }
    });
    
};

hyperic.wallmount.Designer.createLayout = function(data) {
	
    hyperic.wallmount.LayoutUtil.setLayoutName(data.name);
    
    var wallmountPane = dojo.byId('wallmountpane');
    dojo.style(wallmountPane,'width',data.w);
    dojo.style(wallmountPane,'height',data.h);
    
	
	// create new items
    var items = data.items;
    for(var i=0; i<items.length; i++) {
        var args = {
            x: items[i].x,
            y: items[i].y,
            w: items[i].w,
            h: items[i].h,
            title: items[i].title
        };
        
        var source;
        if(items[i].type === "single"){
            source = hyperic.wallmount.WindowUtil.newItemFloater(args);          
        } else {
            source = hyperic.wallmount.WindowUtil.newWindow(args);          
        }
        
        for(var j = 0; j<items[i].items.length; j++){
            var witem = items[i].items[j];
            source.insertNodes(false, [{
                type:witem.type,
                titlePosition: witem.titlePosition,
                title: witem.title,
                mid:witem.mid,
                eid:witem.eid,
                size:witem.size,
                format:witem.format,
                width:witem.width,
                height:witem.height,
                arrowCount: witem.arrowCount,
                arrowWidth: witem.arrowWidth,
                arrowGap: witem.arrowGap,
                arrowHeadLength: witem.arrowHeadLength,
                arrowWidth: witem.arrowWidth,
                reverse: witem.reverse,
                color: witem.color,
                arrowColor: witem.arrowColor,
                labelColor: witem.labelColor,
                minRange: witem.minRange,
                maxRange: witem.maxRange,
                speedTime: witem.speedTime,
                ranges: witem.ranges,
                legends: witem.legends,
                emptyColor: witem.emptyColor,
                fullColor: witem.fullColor,
                lowRange: witem.lowRange,
                highRange: witem.highRange,
                supportLegends: witem.supportLegends,
                chartType: witem.chartType,
                chartTheme: witem.chartTheme,
                chartTimeScale: witem.chartTimeScale,
                chartColors: witem.chartColors
                }]);            
        }
        
    }
	
};

hyperic.wallmount.Designer.closeAllWindows = function() {
    var windowQuery = 'div[id^="hyperic_layout_FloatingPane"]'
    var floaterQuery = 'div[id^="hyperic_layout_MoveablePane"]'
    dojo.query(windowQuery).forEach(
        function(item) {
            dijit.byId(item.id).close();
        }
    );
    dojo.query(floaterQuery).forEach(
        function(item) {
            dijit.byId(item.id).close();
        }
    );
};

hyperic.wallmount.Designer.sendUserMessage = function(message, level) {
	var type = level || "message"
	dojo.publish("userMessageTopic", [{message:message, type:type}] );
};
