dojo.provide("hyperic.data.SizeProperty");

dojo.declare("hyperic.data.SizeProperty",null,{

    // width: Number
    // the width of the component
    width: 80,

    // height: Number
    // the height of the component
    height: 20,
    
    // XXX: weird, this is called
//    size: 100,

    // minwidth: Number
    minwidth: 20,
    
    // maxwidth: Number
    maxwidth: 500,
    
    // minheight: Number
    minheight: 20,
    
    // maxheight: Number
    maxheight: 300,
    
    _setSizeAttr: function(size){
        this.width = size;
        this.height = size;
    }
    

});