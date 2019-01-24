// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.erenertugrul_notifier = function(runtime)
{
	this.runtime = runtime;
};
var _type = ["","info","success","warning","danger"]
var _notifier = window["notifier"];
(function ()
{
	var pluginProto = cr.plugins_.erenertugrul_notifier.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// Initialise object properties
		this._notificationId = null;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	instanceProto.onCreate = function()
	{
		// Read properties set in C3
	};
	
	instanceProto.saveToJSON = function ()
	{
		return {};
	};
	
	instanceProto.loadFromJSON = function (o)
	{
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.notifier = function (title,msg,type,icon,timeout)
	{
		var _t = _type[type]
		this._notificationId = _notifier["show"](title ,msg,_t,icon, (timeout*1000));	
	};
	Acts.prototype.hide_notifier = function ()
	{
		_notifier["hide"](this._notificationId);
	};
	Acts.prototype.sprite_notifier = function (title,msg,type,icon,timeout)
	{
		var _t = _type[type]
		var c = null;
		var inst = icon.getFirstPicked();
		if (inst) {
			var frame = inst.curFrame;
			c = frame.getDataUri();
			this._notificationId = _notifier["show"](title ,msg,_t, c, (timeout*1000));
		}
		else{
			var _layer = this.runtime.getLayerByNumber(0);
			var a = this.runtime.createInstance(icon, _layer, -500, -500);
			var frame = a.curFrame;
			c = frame.getDataUri();
			this._notificationId = _notifier["show"](title ,msg,_t, c, (timeout*1000));
		}
	};
	
	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	

	pluginProto.exps = new Exps();

}());