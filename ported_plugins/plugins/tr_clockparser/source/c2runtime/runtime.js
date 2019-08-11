// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class

cr.plugins_.TR_ClockParser = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	///////////////////////////////////////


    ///////////////////////////////////////
	var pluginProto = cr.plugins_.TR_ClockParser.prototype;
		
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
	};

	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};

	//////////////////////////////////////

	// Conditions
	function Cnds() {};

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.Minimal = function(ret, seconds_)
	{
        seconds_ = parseInt(seconds_, 10);
        var hours   = Math.floor(seconds_ / 3600);
        var minutes = Math.floor((seconds_ - (hours * 3600)) / 60);
        var seconds = seconds_ - (hours * 3600) - (minutes * 60);

        var clockString = "";

        if(hours > 0)
        {
            clockString += (hours < 10 ? "0" + hours : hours) + ":";
        }

        if(hours > 0 || minutes > 0)
        {
            clockString += (minutes < 10 ? "0" + minutes : minutes) + ":";
        }

        clockString += (seconds < 10 ? "0" + seconds : seconds);

        ret.set_string(clockString);
	};


    Exps.prototype.MMSS = function(ret, seconds_)
    {
        seconds_ = parseInt(seconds_, 10);
        var minutes = Math.floor(seconds_ / 60);
        var seconds = seconds_ - minutes * 60;

        if (minutes < 10) { minutes = "0"  +minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        ret.set_string(minutes + ':' + seconds);
    };

    Exps.prototype.HHMMSS = function(ret, seconds_)
    {
        seconds_ = parseInt(seconds_, 10);
        var hours   = Math.floor(seconds_ / 3600);
        var minutes = Math.floor((seconds_ - (hours * 3600)) / 60);
        var seconds = seconds_ - (hours * 3600) - (minutes * 60);

        if (hours   < 10) { hours   = "0" + hours; }
        if (minutes < 10) { minutes = "0"  +minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        ret.set_string(hours + ':' + minutes + ':' + seconds);
    };

    Exps.prototype.ToSeconds = function(ret, clockString_)
    {
        var a = clockString_.split(':');

        var hours = +(a.length === 3 ? a[0] : 0);
        var minutes = +(a.length === 3 ? a[1] : (a.length === 2 ? a[0] : 0));
        var seconds = +(a.length === 3 ? a[2] : (a.length === 2 ? a[1] : (a.length === 1 ? a[0] : 0)));

        seconds = hours * 3600 + minutes * 60 + seconds;
        
        ret.set_int(seconds);
    };

    pluginProto.exps = new Exps();



}());