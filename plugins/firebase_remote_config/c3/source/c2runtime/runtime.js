// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");
//var firebase_remote = window["cordova"];
/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.eren_firebase_remote = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var firebase_remote = window["cordova"];
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.eren_firebase_remote.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;

	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.boolean = false;
		this.string = "";
		this.number = 0;
		this.bytes = null;
		this.devmode = this.properties[1];
		this.error = ""; //silebilirsin belki
		this.stringerror = "";
		this.numbererror = "";
		this.booleanerror = "";
		this.byteserror = "";
		if (this.devmode)
			this.update_time = 0;
		else
			this.update_time = (this.properties[0] * 60);
	};
	

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	/*Cnds.prototype.onUpdated = function ()
	{
		return true;
	};*/
	Cnds.prototype.onBoolean = function ()
	{
		return true;
	};
	Cnds.prototype.onString = function ()
	{
		return true;
	};
	Cnds.prototype.onNumber = function ()
	{
		return true;
	};
	Cnds.prototype.onBytes = function ()
	{
		return true;
	};
	Cnds.prototype.onError = function ()
	{
		return true;
	};
	Cnds.prototype.onStringError = function ()
	{
		return true;
	};
	Cnds.prototype.onNumberError = function ()
	{
		return true;
	};
	Cnds.prototype.onBytesError = function ()
	{
		return true;
	};
	Cnds.prototype.onBooleanError = function ()
	{
		return true;
	};
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.getboolean = function (key)
	{
		var self = this;
		if (this.runtime.isCordova)
		{
			firebase_remote["plugins"]["firebase"]["config"]["update"](self.update_time)
			.then(function(){
				firebase_remote["plugins"]["firebase"]["config"]["getBoolean"](key)
				.then(function(v){
					self.boolean = v;
					self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onBoolean,self);
				})
				.catch(function(e){
					self.booleanerror = e;
					self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onBooleanError,self);
				})
			})
			.catch(function(e){
				self.error = e;
				self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onError,self);
			})	
		}
	};
	Acts.prototype.getstring = function (key)
	{
		var self = this;
		if (this.runtime.isCordova)
		{
			firebase_remote["plugins"]["firebase"]["config"]["update"](self.update_time)
			.then(function(){
				firebase_remote["plugins"]["firebase"]["config"]["getString"](key)
				.then(function(v){
					self.string = v;
					self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onString,self);
				})
				.catch(function(e){
					self.stringerror = e;
					self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onStringError,self);
				})
			})
			.catch(function(e){
				self.error = e;
				self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onError,self);
			})
		}
	};
	Acts.prototype.getnumber = function (key)
	{
		var self = this;
		if (this.runtime.isCordova)
		{
			firebase_remote["plugins"]["firebase"]["config"]["update"](self.update_time)
			.then(function(){
				firebase_remote["plugins"]["firebase"]["config"]["getNumber"](key)
				.then(function(v){
					self.number = v;
					self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onNumber,self);
				})
				.catch(function(e){
					self.numbererror = e;
					self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onNumberError,self);
				})
			})
			.catch(function(e){
				self.error = e;
				self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onError,self);
			})
		}
	
	};
	Acts.prototype.getbytes = function (key)
	{
		var self = this;
		if (this.runtime.isCordova)
		{
			firebase_remote["plugins"]["firebase"]["config"]["update"](self.update_time)
			.then(function(){
				firebase_remote["plugins"]["firebase"]["config"]["getBytes"](key)
				.then(function(v){
					self.bytes = v;
					self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onBytes,self);
				})
				.catch(function(e){
					self.byteserror = e;
					self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onBytesError,self);
				})
			})
			.catch(function(e){
				self.error = e;
				self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onError,self);
			})	
		}
	};
	Acts.prototype.setupdatetime = function (time)
	{
		var self = this;
		self.update_time = time * 60 ;
		if (this.runtime.isCordova)
		{
			if (!self.devmode)
			{
				firebase_remote["plugins"]["firebase"]["config"]["update"](self.update_time)
				.then()
				.catch(function(e){
					self.error = e;
					self.runtime.trigger(cr.plugins_.eren_firebase_remote.prototype.cnds.onError,self);
				})
			}
		}
	};
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.getboolean = function (ret)
	{
		ret.set_int(this.boolean);
	}
	Exps.prototype.getstring = function (ret)
	{
		ret.set_string(this.string);
	}
	Exps.prototype.getnumber = function (ret)
	{
		ret.set_float(this.number);
	}
	Exps.prototype.getbytes = function (ret)
	{
		ret.set_string(this.bytes);
	}
	Exps.prototype.geterror = function (ret)
	{
		ret.set_string(this.error);
	}
	Exps.prototype.getstringerror = function (ret)
	{
		ret.set_string(this.stringerror);
	}
	Exps.prototype.getnumbererror = function (ret)
	{
		ret.set_string(this.numbererror);
	}
	Exps.prototype.getbooleanerror = function (ret)
	{
		ret.set_string(this.booleanerror);
	}
	Exps.prototype.getbyteserror = function (ret)
	{
		ret.set_string(this.byteserror);
	}
	pluginProto.exps = new Exps();

}());