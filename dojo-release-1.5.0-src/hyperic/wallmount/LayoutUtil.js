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

dojo.provide("hyperic.wallmount.LayoutUtil");

dojo.require("hyperic.dialog.LoadLayoutDialog");
dojo.require("hyperic.dialog.SaveLayoutDialog");
dojo.require("hyperic.dialog.SaveMultiLayoutDialog");
dojo.require("hyperic.dialog.DashboardSizeDialog");
dojo.require("hyperic.wallmount.Designer");

hyperic.wallmount.LayoutUtil.saveLayoutDialog = function() {
	// summary:
	//     Opens dialog used to ask name for layout to be saved
	
    if(!hyperic.wallmount.LayoutUtil.saveLayoutDlg) {
        hyperic.wallmount.LayoutUtil.saveLayoutDlg = new hyperic.dialog.SaveLayoutDialog({
            title: "Save Layout",
            widgetsInTemplate: true,
            style: "width: 300px"
        });     
    }
    hyperic.wallmount.LayoutUtil.saveLayoutDlg.show();  
};

hyperic.wallmount.LayoutUtil.saveCurrentLayout = function() {
	// summary:
	//     Saves current layout
	//
	// description:
	//     Saves current multi layout if name is already knows.
	//     If layout name is not knows, forwards user to
	//     layout name selection dialog.
	
	var lName = hyperic.wallmount.LayoutUtil.getLayoutName();
	if(lName.length > 0) {
		hyperic.wallmount.LayoutUtil.saveLayout(lName)
	} else {
		hyperic.wallmount.LayoutUtil.saveLayoutDialog();
	}
};

hyperic.wallmount.LayoutUtil.saveMultiLayoutDialog = function() {
	// summary:
	//     Opens dialog used to ask name for multi layout to be saved
	
    if(!hyperic.wallmount.LayoutUtil.saveMultiLayoutDlg) {
        hyperic.wallmount.LayoutUtil.saveMultiLayoutDlg = new hyperic.dialog.SaveMultiLayoutDialog({
            title: "Save Multi-layout",
            widgetsInTemplate: true,
            style: "width: 300px"
        });     
    }
    hyperic.wallmount.LayoutUtil.saveMultiLayoutDlg.show();  
};

hyperic.wallmount.LayoutUtil.saveCurrentMultiLayout = function() {
	// summary:
	//     Saves current layout
	//
	// description:
	//     Saves current layout if name is already knows.
	//     If layout name is not knows, forwards user to
	//     layout name selection dialog.
	
	var lName = hyperic.wallmount.LayoutUtil.getLayoutName();
	if(lName.length > 0) {
		hyperic.wallmount.LayoutUtil.saveMultiLayout(lName)
	} else {
		hyperic.wallmount.LayoutUtil.saveMultiLayoutDialog();
	}
};

hyperic.wallmount.LayoutUtil.saveLayout = function(name) {
	// summary:
	//     Method to do layout saving to HQU backend
	//
	// description:
	//     This method gets current layout as JSON and posts
	//     it to HQU backend. Status of saving action is posted
	//     to internal message bus.
    
    var dataObj = hyperic.wallmount.LayoutUtil.getLayoutAsJSONObj();
    
    // if this is a first time layout is to be saved or user
    // wants to save current restored layout with different name
    // the actual JSON data contains a wrong name.
    // update it with name given as parameter to this function.
    dataObj.name = name;
    
    var data = dojo.toJson(dataObj);
    
    var contentObject = {};
    contentObject['layoutdata'] = data;
    contentObject['layoutname'] = name;
        
    dojo.xhrGet({
        url: '/hqu/wmvisualizer/wmvisualizer/encodeUrl.hqu',
        handleAs: "json-comment-filtered",
        timeout: 5000,
        content: {action:'saveLayout'},
        load: function(response, ioArgs) {        	
            dojo.xhrPost({
                url: '/'+response.url,
                handleAs: "json-comment-filtered",
                timeout: 5000,
                content: contentObject,
                load: function(response, ioArgs) {
                	hyperic.wallmount.LayoutUtil.setLayoutName(name);
                    hyperic.wallmount.Designer.sendUserMessage("Succesfully saved layout with name " + name);
                    return response;
                },
                error: function(response, ioArgs) {
                    hyperic.wallmount.Designer.sendUserMessage("Error saving layout.", "error");
                    return response;
                }
            });        	
        },
        error: function(response, ioArgs) {
            hyperic.wallmount.Designer.sendUserMessage("Error saving layout.", "error");
            return response;
        }
    });
};

hyperic.wallmount.LayoutUtil.saveMultiLayout = function(name) {
	// summary:
	//     Method to do layout saving to HQU backend
	//
	// description:
	//     This method gets current layout as JSON and posts
	//     it to HQU backend. Status of saving action is posted
	//     to internal message bus.
    
    var dataObj = hyperic.wallmount.LayoutUtil.getMultiLayoutAsJSONObj();
    
    // if this is a first time layout is to be saved or user
    // wants to save current restored layout with different name
    // the actual JSON data contains a wrong name.
    // update it with name given as parameter to this function.
    dataObj.name = name;
    
    var data = dojo.toJson(dataObj);
    
    var contentObject = {};
    contentObject['layoutdata'] = data;
    contentObject['layoutname'] = name;
        
    dojo.xhrGet({
        url: '/hqu/wmvisualizer/wmvisualizer/encodeUrl.hqu',
        handleAs: "json-comment-filtered",
        timeout: 5000,
        content: {action:'saveMultiLayout'},
        load: function(response, ioArgs) {        	
            dojo.xhrPost({
                url: '/'+response.url,
                handleAs: "json-comment-filtered",
                timeout: 5000,
                content: contentObject,
                load: function(response, ioArgs) {
                	hyperic.wallmount.LayoutUtil.setMultiLayoutName(name);
                    hyperic.wallmount.Designer.sendUserMessage("Succesfully saved layout with name " + name);
                    return response;
                },
                error: function(response, ioArgs) {
                    hyperic.wallmount.Designer.sendUserMessage("Error saving layout.", "error");
                    return response;
                }
            });        	
        },
        error: function(response, ioArgs) {
            hyperic.wallmount.Designer.sendUserMessage("Error saving layout.", "error");
            return response;
        }
    });
};

hyperic.wallmount.LayoutUtil.selectLayoutDialog = function() {
    // summary:
    //     Opens a dialog to restore stored layout
    
	if(!hyperic.wallmount.LayoutUtil.layoutDlg) {
        hyperic.wallmount.LayoutUtil.layoutDlg = new hyperic.dialog.LoadLayoutDialog({
            title: "Select Layout",
            layoutsUrl: "/hqu/wmvisualizer/wmvisualizer/getLayouts.hqu",
            widgetsInTemplate: true,
            style: "width: 300px"
        });		
	}
    hyperic.wallmount.LayoutUtil.layoutDlg.show();	
};

hyperic.wallmount.LayoutUtil.dashboardSizeDialog = function() {
	// summary:
	//     Opens a dialog to change dashboard size
	
    if(!hyperic.wallmount.LayoutUtil.dashboardSizeDlg) {
        hyperic.wallmount.LayoutUtil.dashboardSizeDlg = new hyperic.dialog.DashboardSizeDialog({
            title: "Change Dashboard Size",
            widgetsInTemplate: true,
            style: "width: 300px"
        });     
    }
    hyperic.wallmount.LayoutUtil.dashboardSizeDlg.show();  
};

hyperic.wallmount.LayoutUtil.setLayoutName = function(name) {
	// summary:
	//     Helper method to set current layout name in UI
	
	var layoutName = dijit.byId("layoutName");
	layoutName.setLayoutName(name);
};

hyperic.wallmount.LayoutUtil.getLayoutName = function() {
    // summary:
    //     Helper method to get current used layout name
    
    var layoutName = dijit.byId("layoutName");
    return layoutName.getLayoutName();
};

hyperic.wallmount.LayoutUtil.setThemeName = function(name) {
	// summary:
	//     Helper method to set current layout theme in UI
	
	var layoutName = dijit.byId("layoutName");
	layoutName.setThemeName(name);
};

hyperic.wallmount.LayoutUtil.getThemeName = function() {
    // summary:
    //     Helper method to get current used layout theme
    
    var layoutName = dijit.byId("layoutName");
    return layoutName.getThemeName();
};

hyperic.wallmount.LayoutUtil.getLayoutAsJSONObj = function() {
	// summary:
	//     Builds a json representation of current layout.
	
    var layout = {}; // main json object

    // this finds all multi item floating windows	
	var windowQuery = 'div[id^="hyperic_layout_FloatingPane"]'	
	var windowNodes = dojo.query(windowQuery);
	
	var windowNodeList = [];
	
	// need this to tweak window size
	// XXX: this is a temporary hack
	var themeName = hyperic.wallmount.LayoutUtil.getThemeName();
	var ow = 6, oh = 4;
	if(themeName == "Matrix") {
		ow = 24;
		oh = 16;
	}
	
	for(var i = 0; i < windowNodes.length; i++){
		var wn = windowNodes[i];
		var entriesList = []; 
		var windowSettings = {};
		// it seems that when we set width and height from json,
		// actual offset is +6 for width and +4 for height.
		// for now just substract it.
		// TODO: check how to calculate offset accurately
		windowSettings['w'] = wn.offsetWidth - ow;
        windowSettings['h'] = wn.offsetHeight - oh;
        windowSettings['y'] = wn.offsetTop;
        windowSettings['x'] = wn.offsetLeft;
        windowSettings['title'] = dijit.byId(wn.id).title;
        
        // if we find table rows (tableRows is not empty list),
        // type of this window is table
        var tableRowsQuery = 'div#' + wn.id + ' table.hypericDndTable >';
        var tableRows = dojo.query(tableRowsQuery);
  
        if(tableRows.length > 0) {
            windowSettings['type'] = "table";
            var table = {};
            var cells = [];
        	for(var tr = 0; tr < tableRows.length; tr++) {
                var row = [];
                var tableRowColsQuery = 'tr#' + tableRows[tr].id + ' >';
                var tableRowCols = dojo.query(tableRowColsQuery);
        		for(var td = 0; td < tableRowCols.length; td++) {
                    var dnds = dojo.query('td#' + tableRowCols[td].id + ' div.dojoDndItem >');
                    var items = []
                    for(var j = 0; j < dnds.length; j++){
                        var wmObj = dijit.byId(dnds[j].id);
                        items.push(wmObj.asJSON());
                    }          
                    var col = {items:items};
        			row.push(col);
        		}
        		cells.push(row);
        	}
            table['cells'] = cells;
            windowSettings['table'] = table;             
        } else {
            windowSettings['type'] = "multi";
            var items = []
          
            // this should find only child of dnd item.
            // this child is supposed to be wallmount component
            var wallmountItemInWindowQuery = 'div#' + wn.id + ' div.dojoDndItem >';	
            var dnds = dojo.query(wallmountItemInWindowQuery);
            for(var j = 0; j < dnds.length; j++){
                var wmObj = dijit.byId(dnds[j].id);
                items.push(wmObj.asJSON());
            }          
            windowSettings['items'] = items;
        }
                
        windowNodeList.push(windowSettings);
	}
	
	var floaterQuery = 'div[id^="hyperic_layout_MoveablePane"]'  
    var floaterNodes = dojo.query(floaterQuery);
    for(var i = 0; i < floaterNodes.length; i++){
        var wn = floaterNodes[i];
        var entriesList = []; 
        var windowSettings = {}; 
        windowSettings['w'] = wn.offsetWidth;
        windowSettings['h'] = wn.offsetHeight;
        windowSettings['y'] = wn.offsetTop;
        windowSettings['x'] = wn.offsetLeft;
        windowSettings['type'] = "single";
        windowSettings['title'] = dijit.byId(wn.id).title;
        
        var items = []
        
        // this should find only child of dnd item.
        // this child is supposed to be wallmount component
        var wallmountItemInWindowQuery = 'div#' + wn.id + ' div.dojoDndItem >';
        var dnds = dojo.query(wallmountItemInWindowQuery);
        for(var j = 0; j < dnds.length; j++){
            var wmObj = dijit.byId(dnds[j].id);
            items.push(wmObj.asJSON());
        }
        
        windowSettings['items'] = items;
        windowNodeList.push(windowSettings);    	
    }
	
	// get layout name
    layout['name'] = hyperic.wallmount.LayoutUtil.getLayoutName();
    layout['theme'] = hyperic.wallmount.LayoutUtil.getThemeName();
  
    // get layout size
    var wallmountPane = dojo.byId('wallmountpane');
    var lW = dojo.style(wallmountPane,'width');
    var lH = dojo.style(wallmountPane,'height');
    layout['w'] = lW;
    layout['h'] = lH;
	
	layout['items'] = windowNodeList;
    return layout;
};

hyperic.wallmount.LayoutUtil.getMultiLayoutAsJSONObj = function() {
	// summary:
	//     Builds a json representation of current multi layout.
	
    var layout = {}; // main json object

    layout['name'] = hyperic.wallmount.LayoutUtil.getLayoutName();
    
    layout['transition'] = dijit.byId("transition").get('value');
    layout['duration'] = dijit.byId("duration").get('value');

	var layoutNodeList = [];
    dojo.forEach(targetlayouts.getAllNodes(), function(entry, i){
    	  layoutNodeList.push({name:entry.innerHTML});
    });
	layout['layouts'] = layoutNodeList;
	
    return layout;
};

hyperic.wallmount.LayoutUtil.getLayoutAsJSON = function() {
	// summary:
	//     Returns current layout as JSON string
	
	var obj = hyperic.wallmount.LayoutUtil.getLayoutAsJSONObj();
	return dojo.toJson(obj);
};

hyperic.wallmount.LayoutUtil.getMultiLayoutAsJSON = function() {
	// summary:
	//     Returns current multi layout as JSON string
	
	var obj = hyperic.wallmount.LayoutUtil.getMultiLayoutAsJSONObj();
	return dojo.toJson(obj);
};

hyperic.wallmount.LayoutUtil.setCSSTheme = function(/*css stylesheet name*/theme) {
	// summary:
	//     Changing css theme. This method also sets theme name in ui
	var ok = hyperic.wallmount.LayoutUtil.changeCSSTheme(theme);
	if(ok) {
		hyperic.wallmount.LayoutUtil.setThemeName(theme);
	} else {
		// set default name if we were unable to set the theme
		hyperic.wallmount.LayoutUtil.setThemeName("Basic");
	}
};

hyperic.wallmount.LayoutUtil.changeCSSTheme = function(/*css stylesheet name*/theme) {
	// summary:
	//     Changing css linked stylesheet to active

	var found = false;
    var linkTags = document.getElementsByTagName("link");
    for (var i = 0; i < linkTags.length; i++) {
        if ((linkTags[i].rel.indexOf("stylesheet") != -1) && linkTags[i].title) {
        	linkTags[i].disabled = true;
            if (linkTags[i].title == theme) {
            	linkTags[i].disabled = false;
            	found = true;
            }
	    }
	}
    return found;
};
