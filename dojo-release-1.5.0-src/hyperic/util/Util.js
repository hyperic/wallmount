dojo.provide("hyperic.util.Util");

hyperic.util.Util.zeroMinInsets = function(/*Object*/obj){
    // summary:
    //     Returns insets with min of zero values
    return {
    	top: Math.max(obj.top,0),
        left: Math.max(obj.left,0),
        bottom: Math.max(obj.bottom,0),
        right: Math.max(obj.right,0)
    };
};
