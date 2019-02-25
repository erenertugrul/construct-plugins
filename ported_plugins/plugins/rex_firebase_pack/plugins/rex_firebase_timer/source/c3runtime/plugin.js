"use strict";
    // 2.x , 3.x    
	var isFirebase3x = function()
	{ 
        return (window["FirebaseV3x"] === true);
    };
    
    var isFullPath = function (p)
    {
        return (p.substring(0,8) === "https://");
    };

    
    var get_key = function (obj)
    {       
        return (!isFirebase3x())?  obj["key"]() : obj["key"];
    };
    
    var get_root = function (obj)
    {       
        return (!isFirebase3x())?  obj["root"]() : obj["root"];
    };
    
    var serverTimeStamp = function ()
    {       
        if (!isFirebase3x())
            return window["Firebase"]["ServerValue"]["TIMESTAMP"];
        else
            return window["Firebase"]["database"]["ServerValue"];
    };    

    var get_timestamp = function (obj)    
    {       
        if (!obj)
            return null;
        
        return (!isFirebase3x())?  obj : obj["TIMESTAMP"];
    };
    // 2.x , 3.x  
    
    var newTimerDate = function (interval)
    {
        var t = {"start": serverTimeStamp(),
		             "current": serverTimeStamp(),
                    "time-out": interval};
        return t;
    }
    
    var get_deltaTime = function (timer)    
    {
        var t;
        if (timer)
            t = get_timestamp(timer["current"]) - get_timestamp(timer["start"]);
        else
            t = 0;
        
        return t;
    }
{
	C3.Plugins.Rex_Firebase_Timer = class Rex_Firebase_TimerPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}