"use strict";
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

    
	var generate_ID = function(digits)
	{
        var ID = Math.floor(Math.random()*Math.pow(10, digits)).toString();
        var i, zeroes = digits - ID.length;
		for (i=0; i<zeroes; i++)
			ID += "0";        
        return ID;
	};    
	
	var _get_key = function (obj_)
	{	    
	    if (typeof(obj_) !== "object")
	        return null;
	        
	    for (var k in obj_)
	        return k;

        return null;        
	};

	var _get_value = function (obj_)
	{	    
	    if (typeof(obj_) !== "object")
	        return null;
	        	    
	    for (var k in obj_)
	        return obj_[k];
        
        return null;
	};
{
	C3.Plugins.Rex_Firebase_UserID2ID = class Rex_Firebase_UserID2IDPlugin extends C3.SDKPluginBase
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