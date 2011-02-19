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
    	var obj = dijit.byId(item);
    	var _title = obj.getTitle();
    	var _eid = obj.eid;	
        var _subscribeId = obj.subscribeId; 
    	
        var parent = dojo.byId(item).parentNode;
    	dojo._destroyElement(dojo.byId(item));
    	
        dojo.require(widget);
        var clazz = dojo.getObject(widget);
        var props = this.registry.getPluginProperties(widget);
        var w = new clazz(props);
        // telling widget who owns it. this way widget itself
        // is able to ask its replacement or removal.
        
        w.setTitle(_title);
        w.subscribeId = _subscribeId;
        w.eid = _eid;
        
        w.source = this;
        w._buildContextMenu();
        w.placeAt(parent);
        w.startup();
    },
    
    _nodeCreator:function(item_in,hint){
        // summary:
        //      Handles node creation when item is either dropped
        //      or created programmatically to container.
        
        // TODO: redesign this creator when all needed functionalities are in place

        var node = dojo.create("div");
        node.id = dojo.dnd.getUniqueId();
        
        // hard code empty floater initial content
        if(item_in === "DropMe") {
            node.innerHTML = "Drop </br>Something"
            return {node: node, data: item, type: ["text"]};
        }
        
        var _item = item_in.item || item_in;

        // need to create a copy. otherwise added wmwidget is saved to
        // object which is passed forward. (makes a wrong reference later)        
        var item = dojo.mixin({}, _item);
        
        var s = hyperic.wallmount.base.metricStore;
        
        
        
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
            if(item.arrowCount) {
                args['arrowCount'] = item.arrowCount;               
            }
            if(item.reverse) {
                args['reverse'] = item.reverse;               
            }   	
            if(item.arrowGap) {
                args['arrowGap'] = item.arrowGap;               
            }       
            if(item.arrowWidth) {
                args['arrowWidth'] = item.arrowWidth;               
            }       
            if(item.arrowHeadLength) {
                args['arrowHeadLength'] = item.arrowHeadLength;               
            }       
            if(item.color) {
                args['color'] = item.color;               
            }       
            if(item.format) {
                args['format'] = item.format;               
            }       
            if(item.labelColor) {
                args['labelColor'] = item.labelColor;               
            }       
        	
        	dojo.require(item.type);
            var clazz = dojo.getObject(item.type);
            w = new clazz(args);
        } else {
        	var _pluginName = this.registry.getPluginName(item);
        	dojo.require(_pluginName);
            var clazz = dojo.getObject(_pluginName);
            
            // check if passed item contains reference to widget.
            // this means we're moving something and we should
            // copy the settings instead defaults from registry.
            var props;
            if(item.wmwidget) {
            	props = item.wmwidget.asParams(); 
            } else {
                props = this.registry.getPluginProperties(_pluginName);            
            }
            w = new clazz(props);                           
        }
        
        if(s) {
        	w.setStore(s);
        }
        
        if(item.mid){
        	w.setMetric(item.mid);
        }

        if(item.eid){
            w.setEid(item.eid);
        }

        // TODO: this title stuff is too complex like this, redesign...
        var title = w.getTitle() || item.name || item.title;
        if(title && title.length > 0){
            w.setTitle(title);
        }
        
        w.source = this;
        w._buildContextMenu();
        w.placeAt(node);
        w.startup();
        // testing if we can store widget to data
        // it may be passed through dnd operations!!!
        item['wmwidget'] = w;
        return {node: node, data: item, type: ["text"]};
    }

});