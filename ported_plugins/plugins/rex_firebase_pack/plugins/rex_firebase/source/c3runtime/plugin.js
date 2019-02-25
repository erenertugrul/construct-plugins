"use strict";
	var EVENTTYPEMAP = ["value", "child_added", "child_changed", "child_removed","child_moved"];
	var isFirebase3x = function()
	{ 
        return (window["FirebaseV3x"] === true);
    };
  
    var getKey = function (obj)
    {       
        return (!isFirebase3x())?  obj["key"]() : obj["key"];
    };
    
    var getRefPath = function (obj)
    {       
        return (!isFirebase3x())?  obj["ref"]() : obj["ref"];
    };    
    
    var getRoot = function (obj)
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

    var getTimestamp = function (obj)    
    {       
        return (!isFirebase3x())?  obj : obj["TIMESTAMP"];
    };    
    // 2.x , 3.x  
      
    var isFullPath = function (p)
    {
        return (p.substring(0,8) === "https://");
    };
	var getOnCompleteHandler = function (self, onCompleteCb)
	{
	    if ((onCompleteCb === null) || (onCompleteCb === ""))
	        return;
	        
	    var handler = function(error) 
	    {
	        self.onCompleteCb = onCompleteCb;    
	        self.error = error; 
	        var trig = (error)? C3.Plugins.Rex_Firebase.Cnds.OnError:
	                            C3.Plugins.Rex_Firebase.Cnds.OnComplete;
	        self.Trigger(trig, self); 
	        self.onCompleteCb = null;
        };
        return handler;
	};
	    // query
    var get_query = function (queryObjs)
    {
	    if (queryObjs == null)
	        return null;	        
        var query = queryObjs.GetFirstPicked();
        if (query == null)
            return null;
            
        return query.GetSdkInstance().GetQuery();;
    };
{
	C3.Plugins.Rex_Firebase = class Rex_FirebasePlugin extends C3.SDKPluginBase
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