/**
 * NOTE: This copyright does *not* cover user programs that use HQ
 * program services by normal system calls through the application
 * program interfaces provided as part of the Hyperic Plug-in Development
 * Kit or the Hyperic Client Development Kit - this is merely considered
 * normal use of the program, and does *not* fall under the heading of
 *  "derived work".
 *
 *  Copyright (C) [2011], VMware, Inc.
 *  This file is part of HQ.
 *
 *  HQ is free software; you can redistribute it and/or modify
 *  it under the terms version 2 of the GNU General Public License as
 *  published by the Free Software Foundation. This program is distributed
 *  in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 *  even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 *  PARTICULAR PURPOSE. See the GNU General Public License for more
 *  details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 *  USA.
 *
 */

dojo.provide("hyperic.dnd.Source");

dojo.require("dojo.dnd.Source");

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
        var _titlePosition = obj.getTitlePosition();
    	var _eid = obj.eid;	
        var _subscribeId = obj.subscribeId; 
        var _format = obj.format; 
    	
        var parent = dojo.byId(item).parentNode;
    	dojo._destroyElement(dojo.byId(item));
    	
    	// dojo.require(...) brakes the build system
    	// because "widget" is not found
        dojo["require"](widget);
        var clazz = dojo.getObject(widget);
        var props = this.registry.getPluginProperties(widget);
        var w = new clazz(props);
        // telling widget who owns it. this way widget itself
        // is able to ask its replacement or removal.
        
        w.setTitle(_title);
        w._setTitlePositionAttr(_titlePosition);
        w.subscribeId = _subscribeId;
        w.eid = _eid;
        w.format = _format;
        
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
        
        var w;
        if(item.type){
        	// here if new component created from layout
        	
        	dojo["require"](item.type);
        	
            var internalProps = this.registry.getPluginInternal(item.type);
            var clazz = dojo.getObject(item.type);

            // copy parameters and remove some which
            // needs to be set after widget is created.
            var args = dojo.mixin({}, item);
            delete args.mid;
            delete args.format;
            delete args.eid;
            delete args.ranges;
            delete args.legends;
            delete args.title;
            delete args.titlePosition;
            
            w = new clazz(args);
            
            // mixin internal props from registry 
            dojo.mixin(w,internalProps);
        } else {
        	// here when dnd from tree or between containers
        	var _pluginName = this.registry.getPluginName(item);
        	dojo["require"](_pluginName);
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
        
        var s = hyperic.wallmount.base.metricStore;        
        if(s) {
        	w.setStore(s);
        }
        
        if(item.mid){
        	w.setMetric(item.mid);
        }
        
        if(item.format){
            w.format = item.format;
        }

        if(item.eid){
            w.setEid(item.eid);
        }

        if(item.ranges){
            w.addRanges(item.ranges);
        }

        if(item.legends){
            w.addLegends(item.legends);
        }

        // TODO: this title stuff is too complex like this, redesign...
        var titlePosition = item.titlePosition || "top";
        w.set("titlePosition", titlePosition);
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