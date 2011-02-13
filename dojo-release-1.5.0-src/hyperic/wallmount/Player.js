dojo.provide("hyperic.wallmount.Player");

dojo.require("hyperic.wallmount.WindowUtil");

hyperic.wallmount.Player.loadLayout = function(/*String*/url, /*Boolean*/ sendAnim) {
    // summary:
    //
	
    dojo.xhrGet({
        url: url,
        handleAs: "json-comment-optional",
        timeout: 5000,
        preventCache: true,
        load: function(response, ioArgs) {
            hyperic.wallmount.Player.createLayout(response);
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

hyperic.wallmount.Player.useLayout = function(/*String*/json, /*Boolean*/ sendAnim) {
    hyperic.wallmount.Player.createLayout(json);
    if(sendAnim) dojo.publish("/hyperic/anim/start", [this]);	
};

hyperic.wallmount.Player.createLayout = function(/*jsondata*/data) {
	// summary:
	//
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
            	mid:witem.mid,
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