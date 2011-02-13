dojo.provide("hyperic.tests.TestUtil");
dojo.require("hyperic.util.LayoutTestWindow");
dojo.require("hyperic.wallmount.LayoutUtil");

hyperic.tests.TestUtil.newLayoutTestWindow = function() {
	
	var templateString = dojo.cache("hyperic.tests","TestLayoutContent.html");

    var layout = hyperic.wallmount.LayoutUtil.getLayoutAsJSON();	
	
    var testWin = new hyperic.util.LayoutTestWindow({content:templateString, layoutJson:layout});
    testWin.open();
};