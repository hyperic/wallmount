dojo.provide("hyperic.data.SizeProperty");

dojo.declare("hyperic.data.SizeProperty",null,{

    // width: Number
    // the width of the component
    width: 80,

    // height: Number
    // the height of the component
    height: 20,
    
    // minwidth: Number
    minwidth: 20,
    
    // maxwidth: Number
    maxwidth: 500,
    
    // minheight: Number
    minheight: 20,
    
    // maxheight: Number
    maxheight: 300,
    
    // preserveRatio: Boolean
    // defines whether component should keep its aspect ratio.
    // this also changes component size properties between size <> width,height
    preserveRatio: false,
    
    // aspectSize: Number
    // holder for size if preserving aspect ratio.
    aspectSize: 100,
    
    _setSizeAttr: function(size){
        this.width = size;
        this.height = size;
        this.aspectSize = size;
    }
    

});