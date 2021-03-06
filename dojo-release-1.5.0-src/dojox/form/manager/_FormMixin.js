dojo.provide("dojox.form.manager._FormMixin");

dojo.require("dojox.form.manager._Mixin");

(function(){
	var fm = dojox.form.manager,
		aa = fm.actionAdapter;

	dojo.declare("dojox.form.manager._FormMixin", null, {
		// summary:
		//		Form manager's mixin for form-specific functionality.
		// description:
		//		This mixin adds automated "onreset", and "onsubmit" event processing
		//		if we are based on a form node, defines onReset(), onSubmit(),
		//		reset(), submit(), and isValid() methods like dijit.form.Form.
		//		It should be used together with dojox.form.manager.Mixin.

		// HTML <FORM> attributes (if we are based on the form element)
		name: "",
		action: "",
		method: "",
		encType: "",
		"accept-charset": "",
		accept: "",
		target: "",

		startup: function(){
			this.isForm = this.domNode.tagName.toLowerCase() == "form";
			if(this.isForm){
				this.connect(this.domNode, "onreset", "_onReset");
				this.connect(this.domNode, "onsubmit", "_onSubmit");
			}
			this.inherited(arguments);
		},

		// form-specific functionality

		_onReset: function(evt){
			// NOTE: this function is taken from dijit.formForm, it works only
			// for form-based managers.

			// create fake event so we can know if preventDefault() is called
			var faux = {
				returnValue: true, // the IE way
				preventDefault: function(){  // not IE
							this.returnValue = false;
						},
				stopPropagation: function(){}, currentTarget: evt.currentTarget, target: evt.target
			};
			// if return value is not exactly false, and haven't called preventDefault(), then reset
			if(!(this.onReset(faux) === false) && faux.returnValue){
				this.reset();
			}
			dojo.stopEvent(evt);
			return false;
		},

		onReset: function(){
			//	summary:
			//		Callback when user resets the form. This method is intended
			//		to be over-ridden. When the `reset` method is called
			//		programmatically, the return value from `onReset` is used
			//		to compute whether or not resetting should proceed
			return true; // Boolean
		},

		reset: function(){
			// summary:
			//		Resets form widget values.
			this.inspectFormWidgets(aa(function(_, widget){
				if(widget.reset){
					widget.reset();
				}
			}));
			if(this.isForm){
				this.domNode.reset();
			}
			return this;
		},

		_onSubmit: function(evt){
			// NOTE: this function is taken from dijit.formForm, it works only
			// for form-based managers.

			if(this.onSubmit(evt) === false){ // only exactly false stops submit
				dojo.stopEvent(evt);
			}
		},

		onSubmit: function(){
			//	summary:
			//		Callback when user submits the form. This method is
			//		intended to be over-ridden, but by default it checks and
			//		returns the validity of form elements. When the `submit`
			//		method is called programmatically, the return value from
			//		`onSubmit` is used to compute whether or not submission
			//		should proceed

			return this.isValid(); // Boolean
		},

		submit: function(){
			// summary:
			//		programmatically submit form if and only if the `onSubmit` returns true
			if(this.isForm){
				if(!(this.onSubmit() === false)){
					this.domNode.submit();
				}
			}
		},

		isValid: function(){
			// summary:
			//		Make sure that every widget that has a validator function returns true.
			for(var name in this.formWidgets){
				var stop = false;
				aa(function(_, widget){
					if(!widget.attr("disabled") && widget.isValid && !widget.isValid()){
						stop = true;
					}
				}).call(this, null, this.formWidgets[name].widget);
				if(stop){
					return false;
				}
			}
			return true;
		}
	});
})();
