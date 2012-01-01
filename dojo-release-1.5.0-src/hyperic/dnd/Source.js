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
	//
	// description:
	//     
	//

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
        var _tracks = obj.getTracks();
    	
        var parent = dojo.byId(item).parentNode;        

        // destroy old widget
        obj.destroy();
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
        w.format = _format;
        
        w.source = this;
        w.placeAt(parent);
        w.startup();

        var s = hyperic.wallmount.base.metricStore;        
        if(s) w.setStore(s);
        if(_subscribeId) w.setMetric(_subscribeId);
        if(_eid) w.setEid(_eid);
        if(_tracks) w._setTracks(_tracks);
        
        w._buildContextMenu();

        // replace widget ref to stored dnd data
        var oldData = this.getItem(parent.id);
        oldData.data.wmwidget = w;
    },
    
    _nodeCreator:function(item_in,hint){
        // summary:
        //      Handles node creation when item is either dropped
        //      or created programmatically to container.
        
        // TODO: redesign this creator when all needed functionalities are in place
    	
    	if(hint === 'avatar')
    		return this._avatarNodeCreator(item_in);

        var node = dojo.create("div");
        node.id = dojo.dnd.getUniqueId();
        
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
            
            w = new clazz(args);
            
            // mixin internal props from registry 
            dojo.mixin(w,internalProps);
        } else {
        	// here when dnd from tree or between containers
        	var _pluginName;
        	if(typeof item.wmwidget != 'undefined')
        		_pluginName = item.wmwidget.declaredClass;
        	else
        	    _pluginName = this.registry.getPluginName(item);
        	
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
        

        if(item.format) w.format = item.format;
        if(item.ranges) w.addRanges(item.ranges);
        if(item.legends) w.addLegends(item.legends);

        var titlePosition = w.getTitlePosition() || item.titlePosition || "top";
        w.set("titlePosition", titlePosition);
        
        var title = w.getTitle() || item.name || item.title;
        if(title && title.length > 0){
            w.setTitle(title);
        }
        
        w.source = this;
        w.placeAt(node);
        w.startup();

        var s = hyperic.wallmount.base.metricStore;        
        if(s) w.setStore(s);
        if(item.mid) w.setMetric(item.mid);
        if(item.eid) w.setEid(item.eid);
        
        if(item.tracks && item.scope) w.setTracks(item.tracks, item.scope);
        else if(item.tracks) w.setTracks(item.tracks);
        
        if(item.pid && item.parent) w.setTracksByScope([item.pid], "tavail/" + item.parent + "/");
        else if(item.pid) w.setTracksByScope([item.pid], "tavail/");

        if(item.scope && item.track) w.setTracksByScope([item.track], item.scope);

        w._buildContextMenu();

        item['wmwidget'] = w;
        return {node: node, data: item, type: ["text"]};
    }, 
    
    _avatarNodeCreator:function(item) {
    	// summary:
    	//     Creates shown avatar during DnD operation.
    	//
    	// description:
    	//     We only need to create enough material to show
    	//     what's being transferred. Avatar doesn't transfer any
    	//     information, DnD is getting that from origin object
    	//     when DnD drop is handled.
    	
        var node = dojo.create("div");
        node.id = dojo.dnd.getUniqueId();
        
    	var _pluginName = item.wmwidget.declaredClass;
    	
    	dojo["require"](_pluginName);
        var clazz = dojo.getObject(_pluginName);

    	var props = item.wmwidget.asParams(); 

    	// don't need title for avatar
    	delete props.title;
    	
    	// tweak avatar size
    	if(props.size) {
    		props.size = 60;
    	} else {
    		var _ratio = props.height / props.width; 
    		if(_ratio > 1) {
    			props.height = 60;
    			props.width = props.height / _ratio;
    		} else {
    			props.width = 60;
    			props.height = props.width * _ratio;    			
    		}
    	}
    	
    	var w = new clazz(props);
        w.source = this;
        w.placeAt(node);
        w.startup();
        
    	return {node: node, data: item, type: ["text"]};
    }
    
});