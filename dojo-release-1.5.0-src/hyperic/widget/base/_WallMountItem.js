dojo.provide("hyperic.widget.base._WallMountItem");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuItem");
dojo.require("dojox.gfx3d");
dojo.require("hyperic.data.SizeProperty");

dojo.declare("hyperic.widget.base._WallMountItem",
    [ dijit._Widget,
      dijit._Templated,
      hyperic.data.SizeProperty ],{
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
    
    color: "green",
    
    // internal data
    templateString: dojo.cache("hyperic.widget.base", "_WallMountItem.html"),
    _backgroundDefault: {color: 'green'},
    _rangeData: null,
    ranges: null,
    
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
    	this.wallMountItemTop.innerHTML = t;
    	dojo.style(this.wallMountItemTop, {
    		display: "block",
    		textAlign: "center"
    	});
//        this.wallMountItemLeft.innerHTML = t;
//        dojo.style(this.wallMountItemLeft, {
//            display: "block",
//            textAlign: "center"
//        });
//        this.wallMountItemRight.innerHTML = t;
//        dojo.style(this.wallMountItemRight, {
//            display: "block",
//            textAlign: "center"
//        });
//        this.wallMountItemBottom.innerHTML = t;
//        dojo.style(this.wallMountItemBottom, {
//            display: "block",
//            textAlign: "center"
//        });
    },
    
    _onClick: function(event){
    	console.log("mouse:"+event);
    },
    
    postCreate: function(){
    	this.inherited(arguments);
//        if(this.contextmenu)
//            this._buildContextMenu();    	
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
    	this.store.subscribe("metric/0/" + m, this, "storeCallback");
    },
    
    storeCallback: function(arg) {
        // summary:
        this.value = arg;
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

        // check if we have registry, if not
        // dont try to build menu for widgets
        if(this.source && this.source.registry) {
            var plugins = this.source.registry.getAttachedPlugins();
            var me = this;
            dojo.forEach(plugins,
                function(entry) {
                    var menuItem = new dijit.MenuItem({label:entry});
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
    	console.log("switching to " + widget);
    	this.source.replaceWidget(this.domNode.id, widget);
    },
    
    _removeMe: function(){
    	console.log('removeme');    	
        // fetch a node by its name
        var name = this.domNode.parentNode.id;
        var node = dojo.byId(name);
        if(node){
        	
        	// XXX why these are null?
        	
            // remove it from the selection map
//            delete this.source.selected[name];
            // make sure it is not the anchor
//            if(this.source.anchor == node){
//                this.source.anchor = null;
//            }
            // remove it from the master map
            this.source.delItem(name);
            // remove the node itself
            dojo._destroyElement(node);
        }
    },
    
    drawText: function(/*String*/txt, /*Number*/x, /*Number*/y, /*String?*/align, /*String?*/color, /*Object?*/font){
        var t = this.surface.createText({x: x, y: y, text: txt, align: align});
        t.setFill(color);
        t.setFont(font);
        return t;
    },
    
    isInRange: function(){
    	if(this.ranges === null) return null;    	
    	
    	// TODO: tune range check
    	for(var i=0; i<this.ranges.length; i++){
    		if(this.ranges[i].low < this.value && this.ranges[i].high > this.value)
    		    return this.ranges[i];
    	}
    	  
       return null;    	
    },
    
    // TODO: we want to dynamically modify ranges
    addRange: function(/*Object*/range){
        // summary:
        //      This method is used to add a range to the wallmount component.
        // description:
        //      Creates a range used to determine special behaviour if
        //      metric value spans through the different ranges. For example we
        //      can setup component to change background or text color from
        //      normal -> warning -> alert (aka green/yellow/red)
        // range:
        //      A range is either a hyperic.data.Range object, or a object
        //      with similar parameters (low, high, color, etc.).
        this.addRanges([range]);
    },
    
    addRanges: function(/*Array*/ranges){
        if(!this._rangeData){ 
            this._rangeData = [];
        }
        var range;
        for(var i=0; i<ranges.length; i++){
        	range = ranges[i];
            this._rangeData[this._rangeData.length] = range;
        }   	
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
    }
    
    

});