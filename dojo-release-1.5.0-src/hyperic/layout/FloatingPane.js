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

dojo.provide("hyperic.layout.FloatingPane");

dojo.require("dojo.window");

dojo.require("dijit._Templated"); 
dojo.require("dijit._Widget"); 
dojo.require("dijit.InlineEditBox"); 
dojo.require("dojo.dnd.Moveable");

dojo.require("dojox.layout.ContentPane");
dojo.require("dojox.layout.ResizeHandle"); 

dojo.declare("hyperic.layout.FloatingPane", 
	[ dojox.layout.ContentPane, dijit._Templated ],
	{
	// summary:
	//		A non-modal Floating window.
	//
	// description:
	// 		Makes a `dojox.layout.ContentPane` float and draggable by it's title [similar to TitlePane]
	// 		and over-rides onClick to onDblClick for wipeIn/Out of containerNode
	// 		provides minimize(dock) / show() and hide() methods, and resize [almost] 
	//
	// closable: Boolean
	//		Allow closure of this Node
	closable: true,

	// resizable: Boolean
	//		Allow resizing of pane true if true
	resizable: false,

	// maxable: Boolean
	//		Horrible param name for "Can you maximize this floating pane?"
	maxable: false,

	// resizeAxis: String
	//		One of: x | xy | y to limit pane's sizing direction
	resizeAxis: "xy",

	// title: String
	//		Title to use in the header
	title: "",

	// duration: Integer
	//		Time is MS to spend toggling in/out node
	duration: 400,

	/*=====
	// iconSrc: String
	//		[not implemented yet] will be either icon in titlepane to left
	//		of Title, and/or icon show when docked in a fisheye-like dock
	//		or maybe dockIcon would be better?
	iconSrc: null,
	=====*/

	// contentClass: String
	// 		The className to give to the inner node which has the content
	contentClass: "dojoxFloatingPaneContent",

	// animation holders for toggle
	_showAnim: null,
	_hideAnim: null, 

	// privates:
	_restoreState: {},
	_allFPs: [],
	_startZ: 100,

	templateString: dojo.cache("hyperic.layout","resources/FloatingPane.html"),
	
	attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
		title: { type:"innerHTML", node:"titleNode" }
	}),
	
	postCreate: function(){
		this.inherited(arguments);
//		new dojo.dnd.Moveable(this.domNode,{ handle: this.focusNode });

        new dojo.dnd.move.parentConstrainedMoveable(this.domNode, {area: "border", within: true, handle: this.focusNode});

		if(!this.closable){ this.closeNode.style.display = "none"; } 
		if(!this.maxable){
			this.maxNode.style.display = "none";
			this.restoreNode.style.display = "none";
		}
		if(!this.resizable){
			this.resizeHandle.style.display = "none"; 	
		}else{
			this.domNode.style.width = dojo.marginBox(this.domNode).w + "px"; 
		}
		this._allFPs.push(this);
		this.domNode.style.position = "absolute";
		
		this.bgIframe = new dijit.BackgroundIframe(this.domNode);
		this._naturalState = dojo.coords(this.domNode);
	},
	
	startup: function(){
		if(this._started){ return; }
		
		this.inherited(arguments);
		
		var inlineEdit = new dijit.InlineEditBox({width: "auto"}, this.titleNode);
        this.connect(inlineEdit,"onChange","_titleEdited");

		if(this.resizable){
			if(dojo.isIE){
				this.canvas.style.overflow = "auto";
			}else{
				this.containerNode.style.overflow = "auto";
			}
			
			this._resizeHandle = new dojox.layout.ResizeHandle({ 
				targetId: this.id, 
				resizeAxis: this.resizeAxis 
			},this.resizeHandle);

		}

		this.connect(this.focusNode,"onmousedown","bringToTop");
		this.connect(this.domNode,	"onmousedown","bringToTop");

		// Initial resize to give child the opportunity to lay itself out
		this.resize(dojo.coords(this.domNode));
		
		this._started = true;
	},
	
	_titleEdited: function(text) {
		// receive event when user edits the title.
		// directly set the variable so that it can be read from
		// dijit object.
		this.title = text;
	},

	setTitle: function(/* String */ title){
		// summary: Update the Title bar with a new string
		dojo.deprecated("pane.setTitle", "Use pane.attr('title', someTitle)", "2.0");
		this.set("title", title);
		// this.setTitle = dojo.hitch(this, "setTitle") ?? 
	},
		
	close: function(){
		// summary: Close and destroy this widget
		if(!this.closable){ return; }
		dojo.unsubscribe(this._listener);
		this.hide(dojo.hitch(this,function(){
			this.destroyRecursive();
		})); 
	},

	hide: function(/* Function? */ callback){
		// summary: Close, but do not destroy this FloatingPane
		dojo.fadeOut({
			node:this.domNode,
			duration:this.duration,
			onEnd: dojo.hitch(this,function() { 
				this.domNode.style.display = "none";
				this.domNode.style.visibility = "hidden"; 
				if(callback){
					callback();
				}
			})
		}).play();
	},

	show: function(/* Function? */callback){
		// summary: Show the FloatingPane
		var anim = dojo.fadeIn({node:this.domNode, duration:this.duration,
			beforeBegin: dojo.hitch(this,function(){
				this.domNode.style.display = ""; 
				this.domNode.style.visibility = "visible";
				if (typeof callback == "function") { callback(); }
			})
		}).play();
		this.resize(dojo.coords(this.domNode));
	},

	minimize: function(){
		// summary: Hide and dock the FloatingPane
		//if(!this._isDocked){ this.hide(dojo.hitch(this,"_dock")); } 
	},

	maximize: function(){
		// summary: Make this FloatingPane full-screen (viewport)	
		if(this._maximized){ return; }
		this._naturalState = dojo.position(this.domNode);
//		if(this._isDocked){
//			this.show();
//			setTimeout(dojo.hitch(this,"maximize"),this.duration);
//		}
		dojo.addClass(this.focusNode,"floatingPaneMaximized");
		this.resize(dojo.window.getBox());
		this._maximized = true;
	},

	_restore: function(){
		if(this._maximized){
			this.resize(this._naturalState);
			dojo.removeClass(this.focusNode,"floatingPaneMaximized");
			this._maximized = false;
		}	
	},
	
	resize: function(/* Object */dim){
		// summary: Size the FloatingPane and place accordingly
		
		// XXX: otherwise when browser refresh the layout,
		// floater my get wrong size
		// we need to retain current state on same cases.
		// FIXME: check if this doesn't break other resize stuff!!!
		if(typeof(dim)=="undefined"){
			dim = this._currentState;
		} else {
	       dim = dim || this._naturalState;		
		}
        // XXX: for now, below code is causing window to place itself back
        //      to original position if user hasn't resized window.
        //      disabling this now, not sure why this is fixing the issue
        
		//this._currentState = dim;

		// From the ResizeHandle we only get width and height information
		var dns = this.domNode.style;
		if("t" in dim){ dns.top = dim.t + "px"; }
		if("l" in dim){ dns.left = dim.l + "px"; }
		dns.width = dim.w + "px"; 
		dns.height = dim.h + "px";

		// Now resize canvas
		var mbCanvas = { l: 0, t: 0, w: dim.w, h: (dim.h - this.focusNode.offsetHeight) };
		dojo.marginBox(this.canvas, mbCanvas);

		// If the single child can resize, forward resize event to it so it can
		// fit itself properly into the content area
		this._checkIfSingleChild();
		if(this._singleChild && this._singleChild.resize){
			this._singleChild.resize(mbCanvas);
		}
	},
	
	bringToTop: function(){
		// summary: bring this FloatingPane above all other panes
		var windows = dojo.filter(
			this._allFPs,
			function(i){
				return i !== this;
			}, 
		this);
		windows.sort(function(a, b){
			return a.domNode.style.zIndex - b.domNode.style.zIndex;
		});
		windows.push(this);
		
		dojo.forEach(windows, function(w, x){
			w.domNode.style.zIndex = this._startZ + (x * 2);
			dojo.removeClass(w.domNode, "dojoxFloatingPaneFg");
		}, this);
		dojo.addClass(this.domNode, "dojoxFloatingPaneFg");
		
		// XXX testing events
		dojo.publish("globalEvents", ["data from an interesting source"]);
	},
	
	destroy: function(){
		// summary: Destroy this FloatingPane completely
		this._allFPs.splice(dojo.indexOf(this._allFPs, this), 1);
		if(this._resizeHandle){
			this._resizeHandle.destroy();
		}
		this.inherited(arguments);
	}
});
