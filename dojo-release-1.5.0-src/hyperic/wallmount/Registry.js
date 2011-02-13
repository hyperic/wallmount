dojo.provide("hyperic.wallmount.Registry");

dojo.declare("hyperic.wallmount.Registry",null,{
    // summary:
    //      This acts as a registry for supported components.
    //
    // description:
    //      Registry is used to define all supported components, default values,
    //      and where components can be attached. It also defines default components
    //      for different resource types.
    //
    //      Registry should be accessed through hyperic.wallmount.Registry.registry()
    //      method. This method does the static initialization if object doesn't yet
    //      exist.
    //
    //      Registry can be initialized from html markup by using jsId
    //      hyperic.wallmount.Registry._registry. This overwrite any existing
    //      definitions but allows to overwrit/update hard coded registry
    //      values.
    //
    // registry html markup:
    //
    //      <div dojoType="hyperic.wallmount.Registry"
    //           id="registry"
    //           jsId="hyperic.wallmount.Registry._registry"
    //           initpolicy="update|clean"
    //           plugins="[
    //               {plugin: 'hyperic.widget.EllipseLabel', attach: [{type: 'all'}]}
    //           ]"></div>
    //
    //      To define supported plugins:
    //
    //      [
    //        {
    //          plugin: 'hyperic.widget.Spinner',
    //          properties: {width:80, height:80},
    //          attach: [{
    //            type: 'metric',
    //            exclude:['availability']
    //            }],
    //          defaults: [{
    //            type: 'metric',
    //            include:['Cpu Usage']
    //            }]
    //        },
    //        {
    //          plugin: 'hyperic.widget.AvailIcon',
    //          attach: [{
    //            type: 'resourcetype',
    //            include:['resource','group','application']
    //            },
    //            {
    //            type: 'proto',
    //            exclude:['Win32']
    //            }],
    //          defaults: [{
    //            type: 'resource',
    //            include:['*']
    //            }]
    //        },
    //        {
    //          plugin: 'hyperic.widget.EllipseLabel',
    //          attach: [{
    //            type: 'metric'
    //            }]
    //        }
    //      ]


    // plugins: Array
    //     Core registry definition(if defined) from html markup
    plugins:null,
    
    constructor: function(/*Object*/options, /*DomNode*/node){
        this.plugins = typeof options == "undefined" ? [] : (options.plugins || []);
    },
    
    getPluginName: function(/*Object*/item){
    	// summary:
    	//     Finds default plugin for component based on registry configuration
    	
    	// 1. match metric
        var foundPlugin;
    	if(item.mid) {
    		dojo.some(this.plugins,function(plugin){
    			if(plugin.defaults && dojo.some(plugin.defaults,function(def){
    				return (def.type == 'metric' && def.filter == 'name' && def.include.toLowerCase() == item.name.toLowerCase());
    			})) {
    				foundPlugin = plugin.plugin;
    				return true;
    			} else {
    				return false;
    			}
    		});
    		
    		if(foundPlugin) return foundPlugin;
    	}
    	
        // 2. match resource type
        if(item.eid) {
            dojo.some(this.plugins,function(plugin){
                if(plugin.defaults && dojo.some(plugin.defaults,function(def){
                    return (def.type == 'resourcetype' && def.filter == 'eid');
                })) {
                    foundPlugin = plugin.plugin;
                    return true;
                } else {
                    return false;
                }
            });
            
            if(foundPlugin) return foundPlugin;
            
        }
    	// 3. match prototype
        if(item.proto) {
            dojo.some(this.plugins,function(plugin){
                if(plugin.defaults && dojo.some(plugin.defaults,function(def){
                    return (def.type == 'proto' && def.filter == 'proto' && def.include == item.proto);
                })) {
                    foundPlugin = plugin.plugin;
                    return true;
                } else {
                    return false;
                }
            });
            
            if(foundPlugin) return foundPlugin;            
        }
    	
    	// 4. match resource
    	
    	
    	// nothing found, fall back to plain label
        return "hyperic.widget.label.Label";
    },

    getAttachedPlugins: function(){
    // for now just return array of all plugin names
    	var plugs = [];
    	for(var i = 0; i<this.plugins.length; i++) {
            plugs.push(this.plugins[i].plugin); 		
    	}
    	return plugs;
    },

    getPluginProperties: function(/*String*/pluginName){
        // summary:
        //     Returns default properties defined for the plugin.
        //     e.g. width and height, etc
        var props;
    	for(var i = 0; i<this.plugins.length; i++) {
    		if(this.plugins[i].plugin === pluginName) {
    			props = (this.plugins[i].properties ? this.plugins[i].properties : {});
    			break;
    		}
    	}
    	props = props || {};
    	return props;
    }

});

// static reference
hyperic.wallmount.Registry._registry = null;

// "singleton" reference accessor
hyperic.wallmount.Registry.registry = function() {
	if(!hyperic.wallmount.Registry._registry) {
		hyperic.wallmount.Registry._registry = new hyperic.wallmount.Registry();
	}
	return hyperic.wallmount.Registry._registry;
};
