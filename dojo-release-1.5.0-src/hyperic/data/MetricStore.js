dojo.provide("hyperic.data.MetricStore");

dojo.require("dojox.timing._base");

dojo.declare("hyperic.data.MetricStore", null, {
	// summary:
	//     Allow clients to subscribe to metric information and
	//     receive updates from store once new information is
	//     retreived from the server.
	//
	// description:
	//     Clients for this store are able to subscribe itself to
	//     various topics to receive automatic or on-demand
	//     updates from the backend.
	//
	// update logic:
	//     1. Client subscribes to topic - either metric or
	//        resource availability
	//     2. If topic known and under sync, do callback to notify
	//        client for new value. This is a value/status already
	//        known by store.
	//     3. If topic not known, initiate sync immediately.
	//     4. Later when value is retrieved from the backend, client gets it
	//        through registered callback.
	//     5. Do periodic syncs on background, check if there are
	//        clients interested to receive events for specific metric.
	//        If not, there's no need to sync
	//
	// topic definitions:
	//     metric: last, time frame
    //     /hyperic/metric/0/12345
    //     /hyperic/metric/60/12345
    //     /hyperic/metric/480/12345
    //
	//     resource:  availability
    //     /hyperic/ravail/1-12345 (platform)
    //     /hyperic/ravail/2-12345 (server)
    //     /hyperic/ravail/3-12345 (service)
    //     /hyperic/ravail/4-12345 (application)
    //     /hyperic/ravail/5-12345 (group)
    //
    //     resource type: availability
    //     /hyperic/tavail/1-12345 (platform)
    //     /hyperic/tavail/2-12345 (server)
    //     /hyperic/tavail/3-12345 (service)
	//
	// example:
	//

    // url: String
    //      The URL to the metric data service
    url: "",
    
    // urlPreventCache: String
    //      Flag to dennote if preventCache should be passed to xhrGet.
    urlPreventCache: true,
    
    // idToBaseUrl: Boolean
    //      Indicates whether metric id should be postfixed to base url
    idToBaseUrl: false,
    
    // internal data
    
    // _baseTopic: String
    //      Prefix to topic to be used
    _baseTopic: "/hyperic/",
    _timer: null,
    

    constructor: function(/*Object*/args){
        // summary:
        //      Initialize this store with possibility to change some
        //      core functional values.
        //
        // arguments:
        //      args: Object
        //          url: String
        //          idToBaseUrl: String
        //          urlPreventCache: Boolean
        //          syncTime: Number
    	this._current = {};
    	this._clients = {};
    	
        if(args && args.url){
            this.url = args.url;
        }

        if(args && args.idToBaseUrl){
            this.idToBaseUrl = args.idToBaseUrl;
        }
        
        if(args && "urlPreventCache" in args){
            this.urlPreventCache = args.urlPreventCache?true:false;
        }
        var t = args.syncTime || 3000;
        this._timer = timer = new dojox.timing.Timer(6000);
        dojo.connect(timer, "onTick", dojo.hitch(this, "updateStore"));
        
    },

    sync: function(/*Boolean*/status){
        // summary:
        //      Start or stop background sync timer
        // arguments:
        //      status: Boolean
        //          If true start time, if false stop timer.
        if(status) {
            this._timer.start();    
        } else {
            this._timer.stop();             
        }
    },
    
    loadItem: function(request){
        // summary:
        //      Loads Item from backend store.
        // arguments:
        //      request: Object
        //          id: String
        //              
        request = request || {};
    	var self = this;
    	var reqParams = {};
    	
    	if(request.id){    
            reqParams.item = request.id;    		
    	}
    	
        var getArgs = {
            url: this._getUrl(reqParams.item),
            preventCache: this.urlPreventCache,
            failOk: this.failOk,
            handleAs: "json-comment-optional",
            content: reqParams
        };


        var deferred = dojo.xhrGet(getArgs);

        deferred.addCallback(function(data){self._processResult(data, request);});
        deferred.addErrback(function(error){
            if(request.onError){
                request.onError.call(scope, error, request);
            }
        });
    },
    
    updateStore: function(){
    	// summary:
    	//     Updates status of all items currently
    	//     handled by this store.
//    	console.log("updateStore");
    	for(var i in this._clients){
//            console.log('key', i, 'value', this._clients[i]);
            var val = this._clients[i];
            // /hyperic/metric/0/12345 to
            // metric/0/12345
            var id = i.substring(this._baseTopic.length, i.length);
            var d = id.lastIndexOf('/');
            var scope = id.substring(0, d+1);
//            console.log("scope: " + scope);
            if(val > 0)
                this.loadItem({id: id, scope: scope});        
        }
    },

    fetch: function(/* Object */ keywordArgs){
        // summary:
        //     xxx
        var request = null; 
        throw new Error('Unimplemented API: dojo.data.api.Read.fetch');
        return request; // an object conforming to the dojo.data.api.Request API
    },
    
    subscribe: function(topic, scope, method, acceptNull){
        // summary:
        //     Subscribes client to a specific topic
    	var _topic = this._baseTopic + topic;
    	var hdl = dojo.subscribe(_topic, scope, method);
    	if(acceptNull || this._current[_topic]){
    		var a = this._current[_topic];
    		var arg = (a == null) ?  null : (a.length == 1) ? a[0] : a;
    		scope[method].call(scope, arg);
    	}
    	this._updateInterests(hdl, true);
    	return hdl;
    },

    unsubscribe: function(handle){
        // summary:
        //     Unsubscribes client from a specific metric
        this._updateInterests(handle, false);
        dojo.unsubscribe(handle);
    },
    
    publish: function(topic, args){
        // summary:
        //     Publish event to a specific topic notifying
        //     updates for metric.
        var _topic = this._baseTopic + topic;
    	dojo.publish(_topic, args);
    	this._current[_topic] = args;
    },
    
    _getUrl: function(id){
        // summary:
    	if(!id)
           return this.url;
    	if(this.idToBaseUrl)
    	   return this.url + id;
    	else
    	   return this.url;
    },
    
    _updateInterests: function(handle, /*Boolean*/subscribe){
        // summary:
        //     Updates interest table to contain correct number
        //     of clients currently listening events for a
        //     specific metrics.
        
    	if(!this._clients[handle[0]]) {
    		this._clients[handle[0]] = 0;
    	}
    	var x = this._clients[handle[0]];
    	if(subscribe) {
    	   this._clients[handle[0]] = x+1;	
    	} else {
    		this._clients[handle[0]] = (x < 1 ? 0 : x-1);
    	}
    },
    
    _processResult: function(data, request){
        // summary:
        
        for(var i = 0; i<data.length; i++) {
            this.publish(data[i].id, [data[i].last]);        	
        }
    	
    	
    }
	
});