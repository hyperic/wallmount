dojo.provide("hyperic.wallmount.Registry");

dojo.declare("hyperic.wallmount.Registry",null,{
    // summary:
    //      This acts as a registry for supported components and to where
    //      those can be attached.
    //
    // description:
    //      xxx
    //
    //
    //
    //      <div dojoType="hyperic.wallmount.Registry"
    //           id="registry"
    //           jsId="registry"
    //           defaults="[
    //               {type: 'metric', plugin: 'hyperic.widget.EllipseLabel'},
    //               {type: 'resource', plugin: 'hyperic.widget.AvailIcon'}
    //           ]"
    //           plugins="[
    //               {plugin: 'hyperic.widget.EllipseLabel', attach: [{type: 'all'}]}
    //           ]"></div>
    //
    //      To define supported plugins:
    //
    //      [
    //        {
    //          plugin: 'hyperic.widget.Spinner',
    //          attach: [{
    //            type: 'metric',
    //            exclude:['availability']
    //            }]
    //        },
    //        {
    //          plugin: 'hyperic.widget.AvailIcon',
    //          attach: [{
    //            type: 'resource',
    //            include:['Win32','Apache 2.0']
    //            },
    //            {
    //            type: 'resourcetype',
    //            exclude:['Win32']
    //            }]
    //        },
    //        {
    //          plugin: 'hyperic.widget.EllipseLabel',
    //          attach: [{
    //            type: 'metric'
    //            }]
    //        }
    //      ]


    defaults:null,
    plugins:null,

    constructor: function(/*Object*/options, /*DomNode*/node){
        var i  = 1;	
    },
    
    getDefaultPlugin: function(){
    	return "hyperic.widget.label.Label";
    },

    getAttachedPlugins: function(){
        return ['hyperic.widget.Spinner','hyperic.widget.AvailText','hyperic.widget.AvailIcon'];
    }

});