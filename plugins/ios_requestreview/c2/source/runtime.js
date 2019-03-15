// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.eren_requestreview = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.eren_requestreview.prototype;
		
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
		
		this.result = "";
		this.cordova = window["cordova"];


	};
	
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{

		return {

		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{

	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function (glw)
	{
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": "My debugger section",
			"properties": [
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	pluginProto.cnds = new Cnds();

	var cnds = pluginProto.cnds;
		
	cnds.onView = function ()
	{
		return true;
	};
	cnds.onPage= function ()
	{
		return true;
	};

	cnds.onError = function ()
	{
		return true;
	};

	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.postreview = function ()
	{
		var self = this;
		var callback = function (hata, sonuc){
			
		    if (hata){
		    	self.result = hata;
		        self.runtime.trigger(cr.plugins_.eren_requestreview.prototype.cnds.onError,self);
		    }
		    else{
		    	self.result = sonuc;
		    	self.runtime.trigger(cr.plugins_.eren_requestreview.prototype.cnds.onView,self);
		    }
		}
		if (this.runtime.isCordova){
			this.cordova["plugins"]["RequestReview"]["postreview"](callback);
		}
	};
	Acts.prototype.postwrite = function (appid)
	{
		var self = this;
		var callback = function (hata, sonuc){
			
		    if (hata){
		    	self.result = hata;
		        self.runtime.trigger(cr.plugins_.eren_requestreview.prototype.cnds.onError,self);
		    }
		    else{
		    	self.result = sonuc;
		    	self.runtime.trigger(cr.plugins_.eren_requestreview.prototype.cnds.onPage,self);
		    }
		}
		if (this.runtime.isCordova){
			this.cordova["plugins"]["RequestReview"]["postwrite"](appid,callback);
		}
	};
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};


	Exps.prototype.result = function (ret)
	{
		ret.set_string(this.result);
	};
	
	
	pluginProto.exps = new Exps();

}());