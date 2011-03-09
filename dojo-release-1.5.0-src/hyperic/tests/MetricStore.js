dojo.provide("hyperic.tests.MetricStore");

dojo.require("hyperic.data.MetricStore");

dojo.declare("hyperic.tests.MetricStore", hyperic.data.MetricStore, {

    // 10200:
    // from 0, increment by 1
	//

    // 10300:
    // oscillate between 0 - 100
    // start from 0

    // 10301:
    // oscillate between 0 - 100
    // start from 50

    // 10302:
    // oscillate between 0 - 100
    // start from 80

    // 10303:
    // oscillate between 10 - 20
    // start from 10

    // 10304:
    // oscillate between 30 - 40
    // start from 35

    // 10350:
    // oscillate between 0 - 5
    // start from 0

    // 10351:
    // oscillate between 5 - 10
    // start from 10

    // 10352:
    // oscillate between 0 - 1
    // start from 1

    // 10400:
    // randomize between 100Mb - 1Gb
    // starts 100
    // units in Mb

    // 10401:
    // randomize between 100Mb - 1Gb
    // starts 950
    // units in Mb

    // 10402:
    // randomize between 0Mb - 1Gb
    // starts 0
    // step 15Mb
    // units in Mb

    // 10522: id from demo
    // oscillate between 10 - 35
    // start from 10
    
    // 10585: id from demo
    // oscillate between 5 - 10
    // start from 10
    
    // 1-10000
    // switch between 0 and 1
    // alerts 0,1,2,3
    // escalations 0,1

    // 1-10001
    // avail always 1

    // 1-10002
    // switch avails - 1, 0, 0.5, -0.01, -0.02, 0.1 (unknown)

    // 1-10003
    // avail always 1
    // alerts random 1 - 99999

    // 1-10004
    // avail always -0.01

    // 1-10005
    // avail always -0.02
	
	c10200: 0,
	
    c10300: 0,
	d10300: 1,

    c10301: 50,
    d10301: 1,

    c10302: 80,
    d10302: 1,

    c10303: 10,
    d10303: 1,

    c10304: 35,
    d10304: 1,

    c10350: 0,
    d10350: 1,

    c10351: 10,
    d10351: -1,

    c10352: 1,
    d10352: -1,

    c10400: 100,
    d10400: 1,

    c10401: 950,
    d10401: 1,

    c10402: 0,
    d10402: 15,
    
    c10522: 10,
    d10522: 1,

    c10585: 10,
    d10585: -1,
	
	c110000:1,
    c110001:1,
    c110002:1,
    c110003:1,
	    
	_processResult: function(data, request){
		for(var i = 0; i<data.length; i++) {
			var rand = (Math.random()*11)
			var dd;

            if(request.scope.indexOf("metric") != -1){            	            		
    			if(data[i].serie) {
    				// now
    	   			var eepoch = new Date().getTime();
    	   			// go back 8 hours
    				var sepoch = eepoch - 8 * 60 * 60 * 1000;
    				dd = [];
    				var vv = data[i].last;
    				if(data[i].id === '10500') {
                        for(var j = sepoch; j<eepoch; j += 1800000) {
                            var rand2 = Math.random() + Math.random();
                            vv =+ rand2;
                            dd.push({x: j, y: vv+100});
                        }                   					
    				} else if(data[i].id === '10501') {
                        for(var j = sepoch; j<eepoch; j += 1800000) {
                            var rand2 = Math.random() + Math.random();
                            vv =+ rand2;
                            dd.push({x: j, y: vv+3456});
                        }                                           					
    				}
    			} else if(data[i].id === '10200'){
    				dd = this.get10200();
                } else if(data[i].id === '10300'){
                    dd = this.get10300();
                } else if(data[i].id === '10301'){
                    dd = this.get10301();
                } else if(data[i].id === '10302'){
                    dd = this.get10302();
                } else if(data[i].id === '10303'){
                    dd = this.get10303();
                } else if(data[i].id === '10304'){
                    dd = this.get10304();
                } else if(data[i].id === '10350'){
                    dd = this.get10350();
                } else if(data[i].id === '10351'){
                    dd = this.get10351();
                } else if(data[i].id === '10352'){
                    dd = this.get10352();
                } else if(data[i].id === '10400'){
                    dd = this.get10400();
                } else if(data[i].id === '10401'){
                    dd = this.get10401();
                } else if(data[i].id === '10402'){
                    dd = this.get10402();
                } else if(data[i].id === '10522'){
                    dd = this.get10522();
                } else if(data[i].id === '10585'){
                    dd = this.get10585();
                } else {
                    dd = data[i].last * rand;				
    			}
                this.publish(request.scope + data[i].id, [{id:data[i].id, last:dd}]);            
            } else if(request.scope.indexOf("ravail") != -1){
            	if(data[i].id === '1-10000'){
                    dd = {
                        last: this.get110000(),
                        alerts: Math.floor(Math.random()*4),
                        escalations: Math.floor(Math.random()*2)
                    };                              		
            	} else if(data[i].id === '1-10001'){
                    dd = {
                        last: this.get110001(),
                        alerts: 0,
                        escalations: 0
                    };            		
            	} else if(data[i].id === '1-10002'){
                    dd = {
                        last: this.get110002(),
                        alerts: 0,
                        escalations: 0
                    };                  
                } else if(data[i].id === '1-10003'){
                    dd = {
                        last: this.get110003(),
                        alerts: Math.floor(Math.random()*99999) + 1,
                        escalations: 0
                    };                                      
                } else if(data[i].id === '1-10004'){
                    dd = {
                        last: this.get110004(),
                        alerts: 0,
                        escalations: 2
                    };                                      
                } else if(data[i].id === '1-10005'){
                    dd = {
                        last: -0.02,
                        alerts: 12,
                        escalations: 0
                    };                                      
                }
                                
                this.publish(request.scope + data[i].id, [dd]);                        	
            }
        }
	},

    get110001: function(){
        var val = this.c110001;
        return val;
    },

    get110002: function(){
        var val = this.c110002;
        if(val == 1)
            this.c110002 = 0.5;
        else if(val == 0.5)
            this.c110002 = 0;
        else if(val == 0)
            this.c110002 = -0.01;
        else if(val == -0.01)
            this.c110002 = -0.02;
        else if(val == -0.02)
            this.c110002 = 0.1;
        else
            this.c110002 = 1;
        return val;
    },

    get110003: function(){
        var val = this.c110003;
        return val;
    },

    get110004: function(){
        return -0.01;
    },
    
    get110000: function(){
    	var val = this.c110000;
    	this.c110000 = this.c110000==1 ? 0 : 1;
    	return val;
    },
	
	get10200: function(){
		var val = this.c10200;
		this.c10200++;
		return val;
	},

    get10300: function(){
        var val = this.c10300;
        if(this.c10300 > 99) {
        	this.d10300 = -1;
        } else if(this.c10300 < 1) {
            this.d10300 = 1;        	
        }
        this.c10300 += this.d10300;
        return val;
    },

    get10301: function(){
        var val = this.c10301;
        if(this.c10301 > 99) {
            this.d10301 = -1;
        } else if(this.c10301 < 1) {
            this.d10301 = 1;            
        }
        this.c10301 += this.d10301;
        return val;
    },

    get10302: function(){
        var val = this.c10302;
        if(this.c10302 > 99) {
            this.d10302 = -1;
        } else if(this.c10302 < 1) {
            this.d10302 = 1;            
        }
        this.c10302 += this.d10302;
        return val;
    },

    get10303: function(){
        var val = this.c10303;
        if(this.c10303 > 19) {
            this.d10303 = -1;
        } else if(this.c10303 < 11) {
            this.d10303 = 1;            
        }
        this.c10303 += this.d10303;
        return val;
    },

    get10304: function(){
        var val = this.c10304;
        if(this.c10304 > 39) {
            this.d10304 = -1;
        } else if(this.c10304 < 31) {
            this.d10304 = 1;            
        }
        this.c10304 += this.d10304;
        return val;
    },

    get10350: function(){
        var val = this.c10350;
        if(this.c10350 > 4) {
            this.d10350 = -1;
        } else if(this.c10350 < 1) {
            this.d10350 = 1;            
        }
        this.c10350 += this.d10350;
        return val;
    },

    get10351: function(){
        var val = this.c10351;
        if(this.c10351 > 9) {
            this.d10351 = -1;
        } else if(this.c10351 < 6) {
            this.d10351 = 1;            
        }
        this.c10351 += this.d10351;
        return val;
    },

    get10352: function(){
        var val = this.c10352;
        if(this.c10352 > 0) {
            this.d10352 = -1;
        } else if(this.c10352 < 1) {
            this.d10352 = 1;            
        }
        this.c10352 += this.d10352;
        return val;
    },

    get10400: function(){
        var val = this.c10400;
        if(this.c10400 > 999) {
            this.d10400 = -1;
        } else if(this.c10400 < 101) {
            this.d10400 = 1;            
        }
        this.c10400 += this.d10400;
        return val;
    },

    get10401: function(){
        var val = this.c10401;
        if(this.c10401 > 999) {
            this.d10401 = -1;
        } else if(this.c10401 < 101) {
            this.d10401 = 1;            
        }
        this.c10401 += this.d10401;
        return val;
    },

    get10402: function(){
        var val = this.c10402;
        if(this.c10402 > 999) {
            this.d10402 = -15;
        } else if(this.c10402 < 1) {
            this.d10402 = 15;            
        }
        this.c10402 += this.d10402;
        return val;
    },

    get10522: function(){
        var val = this.c10522;
        if(this.c10522 > 29) {
            this.d10522 = -1;
        } else if(this.c10522 < 11) {
            this.d10522 = 1;            
        }
        this.c10522 += this.d10522;
        return val;
    },
	
    get10585: function(){
        var val = this.c10585;
        if(this.c10585 > 9) {
            this.d10585 = -1;
        } else if(this.c10585 < 6) {
            this.d10585 = 1;            
        }
        this.c10585 += this.d10585;
        return val;
    }

	
});