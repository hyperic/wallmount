dojo.provide("hyperic.widget.VerticalArrowPipe");

dojo.require("hyperic.widget.arrowpipe._ArrowPipe");
dojo.require("hyperic.util.FontUtil");
dojo.require("hyperic.unit.UnitsConvert");

dojo.declare("hyperic.widget.VerticalArrowPipe",
    [ hyperic.widget.arrowpipe._ArrowPipe ],{

    _arrowTotalLength: function(){
        return this.height / this.getArrowCount();
    },

    _arrowWidth: function(){
        return this.width - 20;
    },
    _shiftArrows: function(rotation){
        // summary:
        var rLength = this._arrowTotalLength();
        var _s = 0 - rLength + (this.reverse ? -this._shift : this._shift);
        for(var i = 0; i < this._arrows.length; i++) {
            if(!this.reverse)
                this._arrows[i].setTransform({dy: _s, xx: 0, xy: 1, yx: 1, yy: 0});
            else
                this._arrows[i].setTransform({dy: _s+2*rLength, xx: 0, xy: 1, yx: -1, yy: 0});
            _s += rLength;
        }
    },
    
    _createArrows: function(rotation){
        // summary:
        //      Creates all arrow shapes used in this
        //      component.
        var fillObj = {
            colors: [
                { offset: 0, color: [0, 0, 255, 0.0] },
                { offset: 1, color: "blue" }
            ]
        };
        this._arrows = [];
        var rLength = this._arrowTotalLength();
        var points = this._createArrowPoints();
        var _s = 0 - rLength;
        for(var i = 0; i <= this.getArrowCount(); i++) {
            var arrow = this.surface.createPolyline(points);
//                arrow.setFill("blue");
                arrow.setFill(dojo.mixin({
                    type: "linear",
                    x1: points[0].x, y1: points[0].y,
                    x2: points[3].x, y2: points[0].y
                    }, fillObj));
            if(!this.reverse)
                arrow.setTransform({dy: _s, xx: 0, xy: 1, yx: 1, yy: 0});
            else 
                arrow.setTransform({dy: _s+2*rLength, xx: 0, xy: 1, yx: -1, yy: 0});
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
            this._text = this.drawText(sVal,0 ,0 , "end", "black", {family:"Helvetica",weight:"bold",size:fMax+'px'}).setTransform({xx: 0, xy: 1, yx: -1, yy: 0, dx: this.width, dy: this.height/2});
        }
        this.inherited(arguments);
    } 

});