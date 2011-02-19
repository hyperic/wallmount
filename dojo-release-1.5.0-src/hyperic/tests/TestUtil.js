dojo.provide("hyperic.tests.TestUtil");
dojo.require("hyperic.util.LayoutTestWindow");
dojo.require("hyperic.wallmount.LayoutUtil");

hyperic.tests.TestUtil.newLayoutTestWindow = function() {
	
	var templateString = dojo.cache("hyperic.tests","TestLayoutContent.html");

    var layoutObj = hyperic.wallmount.LayoutUtil.getLayoutAsJSONObj();	
	var layout = dojo.toJson(layoutObj);
	
    var testWin = new hyperic.util.LayoutTestWindow({content:templateString, layoutJson:layout, w:layoutObj.w, h:layoutObj.h});
    testWin.open();
};