dojo.provide("hyperic.util.FontUtil");

dojo.require("dojox.gfx");
dojo.require("dojox.collections.Dictionary");
dojo.require("dojo.number");

// we have bounding box - width and height. given label
// is fitted to the box.
// for now there's only one font to use.
// create a lookup table for bounding box
// label:size width:50, height:60 > 8-50-60
// we approximate label width by using capital X
// which should give maximum font size.

(function(){
	
	// caching storage
    var dictionary = new dojox.collections.Dictionary();

    // TODO: add caching, don't want to create offline div everytime
    hyperic.util.FontUtil.findGoodSizeFontByRect = function(label,width,height) {
        // summary:
	    //     Calculate best match for font size within rectangle.
	    //
	    // label:
	    //     String (label) used to determine the best font size
	    // width:
	    //     Width of the are where label should be fitted
	    // height:
        //     Height of the are where label should be fitted
        //
	    // description:
	    //     This function gets string, width and height as parameters.
	    //     Based on the values, best match for font size is calculated.
	
	    var dkey = label.length + '-' + Math.round(width) + '-' + Math.round(height);
	    var dval = dictionary.item(dkey);
	    if(!dval){
    	    var size = 100;
    	    var box = dojox.gfx._base._getTextBox(label,{fontFamily:"Helvetica",fontSize:size,fontWeight:"bold"});
	
            var rW = width/box.w;
            var rH = height/box.h;

            var scale = Math.min(rW,rH);
            var newBaseSize = size*scale;
            // scaling font size lineary doesn't give accurate results.
            // so just take 5% of from the estimated font size
            dval = dojo.number.round(newBaseSize - newBaseSize*0.05);
            dictionary.add(dkey, dval);
            // XXX: we might need to adjust font on IE even more down
        }
        return dval;
    };

    hyperic.util.FontUtil.findGoodSizeFontByCircle = function(label,radius) {
        // summary:
        //     Calculate best match for font size withing circle.
        //
        // label:
        //     String (label) used to determine the best font size
        // radius:
        //     Radius of the circle
        //
        // description:
        //     This function gets string and circle radius as parameters.
        //     Based on the values, best match for font size is calculated.
        //     We first find max rectange which fits within circle and then
        //     continue with findGoodSizeFontByRect().
        //
        //     There's no heavy calculation needed since this math is pretty
        //     static. We just do a quick approximation here; Max area within
        //     circle is a square, size of that square is rad*sqrt(2).
        var x = radius * Math.sqrt(2);
        return hyperic.util.FontUtil.findGoodSizeFontByRect(label,x,x);
    };

})();
