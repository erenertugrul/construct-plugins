"use strict";
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
	var isFirebase3x = function()
	{ 
        return (window["FirebaseV3x"] === true);
    };
    
    var isFullPath = function (p)
    {
        return (p.substring(0,8) === "https://");
    };
		var is_empty_table = function (o)
	{
		for (var k in o)
		    return false;
		
		return true;
	};
    
    var din = function (d, default_value)
    {       
        var o;
	    if (d === true)
	        o = 1;
	    else if (d === false)
	        o = 0;
        else if (d == null)
        {
            if (default_value != null)
                o = default_value;
            else
                o = 0;
        }
        else if (typeof(d) == "object")
            o = JSON.stringify(d);
        else
            o = d;
	    return o;
    };
    
    var getValueByKeyPath = function (o, keyPath)
    {  
        // invalid key    
        if ((keyPath == null) || (keyPath === ""))
            return o;
        
        // key but no object
        else if (typeof(o) !== "object")
            return null;
        
        else if (keyPath.indexOf(".") === -1)
            return o[keyPath];
        else
        {
            var val = o;              
            var keys = keyPath.split(".");
            var i, cnt=keys.length;
            for(i=0; i<cnt; i++)
            {
                val = val[keys[i]];
                if (val == null)
                    return null;
            }
            return val;
        }
    }  
{
	C3.Plugins.Rex_Firebase_ItemMonitor = class Rex_Firebase_ItemMonitorPlugin extends C3.SDKPluginBase
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