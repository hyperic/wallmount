dojo.provide("hyperic.data.TitleProperty");

dojo.declare("hyperic.data.TitleProperty",null,{

    // titleText: Object
    //
    // value: title text

    // titleText: Object
    // value: position as text
    // list: possible position values
    
    constructor: function(){
        this.titleText = {value:""};
        this.titlePosition = {value:"top", list:["top","bottom","left","right"]};
    },

    _setTitleAttr: function(title){
        this.setTitle(title);
    },

    _setTitlePositionAttr: function(pos){
        this.titlePosition.value = pos;
    },

    getTitle: function(){
        return this.titleText.value;
    },

    getTitlePosition: function(){
        return this.titlePosition.value;
    }
    
});