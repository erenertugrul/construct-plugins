"use strict";
    var do_cmp = function (x, cmp, y)
    {
        if (typeof x === "undefined" || typeof y === "undefined")
            return false;
        switch (cmp)
        {
            case 0:     // equal
                return x === y;
            case 1:     // not equal
                return x !== y;
            case 2:     // less
                return x < y;
            case 3:     // less/equal
                return x <= y;
            case 4:     // greater
                return x > y;
            case 5:     // greater/equal
                return x >= y;
            default:
                return false;
        }
    };
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
    
    var get_refPath = function (obj)
    {       
        return (!isFirebase3x())?  obj["ref"]() : obj["ref"];
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
        return (!isFirebase3x())?  obj : obj["TIMESTAMP"];
    };    
    // 2.x , 3.x  
 
{
	C3.Plugins.Rex_Firebase_Counter = class Rex_Firebase_CounterPlugin extends C3.SDKPluginBase
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