dojo.provide("hyperic.wallmount.Designer");

dojo.require("hyperic.wallmount.WindowUtil");
dojo.require("hyperic.wallmount.LayoutUtil");
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
	
	// clear pane
//	hyperic.wallmount.Designer.closeAllWindows();

    var layoutInfo = dojo.byId("layoutinfo");
    layoutInfo.innerHTML = "Layout Name:[" + data.name + "]";
	
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
                title: witem.title,
                metric:witem.metric,
                eid:witem.eid,
                size:witem.size,
                format:witem.format,
                width:witem.width,
                height:witem.height,
                numOfArrows: witem.numOfArrows,
                arrowWidth: witem.arrowWidth,
                reverse: witem.reverse,
                color: witem.color,
                arrowColor: witem.arrowColor
                }]);            
        }
        
    }
	
};

hyperic.wallmount.Designer.closeAllWindows = function() {
    var windowQuery = 'div[id^="hyperic_layout_FloatingPane"]'
    dojo.query(windowQuery).forEach(
        function(item) {
            dijit.byId(item.id).close();
        }
    );
}