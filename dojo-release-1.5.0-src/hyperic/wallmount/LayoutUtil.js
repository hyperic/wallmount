dojo.provide("hyperic.wallmount.LayoutUtil");

dojo.require("hyperic.dialog.LoadLayoutDialog");
dojo.require("hyperic.dialog.SaveLayoutDialog");
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
	//     Saves current layout if name is already knows.
	//     If layout name is not knows, forwards user to
	//     layout name selection dialog.
	
	var lName = hyperic.wallmount.LayoutUtil.getLayoutName();
	if(lName.length > 0) {
		hyperic.wallmount.LayoutUtil.saveLayout(lName)
	} else {
		hyperic.wallmount.LayoutUtil.saveLayoutDialog();
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
    dojo.xhrPost({
        url: '/hqu/wmvisualizer/wallmount/saveLayout.hqu',
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
};

hyperic.wallmount.LayoutUtil.selectLayoutDialog = function() {
    // summary:
    //     Opens a dialog to restore stored layout
    
	if(!hyperic.wallmount.LayoutUtil.layoutDlg) {
        hyperic.wallmount.LayoutUtil.layoutDlg = new hyperic.dialog.LoadLayoutDialog({
            title: "Select Layout",
            layoutsUrl: "/hqu/wmvisualizer/wallmount/getLayouts.hqu",
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

hyperic.wallmount.LayoutUtil.getLayoutAsJSONObj = function() {
	// summary:
	//     Builds a json representation of current layout.
	
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
    layout['name'] = hyperic.wallmount.LayoutUtil.getLayoutName();
  
    // get layout size
    var wallmountPane = dojo.byId('wallmountpane');
    var lW = dojo.style(wallmountPane,'width');
    var lH = dojo.style(wallmountPane,'height');
    layout['w'] = lW;
    layout['h'] = lH;
	
	layout['items'] = windowNodeList;
    return layout;
};

hyperic.wallmount.LayoutUtil.getLayoutAsJSON = function() {
	// summary:
	//     Returns current layout as JSON string
	
	var obj = hyperic.wallmount.LayoutUtil.getLayoutAsJSONObj();
	return dojo.toJson(obj);
};

