dojo.provide("hyperic.wallmount.LayoutUtil");

dojo.require("hyperic.dialog.LoadLayoutDialog");
dojo.require("hyperic.dialog.SaveLayoutDialog");
dojo.require("hyperic.dialog.DashboardSizeDialog");

hyperic.wallmount.LayoutUtil.saveLayoutDialog = function() {
    if(!hyperic.wallmount.LayoutUtil.saveLayoutDlg) {
        hyperic.wallmount.LayoutUtil.saveLayoutDlg = new hyperic.dialog.SaveLayoutDialog({
            title: "Save Layout",
            widgetsInTemplate: true,
            style: "width: 300px"
        });     
    }
    hyperic.wallmount.LayoutUtil.saveLayoutDlg.show();  
};

hyperic.wallmount.LayoutUtil.saveLayout = function(name) {
    hyperic.wallmount.LayoutUtil.setLayoutName(name);
    var data = hyperic.wallmount.LayoutUtil.getLayoutAsJSON();
    var contentObject = {};
    contentObject['layoutdata'] = data;
    contentObject['layoutname'] = name;
    dojo.xhrPost({
        url: '/hqu/wallmount/wallmount/saveLayout.hqu',
        handleAs: "json-comment-filtered",
        timeout: 5000,
        content: contentObject,
        load: function(response, ioArgs) {
            return response;
        },
        error: function(response, ioArgs) {
            alert('error ' + response);
            return response;
        }
    });
};

hyperic.wallmount.LayoutUtil.selectLayoutDialog = function() {
	console.log("selectLayoutDialog");
	if(!hyperic.wallmount.LayoutUtil.layoutDlg) {
        hyperic.wallmount.LayoutUtil.layoutDlg = new hyperic.dialog.LoadLayoutDialog({
            title: "Select Layout",
            layoutsUrl: "/hqu/wallmount/wallmount/getLayouts.hqu",
            widgetsInTemplate: true,
            style: "width: 300px"
        });		
	}
    hyperic.wallmount.LayoutUtil.layoutDlg.show();	
};

hyperic.wallmount.LayoutUtil.dashboardSizeDialog = function() {
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
	var layoutInfo = dojo.byId("layoutinfo");
    layoutInfo.innerHTML = "Layout Name:[" + name + "]";
};

hyperic.wallmount.LayoutUtil.getLayoutAsJSONObj = function() {
	// summary:
	//     Builds a json representation of current layout in designer.
	
    var layout = {}; // main json object

    // this finds all multi item floating windows	
	var windowQuery = 'div[id^="hyperic_layout_FloatingPane"]'	
	var windowNodes = dojo.query(windowQuery);
	
	var windowNodeList = [];
	
	for(var i = 0; i < windowNodes.length; i++){
		var wn = windowNodes[i];
		var entriesList = []; 
		var windowSettings = {};
		// it seems that when we set width and height from json,
		// actual offset is +6 for width and +4 for height.
		// for now just substract it.
		// TODO: check how to calculate offset accurately
		windowSettings['w'] = wn.offsetWidth - 6;
        windowSettings['h'] = wn.offsetHeight - 4;
        windowSettings['y'] = wn.offsetTop;
        windowSettings['x'] = wn.offsetLeft;
        windowSettings['type'] = "multi";
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
    var wallmountPane = dojo.byId('layoutinfo');
    var layoutInfoContent = wallmountPane.innerHTML;
    var start = layoutInfoContent.indexOf('[');
    var end = layoutInfoContent.indexOf(']');
	layout['name'] = layoutInfoContent.substring(start+1,end);

    // get layout size
    var wallmountPane = dojo.byId('wallmountpane');
    var lW = dojo.style(wallmountPane,'width');
    var lH = dojo.style(wallmountPane,'height');
    layout['w'] = lW;
    layout['h'] = lH;
	
	layout['items'] = windowNodeList;
//	var str = dojo.toJson(layout);
//	console.log("Logging layout json");
//    console.log(str);
    return layout;
};

hyperic.wallmount.LayoutUtil.getLayoutAsJSON = function() {
	var obj = hyperic.wallmount.LayoutUtil.getLayoutAsJSONObj();
	console.log(dojo.toJson(obj));
	return dojo.toJson(obj);
};

