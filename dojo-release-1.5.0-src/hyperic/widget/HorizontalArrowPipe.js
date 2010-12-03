dojo.provide("hyperic.widget.HorizontalArrowPipe");

dojo.require("hyperic.widget.arrowpipe._ArrowPipe");
dojo.require("hyperic.util.FontUtil");
dojo.require("hyperic.unit.UnitsConvert");
dojo.require("dojo.colors");


dojo.declare("hyperic.widget.HorizontalArrowPipe",
    [ hyperic.widget.arrowpipe._ArrowPipe ],{

    _arrowTotalLength: function(){
        return this.width / this.numOfArrows;
    },

    _arrowWidth: function(){
        return this.height - 20;
    },

    _shiftArrows: function(rotation){
        // summary:
        var rLength = this._arrowTotalLength();
        var _s = 0 - rLength + (this.reverse ? -this._shift : this._shift);
        for(var i = 0; i < this._arrows.length; i++) {
            if(!this.reverse)
                this._arrows[i].setTransform({dx: _s});
            else
                this._arrows[i].setTransform({xx: -1, dx: _s+rLength*2});
            _s += rLength;
        }
        
//        if(this._valueDirty){
//        	this._drawAxis(20);
//        }
    },
    
    _createArrows: function(rotation){
        // summary:
        //      Creates all arrow shapes used in this
        //      component.
        
        var c0 = new dojo.Color(this.getColor()).toRgba();
        c0[3] = 0.0;
        var c1 = new dojo.Color(this.getColor()).toRgba();
        c1[3] = 1.0;
        
        
        var fillObj = {
            colors: [
//                { offset: 0, color: [0, 0, 255, 0.0] },
//                { offset: 1, color: [0, 0, 255, 1.0] }
                { offset: 0, color: c0 },
                { offset: 1, color: c1 }
            ]
        };
        
        this._arrows = [];
        var rLength = this._arrowTotalLength();
        var points = this._createArrowPoints();
        var _s = 0 - rLength;
        for(var i = 0; i <= this.numOfArrows; i++) {
            var arrow = this.surface.createPolyline(points);
            // 5 points - 1,5 tail, 3 head, 2,4 head root 
//            arrow.setFill("blue");
                arrow.setFill(dojo.mixin({
                    type: "linear",
                    x1: points[0].x, y1: points[0].y,
                    x2: points[3].x, y2: points[0].y
                    }, fillObj));

            if(!this.reverse)
                arrow.setTransform({dx: _s});
            else 
                arrow.setTransform({xx: -1, dx: _s+rLength*2});
            this._arrows[i] = arrow;
            _s += rLength;
        }
    },
   
    _drawAxis: function(height){
	
        var sVal = hyperic.unit.UnitsConvert.convert(this.value, "none");
        
        var fMax = hyperic.util.FontUtil.findGoodSizeFontByRect(sVal, this.width, height);
        if(this._text) {
            this._text.setShape({text: sVal}); 
        } else {
            this._text = this.drawText(sVal, this.width/2, this.height, "end", "black", {family:"Helvetica",weight:"bold",size:fMax+'px'});
        }
        this.inherited(arguments);
    } 
    
    

});