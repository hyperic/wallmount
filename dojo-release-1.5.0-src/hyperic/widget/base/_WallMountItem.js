dojo.provide("hyperic.widget.base._WallMountItem");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuItem");
dojo.require("dojox.gfx3d");
dojo.require("hyperic.data.SizeProperty");
dojo.require("hyperic.data.TitleProperty");
dojo.requireLocalization("hyperic", "widget");
dojo.require("dojo.i18n");

dojo.declare("hyperic.widget.base._WallMountItem",
    [ dijit._Widget,
      dijit._Templated,
      hyperic.data.SizeProperty,
      hyperic.data.TitleProperty ],{
    // summary:
    //      xxx
    //
    // description:
    //      xxx
      	
    // value: Number
    // Main metric value attached to this component. Value is always
    // the last raw metric.
    value: null,
    
    // format: 'none', 'percentage', 'B', 'KB', 'MB', 'GB', 'TB', 'epoch-millis', 'epoch-seconds', 'ns', 'mu', 'ms', 'jiffys', 'sec', 'cents' 
    // unit formatting derived from HQ
    format: 'none',
    
    // background: Object
    // the color of the background.  This must be an object of one of two forms:
    // {'color': 'color-name'}
    // OR
    // (for a gradient:)
    // {'type': 'linear', 'x1': 0, 'x2': 0, 'y1': 0, 'y2': 200, 'colors': [{offset: 0, color:'#C0C0C0'}, {offset: 1, color: '#E0E0E0'}] }
    background: null,
    
    // surface: Object
    // The SVG/VML surface that the shapes are drawn on.
    // Can be accessed/used by indicators to draw themselves
    surface: null,
    
    // contextmenu: true if menu should be build and associated
    contextmenu: true,
    
    // source: handle back to owner of this dnd component
    source: null,
    
    // store:
    // Store to retrieve the metric values
    store: null,
    
    // subscribeId:
    //      Id used to subscribe to metric store
    subscribeId: null,
    
    // overlay: boolean
    //     Flag telling if overlay should be used. Basically
    //     changing div's opacity value in case value status is
    //     stale.
    overlay: true,
    
    // valueState: int; -1,0,1,2
    //     Widget state telling status of representing value and its
    //     relation to metric store and backend.
    //     -1: unknown - basically initial status, no info received from metric store
    //      0: ok - sync with metric store, no errors received from metric updates
    //      1: error - received error from store telling we're unable to get value
    //      2: noauth - we're able to access the backend resource but access is denied
    valueState: -1,
    
    color: "green",
    
    // internal data
    templateString: dojo.cache("hyperic.widget.base", "_WallMountItem.html"),
    _backgroundDefault: {color: 'green'},
    _storeSubsHdl: null,
    
    startup: function(){
    	
        if(!this.background){ this.background = this._backgroundDefault; }
        this.background = this.background.color || this.background;
        if(!this.surface){ this.createSurface(); }
        
        this.connect(this.wallMountItemContent, 'onclick', this._onClick);
        
    },
    
    createSurface: function(){
        // summary:
        //      internal method used by the component to create the
        //      graphics surface area. 
        this.surface = dojox.gfx.createSurface(this.wallMountItemContent, this.width, this.height);
        this._background = this.surface.createRect({x: 0, y: 0, width: this.width, height: this.height });
        this._background.setFill(this.background);
    },
    
    setTitle: function(t) {
    	this.titleTextObj.value = t;

        dojo.style(this.wallMountItemTop, {display: "none"});
        this.wallMountItemTop.innerHTML = "";
        dojo.style(this.wallMountItemBottom, {display: "none"});
        this.wallMountItemBottom.innerHTML = "";
        dojo.style(this.wallMountItemLeft, {display: "none"});
        this.wallMountItemLeft.innerHTML = "";
        dojo.style(this.wallMountItemRight, {display: "none"});
        this.wallMountItemRight.innerHTML = "";
        
        var div;
        if(this.titlePositionObj.value === "top") {        	
            div = this.wallMountItemTop;
        } else if(this.titlePositionObj.value === "bottom") {
            div = this.wallMountItemBottom;
        } else if(this.titlePositionObj.value === "right") {
            div = this.wallMountItemRight;
        } else if(this.titlePositionObj.value === "left") {        	
            div = this.wallMountItemLeft;
        } else {
            div = this.wallMountItemTop;        	
        }

        if(t && t.length > 0) {
            div.innerHTML = this.getTitle();
            dojo.style(div, {
                display: "block",
                textAlign: "center"
            });        	
        }
                
    },
        
    postCreate: function(){
    	this.inherited(arguments);
    },
    
    reset: function(){
    	// summary:
    	//     Resets component drawing state. This function generally
    	//     removes everything from the surface and then asks
    	//     implementors to re-create it all.
    	this.surface.clear();
    	dojo.empty(this.wallMountItemContent);
    	this.createSurface();
    	this.draw();
    },
    
    resetValue: function(){
    	// summary:
    	//     This function is meant to use when component
    	//     value has been changes.
    	//
    	// description:
    	//     Components may do much more that just showing
    	//     value, e.g. do animation etc.
    	//     If value is drawn to the surface, there's no
    	//     need to reset the whole component status, just
    	//     redraw the value representation.
    	
    	// If not overwritten, just reset the whole state.
    	this.reset();
    },
    
    setStore: function(s){
        // summary:
    	this.store = s;
    },
    
    setMetric: function(m) {
        // summary:
    	this.subscribeId = m;
    	if(this.store) {
    		// catch handle so we can unsubscribe
    		this._storeSubsHdl = this.store.subscribe("metric/0/" + m, this, "storeCallback");
    	}
    },
    
    storeCallback: function(arg) {
        // summary:
    	
    	this.setValue(arg.last);
        this.resetValue();        	
    },
    
    formattedValue: function() {
        // summary:
    	
    },
    
    _select: function(){
    	dojo.publish("globalEvents", [this]);
    },
 
    _buildContextMenu: function(){
    	// summary:
    	//     xxx
    	function fClick(){
    		this._removeMe();
    	};
    	var pMenu = new dijit.Menu();
    	var pMenuItem = new dijit.MenuItem({label:"Delete"});
    	pMenu.addChild(pMenuItem);
    	dojo.connect(pMenuItem, "onClick", dojo.hitch(this, "_removeMe"));
    	
    	var i18nWidgetNames = dojo.i18n.getLocalization("hyperic", "widget");

        // check if we have registry, if not
        // dont try to build menu for widgets
        if(this.source && this.source.registry) {
            var plugins = this.source.registry.getAttachedPlugins(this);
            var me = this;
            dojo.forEach(plugins,
                function(entry) {
                	// i18n widget name, fall back to full object name
                    var locWidName = i18nWidgetNames[entry] || entry;
                    var menuItem = new dijit.MenuItem({label:locWidName});
                    pMenu.addChild(menuItem);
                    dojo.connect(menuItem, "onClick", dojo.hitch(me, "_switch", entry));                
                }
            );
        }

        pMenu.bindDomNode(this.wallMountItemContent);
    },
    
    _getContextMenuItems: function(){
        	
    },
    
    _switch: function(/*String*/widget){
    	this.source.replaceWidget(this.domNode.id, widget);
    },

    destroy: function(){
    	if(this.store && this._storeSubsHdl) this.store.unsubscribe(this._storeSubsHdl);    	
    	this.inherited(arguments);
    },
    
    _removeMe: function(){
        // fetch a node by its name
        var name = this.domNode.parentNode.id;
        var node = dojo.byId(name);
        
        // we're wrapped by parent, also remove that node
        if(node) {    	
            this.source.delItem(name);
            dojo._destroyElement(node);
        }
        this.destroy();
        
        // XXX: temporary hack.
        // chrome doesnt seem to handle emptyMsgDiv size correctly
        // if widget removed from here.
        // removing and setting class seems to do the trick
        dojo.query(".emptyMsg").forEach(function(node, index, arr){
        	dojo.removeClass(node,"emptyMsg");
        	dojo.addClass(node,"emptyMsg");
        });
    },
    
    drawText: function(/*String*/txt, /*Number*/x, /*Number*/y, /*String?*/align, /*String?*/color, /*Object?*/font){
        var t = this.surface.createText({x: x, y: y, text: txt, align: align});
        t.setFill(color);
        t.setFont(font);
        return t;
    },
        
    getMinSize: function() {
        // summary:
        //      Returns minimum size which fits to both width
        //      and height. Basically just min from w vs. h.	
        return Math.min(this.width, this.height);
    },
    
    setSize: function(/*Number*/size){
        // summary:
        //      Sets size of this component.
        //
        // description:
        //      Childs can implement their own function
        //      to set component width and height. e.g.
        //      if component needs to maintain correct
        //      aspect ratio.
        this.width = size;
        this.height = size;	
    },
    
    handleOverlay: function() {
    	// summary:
    	//     Handles opacity overlay for widget.
    	
    	if(!this.isValueStateOk() && this.overlay)
            dojo.style(this.wallMountItemParent, {opacity: 0.3});
    	else
            dojo.style(this.wallMountItemParent, {opacity: 1});
    },
    
    isValueStateOk: function() {
    	// summary:
    	//     Simply returns true if storeState is zero,
    	//     false otherwise.
    	return this.valueState == 0;
    },
    
    setValue: function(value) {
    	// summary:
    	//     Setting value and handling value state.
    	
    	// when value is explicitly set through this
    	// method we also assume state to be ok unless given
    	// value is undefined or null.
    	if((typeof(value) === 'undefined') || value == null) {
    		this.value = null;
        	this.valueState = 1;    		
    	} else {
        	this.value = value;
        	this.valueState = 0;    		
    	}
    },
    
    asJSON: function(){
    	// summary:
    	//     Returns json object representing this component.
    	// 
    	// description:
    	//     Format of this json should be constructed so that it can be
    	//     used to restore the status when layout is loaded.
    	//     When subclasses are reimplementing this method, parameters from
    	//     parent classes should be handled respectively.
    	
        var jsonObj = this.asParams();
        jsonObj['type'] = this.declaredClass;
    	if(this.subscribeId) {
            jsonObj['mid'] = this.subscribeId;
    		jsonObj['format'] = this.format;
    	}    	
    	return jsonObj;
    }, 
    
    asParams: function(){
    	// summary:
    	//     Returns component parameters as object.
    	var paramObj = {};
    	if(this.preserveRatio) {
    		paramObj['size'] = this.aspectSize;
    	} else {
            paramObj['width'] = this.width;    		
            paramObj['height'] = this.height;         
    	}
        paramObj['color'] = this.color;
        paramObj['titlePosition'] = this.getTitlePosition();
    	paramObj['title'] = this.getTitle();
    	return paramObj;
    }

});