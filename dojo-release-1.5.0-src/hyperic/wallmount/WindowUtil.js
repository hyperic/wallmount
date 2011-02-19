dojo.provide("hyperic.wallmount.WindowUtil");

dojo.require("dojo.dnd.Moveable");
dojo.require("hyperic.layout.FloatingPane");
dojo.require("hyperic.util.LayoutTestWindow");

hyperic.wallmount.WindowUtil.newSingleItemFloater = function() {
    // summary:
    //     This function create a new special floater which is
    //     meant to contain only one item.
    var node = dojo.create("div", null, dojo.byId("wallmountpane"));
    var c = dojo.create("div", null, node);
    
    var c1 = new hyperic.dnd.SingleSource(c, {accept: ['treeNode','text']});
    c1.setRegistry(hyperic.wallmount.Registry.registry());
    dojo.addClass(c,"singlecontainer");
    
    c1.insertNodes(false, ["DropMe"]);

    var style = "position: absolute; " + 
        "top: 100px;" +
        "left: 100px;";   
        
    var tmp = new hyperic.layout.MoveablePane({style:style},node);
    return c1;
};

hyperic.wallmount.WindowUtil.newItemFloater = function(args) {
	
    var x = (args && args.x) ? args.x : 10;
    var y = (args && args.y) ? args.y : 10;
    var style = "position: absolute; " + 
        "top: " + y + "px;" +
        "left: " + x + "px;";   
	
    var node = dojo.create("div", null, dojo.byId("wallmountpane"));
    var c = dojo.create("div", null, node);
    
    var source = new hyperic.dnd.SingleSource(c, {accept: ['treeNode','text']});
    dojo.addClass(c,"singlecontainer");
        
    var tmp = new hyperic.layout.MoveablePane({
    	style: style
    },node);
    return source;
    
};

hyperic.wallmount.WindowUtil.newEmptyWindow = function() {
    // summary:
    //      Just a wrapper function to pass no content
    //      resulting empty window.
	hyperic.wallmount.WindowUtil.newWindow({});
};

hyperic.wallmount.WindowUtil.newWindow = function(/*Object*/params) {
    // summary:
    
    var args = params || {};
	
    var w = (typeof args.w != 'undefined') ? args.w : 300;
    var h = (typeof args.h != 'undefined') ? args.h : 400;
    var x = (typeof args.x != 'undefined') ? args.x : 10;
    var y = (typeof args.y != 'undefined') ? args.y : 10;
    var title = (args && args.title) ? args.title : "New Window";
   	
   	var style = "position: absolute; " + 
        "width: " + w + "px;" +
        "height: " + h + "px;" +
        "top: " + y + "px;" +
        "left: " + x + "px;"; 	
   	
	var node = dojo.create("div", null, dojo.byId("wallmountpane"));
    var c = dojo.create("div", null, node);
    var source = new hyperic.dnd.Source(c, {accept: ['treeNode','text']});
    
    source.setRegistry(hyperic.wallmount.Registry.registry());
    
    dojo.addClass(c,"container");
        
    var pane = new hyperic.layout.FloatingPane({
        title: title,
        maxable: false,
        closable: true,
        resizable: true,
        style: style
        },node);
    pane.startup();
    pane.bringToTop();
	return source;
};

hyperic.wallmount.WindowUtil.newLayoutTestWindow = function() {
	var testWin = new hyperic.util.LayoutTestWindow();
	testWin.open();
};