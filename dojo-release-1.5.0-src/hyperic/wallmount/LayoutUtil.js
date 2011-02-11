dojo.provide("hyperic.wallmount.LayoutUtil");

dojo.require("hyperic.dialog.LoadLayoutDialog");

hyperic.wallmount.LayoutUtil.selectLayoutDialog = function() {
	console.log("selectLayoutDialog");
	if(!hyperic.wallmount.LayoutUtil.layoutDlg) {
        hyperic.wallmount.LayoutUtil.layoutDlg = new hyperic.dialog.LoadLayoutDialog({
            title: "Select Layout",
            layoutsUrl: "/dojo-release-1.5.0-src/hyperic/tests/layouts/layouts",
            widgetsInTemplate: true,
            style: "width: 300px"
        });		
	}
    hyperic.wallmount.LayoutUtil.layoutDlg.show();	
};

hyperic.wallmount.LayoutUtil.getLayoutAsJSON = function() {
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
		windowSettings['w'] = wn.offsetWidth;
        windowSettings['h'] = wn.offsetHeight;
        windowSettings['y'] = wn.offsetTop;
        windowSettings['x'] = wn.offsetLeft;
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
                
        windowNodeList.push(windowSettings);
	}
	
	layout['name'] = "fake name"
	layout['items'] = windowNodeList;
	var str = dojo.toJson(layout);
	console.log("Logging layout json");
    console.log(str);	
};

