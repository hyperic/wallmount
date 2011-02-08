dojo.provide("hyperic.dnd.Source");

dojo.require("dojo.dnd.Source");
//dojo.require("hyperic.widget.Spinner");
//dojo.require("hyperic.widget.HorizontalArrowPipe");
//dojo.require("hyperic.widget.VerticalArrowPipe");
//dojo.require("hyperic.widget.Tank");
//dojo.require("hyperic.widget.ProgressTube");
//dojo.require("hyperic.widget.AvailIcon");
//dojo.require("hyperic.widget.AvailText");
//dojo.require("hyperic.widget.chart.Chart");
//dojo.require("hyperic.widget.EllipseLabel");
//dojo.require("hyperic.widget.label.Label");
//dojo.require("hyperic.widget.label.AvailabilityLabel");

dojo.declare("hyperic.dnd.Source",[dojo.dnd.Source],{
// summary:
//     Provides customized dnd source functionalities.

    registry:null,

    constructor: function(/*DOMNode|String*/node, /*dojo.dnd.__SourceArgs?*/params){
    	this.creator = this._nodeCreator;
    },
    
    setRegistry: function(r) {
    	this.registry = r;
    },
    
    replaceWidget:function(item, widget){
    	// summary:
    	//     xxx
        var parent = dojo.byId(item).parentNode;
    	dojo._destroyElement(dojo.byId(item));
    	
        dojo.require(widget);
        var clazz = dojo.getObject(widget);
        var w = new clazz();
        // telling widget who owns it. this way widget itself
        // is able to ask its replacement or removal.
        w.source = this;
        w._buildContextMenu();
        w.placeAt(parent);
        w.startup();
    },
    
    _nodeCreator:function(item){
        // summary:
        //      Handles node creation when item is either dropped
        //      or created programmatically to container.
        
        var s = hyperic.wallmount.base.metricStore;
        
        var node = dojo.create("div");
        node.id = dojo.dnd.getUniqueId();
        
        if(item === "DropMe") {
        	node.innerHTML = "Drop </br>Something"
        	return {node: node, data: item, type: ["text"]};
        }
        
        var w;
        if(item.type){
        	
        	var args = {};
        	if(item.size) {
                args['size'] = item.size;        		
        	} else {
                if(item.width) {
                    args['width'] = item.width;
                }
                if(item.height) {
                    args['height'] = item.height;
                }        		
        	}
            if(item.numOfArrows) {
                args['numOfArrows'] = item.numOfArrows;               
            }
            if(item.reverse) {
                args['reverse'] = item.reverse;               
            }   	
            if(item.arrowCount) {
                args['arrowCount'] = {value:item.numOfArrows};               
            }       
            if(item.arrowWidth) {
                args['arrowWidth'] = {value: item.arrowWidth};               
            }       
            if(item.color) {
                args['color'] = item.color;               
            }       
            if(item.format) {
                args['format'] = item.format;               
            }       
        	
        	dojo.require(item.type);
            var clazz = dojo.getObject(item.type);
            w = new clazz(args);
//            if(item.type === "label")
//                w = new hyperic.widget.label.Label({width:item.width, height:item.height});
//            else if(item.type === "spinner")
//                w = new hyperic.widget.Spinner({width:item.size, height:item.size, color: item.color, arrowCount:{value:item.numOfArrows},arrowWidth:{value: item.arrowWidth}, arrowHeadLength:10});
//            else if(item.type === "harrowpipe")
//                w = new hyperic.widget.HorizontalArrowPipe({width:item.width, height:item.height, arrowColor: item.arrowColor, numOfArrows:item.numOfArrows, reverse:item.reverse});
//            else if(item.type === "varrowpipe")
//                w = new hyperic.widget.VerticalArrowPipe({width:item.width, height:item.height, numOfArrows:item.numOfArrows, reverse:item.reverse});
//            else if(item.type === "tank")
//                w = new hyperic.widget.Tank({width:item.width, height:item.height, value:10, min:0, max:100, format:item.format});
//            else if(item.type === "chart")
//                w = new hyperic.widget.chart.Chart({width:item.width, height:item.height});
//            else if(item.type === "availability")
//                w = new hyperic.widget.AvailIcon({width:item.width, height:item.height});
//            else if(item.type === "availtext")
//                w = new hyperic.widget.AvailText({size:item.size});
//            else if(item.type === "ellipselabel")
//                w = new hyperic.widget.EllipseLabel({size:item.size});
//            else if(item.type === "progresstube")
//                w = new hyperic.widget.ProgressTube({width:item.width, height:item.height, format:item.format});
        } else {
            var clazz = dojo.getObject(this.registry.getDefaultPlugin());
            w = new clazz();
        }
        
        if(s) {
        	w.setStore(s);
        }
        
        if(item.metric){
        	w.setMetric(item.metric);
        }

        if(item.eid){
            w.setEid(item.eid);
        }

        if(item.title){
            w.setTitle(item.title);
        }
        
        w.source = this;
        w._buildContextMenu();
        w.placeAt(node);
        w.startup();
        return {node: node, data: item, type: ["text"]};
    }

});