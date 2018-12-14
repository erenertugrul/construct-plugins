// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class

cr.plugins_.cjs = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	
	var pluginProto = cr.plugins_.cjs.prototype;
		
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
		var nameOfExternalScript = this.properties[0];
		var url = this.runtime.getProjectFileUrl(nameOfExternalScript);
		this.returnValue= "";
		var myScriptTag=document.createElement('script');
		myScriptTag.setAttribute("type","text/javascript");
		myScriptTag.setAttribute("src", url);
		
		if (typeof myScriptTag != "undefined")
			document.getElementsByTagName("head")[0].appendChild(myScriptTag);
	};
	
	// only called if a layout object
	instanceProto.draw = function(ctx)
	{
	};

	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;

	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	// the example action
	
	acts.ExecuteJS = function (myparam)
	{
		this.returnValue= "";
		try 
		{
			this.returnValue= eval(myparam);
		} catch(err)
		{
			this.returnValue= err;
        }
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	exps.ReadExecutionReturn = function (ret)	
	{
		ret.set_any(this.returnValue);
	};

}());