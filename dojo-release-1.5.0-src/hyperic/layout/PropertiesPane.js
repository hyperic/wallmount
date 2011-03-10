dojo.provide("hyperic.layout.PropertiesPane");

dojo.require("dojox.layout.ContentPane");
dojo.require("dijit._Templated");

dojo.require("dojox.form.Manager");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("dijit.form.NumberSpinner");

dojo.require("hyperic.form.UnitsNumberSpinner");

dojo.require("hyperic.data.SizeProperty");
dojo.require("hyperic.data.ArrowProperty");
dojo.require("hyperic.data.ArrowPipeProperty");
dojo.require("hyperic.data.TitleProperty");
dojo.require("hyperic.data.RangeSpeedProperty");
dojo.require("hyperic.data.RangesProperty");

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
        
        // ColorPalette doesn't play nice with manager observer,
        // so connect event here.
        dojo.connect(this.labelcolor,'onChange',dojo.hitch(this,"handleValues"));
        dojo.connect(this.spinnercolor,'onChange',dojo.hitch(this,"handleValues"));
        dojo.connect(this.alarmrangecolor,'onChange',dojo.hitch(this,"handleValues"));
        dojo.connect(this.warnrangecolor,'onChange',dojo.hitch(this,"handleValues"));
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
        this.hide(["rangesProperties"]);
        this.hide(["rangeSpeedProperties"]);
        this.hide(["labelProperties"]);
        this.hide(["arrowProperties"]);
        this.hide(["arrowPipeProperties"]);
        this.hide(["sizeProperties"]);
        this.hide(["sizePropertiesSize"]);
        this.hide(["titleProperties"]);
        
        if(arg.isInstanceOf) {
            if(arg.isInstanceOf(hyperic.data.TitleProperty)) {
                this.titleProperty();
            }
            
        	if(arg.isInstanceOf(hyperic.data.SizeProperty)) {
        		this.sizeProperty();
        	} else {
                this.hide(["sizeProperties"]);
                this.hide(["sizePropertiesSize"]);
        	}

            if(arg.isInstanceOf(hyperic.data.ArrowProperty)) {
                this.arrowProperty();
            } else {
                this.hide(["arrowProperties"]);
            }

            if(arg.isInstanceOf(hyperic.data.ArrowPipeProperty)) {
                this.arrowPipeProperty();
            } else {
                this.hide(["arrowPipeProperties"]);
            }

            if(arg.isInstanceOf(hyperic.data.LabelProperty)) {
                this.labelProperty();
            } else {
                this.hide(["labelProperties"]);
            }

            if(arg.isInstanceOf(hyperic.data.RangeSpeedProperty)) {
                this.rangeSpeedProperty();
            } else {
                this.hide(["rangeSpeedProperties"]);
            }
            
            if(arg.isInstanceOf(hyperic.data.RangesProperty)) {
                this.rangesProperty();
            } else {
                this.hide(["rangesProperties"]);
            }
        	
        }
    },
    
    _clearAll: function(){
    	
    },

    handleValues: function(name,evt){
    	
    	if(this._selected.preserveRatio) {
            var s = this.elementValue("size");
            this._selected._setSizeAttr(s);
    	} else {
            var h = this.elementValue("height");
            var w = this.elementValue("width");
            this._selected.height = h;
            this._selected.width = w;           
    		
    	}
        
        if(this._selected.isInstanceOf(hyperic.data.ArrowProperty)) {
        	this._selected.arrowCountObj.value = this.elementValue("arrowcount");
            this._selected.arrowWidthObj.value = this.elementValue("arrowwidth");
            this._selected.arrowGapObj.value = this.elementValue("arrowgap");
            this._selected.arrowHeadLengthObj.value = this.elementValue("arrowheadlength");
            var picker = dijit.byId(this.spinnercolor);
            if(picker.value) {
                dojo.style(this.spinnercolorbutton.containerNode, "color", picker.value);
                dojo.style(this.spinnercolorbutton.containerNode, "backgroundColor", picker.value);
                this._selected.color = picker.value;               
            }
        }
        if(this._selected.isInstanceOf(hyperic.data.ArrowPipeProperty)) {
            this._selected.arrowCountObj.value = this.elementValue("arrowpipecount");
            this._selected.arrowGapObj.value = this.elementValue("arrowpipegap");
            this._selected.arrowHeadLengthObj.value = this.elementValue("arrowpipeheadlength");
        }
        if(this._selected.isInstanceOf(hyperic.data.TitleProperty)) {
            this._selected.titlePosition.value = this.elementValue("titleposition");
            this._selected.setTitle(this.elementValue("titletext"))
        }

        if(this._selected.isInstanceOf(hyperic.data.LabelProperty)) {
            var picker = dijit.byId(this.labelcolor);
            if(picker.value) {
                dojo.style(this.labelcolorbutton.containerNode, "color", picker.value);
                dojo.style(this.labelcolorbutton.containerNode, "backgroundColor", picker.value);
                this._selected.labelColor = picker.value;            	
            }
        }
        if(this._selected.isInstanceOf(hyperic.data.RangeSpeedProperty)) {
            this._selected.minRangeObj.value = this.elementValue("minrange");
            this._selected.maxRangeObj.value = this.elementValue("maxrange");
            this._selected.speedTimeObj.value = this.elementValue("speedtime");
        }

        if(this._selected.isInstanceOf(hyperic.data.RangesProperty)) {
        	this._selected.removeRanges();
        	
        	//alarm
            var alarmrange = this.elementValue("alarmrange");            
            var alarmrangepicker = dijit.byId(this.alarmrangecolor);
            if(alarmrangepicker.value){
                dojo.style(this.alarmrangecolorbutton.containerNode, "color", alarmrangepicker.value);
                dojo.style(this.alarmrangecolorbutton.containerNode, "backgroundColor", alarmrangepicker.value);                  
            }
            if(!isNaN(alarmrange)){
                var alarmrangecomp = this.elementValue("alarmrangecomp");
                this._selected.addRange({value:alarmrange, comparator:alarmrangecomp, color:alarmrangepicker.value});
            	
            }
            //warn
            var warnrange = this.elementValue("warnrange");            
            var warnrangepicker = dijit.byId(this.warnrangecolor);
            if(warnrangepicker.value){
                dojo.style(this.warnrangecolorbutton.containerNode, "color", warnrangepicker.value);
                dojo.style(this.warnrangecolorbutton.containerNode, "backgroundColor", warnrangepicker.value);                  
            }
            if(!isNaN(warnrange)){
                var warnrangecomp = this.elementValue("warnrangecomp");
                this._selected.addRange({value:warnrange, comparator:warnrangecomp, color:warnrangepicker.value});
                
            }
            
        }
        
        this._selected.reset();
    },
    
    sizeProperty: function(){
    	
    	if(this._selected.preserveRatio) {
            this.show(["sizePropertiesSize"]);
            var s = dijit.byId(this.size);
            s.constraints.min = this._selected.minheight;
            s.constraints.max = this._selected.maxheight;
    		s.set('value', this._selected.aspectSize);
    	} else {
            this.show(["sizeProperties"]);
            var w = dijit.byId(this.width);
            w.constraints.min = this._selected.minwidth;
            w.constraints.max = this._selected.maxwidth;
            w.set('value', this._selected.width);
            var h = dijit.byId(this.height);
            h.constraints.min = this._selected.minheight;
            h.constraints.max = this._selected.maxheight;
            h.set('value', this._selected.height);    		
    	}
    },
    
    arrowProperty: function(){
        this.show(["arrowProperties"]);

        var arrowCount = dijit.byId(this.arrowcount);
        arrowCount.constraints.min = this._selected.arrowCountObj.min;
        arrowCount.constraints.max = this._selected.arrowCountObj.max;
        arrowCount.set('value', this._selected.arrowCountObj.value);    	
        
        var arrowWidth = dijit.byId(this.arrowwidth);
        arrowWidth.constraints.min = this._selected.arrowWidthObj.min;
        arrowWidth.constraints.max = this._selected.arrowWidthObj.max;
        arrowWidth.set('value', this._selected.arrowWidthObj.value);       

        var arrowGap = dijit.byId(this.arrowgap);
        arrowGap.constraints.min = this._selected.arrowGapObj.min;
        arrowGap.constraints.max = this._selected.arrowGapObj.max;
        arrowGap.set('value', this._selected.arrowGapObj.value);       

        var arrowHeadLength = dijit.byId(this.arrowheadlength);
        arrowHeadLength.constraints.min = this._selected.arrowHeadLengthObj.min;
        arrowHeadLength.constraints.max = this._selected.arrowHeadLengthObj.max;
        arrowHeadLength.set('value', this._selected.arrowHeadLengthObj.value);
        
        var picker = dijit.byId(this.spinnercolor);
        picker.value = this._selected.getColor();
        dojo.style(this.spinnercolorbutton.containerNode, "color", this._selected.getColor());
        dojo.style(this.spinnercolorbutton.containerNode, "backgroundColor", this._selected.getColor());
    },

    arrowPipeProperty: function(){
        this.show(["arrowPipeProperties"]);

        var arrowCount = dijit.byId(this.arrowpipecount);
        arrowCount.constraints.min = this._selected.arrowCountObj.min;
        arrowCount.constraints.max = this._selected.arrowCountObj.max;
        arrowCount.set('value', this._selected.arrowCountObj.value);        
        
        var arrowGap = dijit.byId(this.arrowpipegap);
        arrowGap.constraints.min = this._selected.arrowGapObj.min;
        arrowGap.constraints.max = this._selected.arrowGapObj.max;
        arrowGap.set('value', this._selected.arrowGapObj.value);       

        var arrowHeadLength = dijit.byId(this.arrowpipeheadlength);
        arrowHeadLength.constraints.min = this._selected.arrowHeadLengthObj.min;
        arrowHeadLength.constraints.max = this._selected.arrowHeadLengthObj.max;
        arrowHeadLength.set('value', this._selected.arrowHeadLengthObj.value);       
    },
    
    titleProperty: function(){
        this.show(["titleProperties"]);

        var title = dijit.byId(this.titletext);
        title.set('value', this._selected.titleText.value);
        
        var titleposition = dijit.byId(this.titleposition);
        titleposition.set('value', this._selected.titlePosition.value);
        
    },

    labelProperty: function(){
        this.show(["labelProperties"]);
        var picker = dijit.byId(this.labelcolor);
        picker.value = this._selected.getLabelColor();
        dojo.style(this.labelcolorbutton.containerNode, "color", this._selected.getLabelColor());
        dojo.style(this.labelcolorbutton.containerNode, "backgroundColor", this._selected.getLabelColor());
    },
    
    rangeSpeedProperty: function(){
        this.show(["rangeSpeedProperties"]);
        
        
        var minRange = dijit.byId(this.minrange);
        minRange.units = this._selected.format;
        minRange.constraints.min = this._selected.minRangeObj.min;
        minRange.constraints.max = this._selected.minRangeObj.max;
        minRange.set('value', this._selected.minRangeObj.value);        

        var maxRange = dijit.byId(this.maxrange);
        maxRange.units = this._selected.format;      
        maxRange.constraints.min = this._selected.maxRangeObj.min;
        maxRange.constraints.max = this._selected.maxRangeObj.max;
        maxRange.set('value', this._selected.maxRangeObj.value);  
        
        var speedTime = dijit.byId(this.speedtime);
        speedTime.constraints.min = this._selected.speedTimeObj.min;
        speedTime.constraints.max = this._selected.speedTimeObj.max;
        speedTime.set('value', this._selected.speedTimeObj.value);        

    },

    rangesProperty: function(){
        this.show(["rangesProperties"]);
        
        var ranges = this._selected.getRanges();

        //alarm        
        var aCom, aVal, aCol;
        if(ranges && ranges[0]) {
        	aCom = ranges[0].comparator;
            aVal = ranges[0].value;
            aCol = ranges[0].color;
        } else {
            aCom = "&gt;";
            aVal = "";
            aCol = "#ff0000";
        }
        
        var alarmrangecomp = dijit.byId(this.alarmrangecomp);
        alarmrangecomp.set('value', aCom);

        var alarmrange = dijit.byId(this.alarmrange);
        alarmrange.units = this._selected.format;
        alarmrange.constraints.min = 0;
        alarmrange.set('value', aVal);       

        var alarmrangecolor = dijit.byId(this.alarmrangecolor);
        alarmrangecolor.value = aCol;
        dojo.style(this.alarmrangecolorbutton.containerNode, "color", aCol);
        dojo.style(this.alarmrangecolorbutton.containerNode, "backgroundColor", aCol);

        //warn
        var wCom, wVal, wCol;
        if(ranges && ranges[1]) {
            wCom = ranges[1].comparator;
            wVal = ranges[1].value;
            wCol = ranges[1].color;
        } else {
            wCom = "&gt;";
            wVal = "";
            wCol = "#ffd700";
        }
        
        var warnrangecomp = dijit.byId(this.warnrangecomp);
        warnrangecomp.set('value', wCom);

        var warnrange = dijit.byId(this.warnrange);
        warnrange.units = this._selected.format;
        warnrange.constraints.min = 0;
        warnrange.set('value', wVal);       

        var warnrangecolor = dijit.byId(this.warnrangecolor);
        warnrangecolor.value = wCol;
        dojo.style(this.warnrangecolorbutton.containerNode, "color", wCol);
        dojo.style(this.warnrangecolorbutton.containerNode, "backgroundColor", wCol);
        
    }
    

});

