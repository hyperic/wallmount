dojo.provide("hyperic.util.MathUtil");

hyperic.util.MathUtil.arcXPointByDegree = function(r, d){
    // summary:
    //     returns x position on a circle by radius and angle 
    // r:
    //     radius
    // d:
    //     degree
    return (Math.cos(Math.PI*d/180) * r);
};

hyperic.util.MathUtil.arcYPointByDegree = function(r, d){
    // summary:
    //     returns y position on a circle by radius and angle 
    // r:
    //     radius
    // d:
    //     degree
    return (Math.sin(Math.PI*d/180) * r);
};
