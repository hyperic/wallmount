dojo.provide("hyperic.layout.PropertiesPane");

dojo.require("dojox.layout.ContentPane");
dojo.require("dijit._Templated");

dojo.require("dojox.form.Manager");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("dijit.form.NumberSpinner");

dojo.require("hyperic.data.SizeProperty");
dojo.require("hyperic.data.ArrowProperty");
dojo.require("hyperic.data.TitleProperty");

dojo.require("hyperic.widget.label.Label");
dojo.require("dijit.form.TextBox");

dojo.require("dojox.form.manager._Mixin");
dojo.require("dojox.form.manager._NodeMixin");
dojo.require("dojox.form.manager._FormMixin");
dojo.require("dojox.form.manager._ValueMixin");
dojo.require("dojox.form.manager._EnableMixin");
dojo.require("dojox.form.manager._DisplayMixin");
dojo.require("dojox.form.manager._ClassMixin");


dojo.declare("hyperic.layout.PropertiesPane",
    [ dojox.layout.ContentPane,
      dijit._Templated,
      dojox.form.manager._Mixin,
      dojox.form.manager._NodeMixin,
      dojox.form.manager._FormMixin,
      dojox.form.manager._ValueMixin,
      dojox.form.manager._EnableMixin,
      dojox.form.manager._DisplayMixin,
      dojox.form.manager._ClassMixin ], {
    // summary:
    //      Constructs a dynamic form for selected component properties. 
    //
    // description:
    //      This component is listening events from components which user are
    //      selecting. Information is posted through event system.
    //

    // contentClass: String
    //      The className to give to the inner node which has the content
    contentClass: "hypericPropertiesPaneContent",

    templateString: dojo.cache("hyperic.layout","resources/PropertiesPane.html"),
        
    // internal data
    
    // currently selected component.
    // info received through topic
    _selected: null,
    
    startup: function(){
        this.inherited(arguments);
        //thisfm = new dojox.form.Manager({}, this.containerNode);
        
        // subscribe to topic and receive events when something
        // is selected.
        dojo.subscribe("globalEvents", dojo.hitch(this, "_onMessage"));
    },
    
    _onMessage: function(arg){
    	// summary:
    	//     this method is called when message is posted to selected
    	//     topic. This message should indicate that user has selected
    	//     something from the dashboard.
    	//
    	    	
    	if(/*arg.isInstanceOf &&*/ arg instanceof hyperic.widget.base._WallMountItem ) {
            this._selected = arg;    		
    	} else {
    		this._selected = null;
    	}

        
        // first hide all, we'll show needed components later
        this.hide(["arrowProperties"]);
        this.hide(["sizeProperties"]);
        this.hide(["titleProperties"]);
        
        if(arg.isInstanceOf) {
            if(arg.isInstanceOf(hyperic.data.TitleProperty)) {
                this.titleProperty();
            }
            
        	if(arg.isInstanceOf(hyperic.data.SizeProperty)) {
        		this.sizeProperty();
        	} else {
                this.hide(["sizeProperties"]);
        	}

            if(arg.isInstanceOf(hyperic.data.ArrowProperty)) {
                this.arrowProperty();
            } else {
                this.hide(["arrowProperties"]);
            }

        	
        }
    },
    
    _clearAll: function(){
    	
    },

    handleValues: function(name,evt){
    	var h = this.elementValue("height");
        var w = this.elementValue("width");
        console.log("foo:" + h + " / " + w + " / " + name + " / " + evt);
    	this._selected.height = h;
        this._selected.width = w;
        
        if(this._selected.isInstanceOf(hyperic.data.ArrowProperty)) {
        	this._selected.arrowCount.value = this.elementValue("arrowcount");
            this._selected.arrowWidth.value = this.elementValue("arrowwidth");
        }
        if(this._selected.isInstanceOf(hyperic.data.TitleProperty)) {
            this._selected.titlePosition.value = this.elementValue("titleposition");
            this._selected.setTitle(this.elementValue("titletext"))
        }
        
        this._selected.reset();
    },
    
    sizeProperty: function(){
    	
        this.show(["sizeProperties"]);

    	var w = dijit.byId(this.width);
    	w.constraints.min = this._selected.minwidth;
        w.constraints.max = this._selected.maxwidth;
        w.set('value', this._selected.width);
        var h = dijit.byId(this.height);
        h.constraints.min = this._selected.minheight;
        h.constraints.max = this._selected.maxheight;
        h.set('value', this._selected.height);
    },
    
    arrowProperty: function(){
        this.show(["arrowProperties"]);

        var arrowCount = dijit.byId(this.arrowcount);
        arrowCount.constraints.min = this._selected.arrowCount.min;
        arrowCount.constraints.max = this._selected.arrowCount.max;
        arrowCount.set('value', this._selected.arrowCount.value);    	
        
        var arrowWidth = dijit.byId(this.arrowwidth);
        arrowWidth.constraints.min = this._selected.arrowWidth.min;
        arrowWidth.constraints.max = this._selected.arrowWidth.max;
        arrowWidth.set('value', this._selected.arrowWidth.value);       
    },
    
    titleProperty: function(){
        this.show(["titleProperties"]);

        var title = dijit.byId(this.titletext);
        title.set('value', this._selected.titleText.value);
        
        var titleposition = dijit.byId(this.titleposition);
        titleposition.set('value', this._selected.titlePosition.value);
        
    }
    
    

});

