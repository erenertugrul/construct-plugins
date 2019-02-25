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
        return (!isFirebase3x())?  obj : obj["TIMESTAMP"];
    };    
    // 2.x , 3.x  
   var get_extraData = function (extra_data)
    {
        var save_extra_data;   
        if (extra_data == "")
        {
            save_extra_data = null;
        }
        else
        {
            try
            {
	            save_extra_data = JSON.parse(extra_data) 
            }
            catch(err)
            {
                save_extra_data = extra_data;
            }
        }
        return save_extra_data;
    }
    	
{
	C3.Plugins.Rex_Firebase_Leaderboard = class Rex_Firebase_LeaderboardPlugin extends C3.SDKPluginBase
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