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
	
	var is_empty = function (o)
	{
		for (var k in o)
        {
            if (o[k] !== null)
		        return false;
        }
	    return true;
	};


    var get_path = function (slot_name, is_body, key)
    {
        key = key.replace(re_ALLDOT, "/");
        var p = (is_body)? "bodies":"headers";
        p += "/" + slot_name + "/" + key;
        return p;
    };	
        
	var setItemValue = function(keys, value, root)
	{        
        if (typeof (keys) === "string")
            keys = keys.split(".");
        
        var lastKey = keys.pop(); 
        var entry = getEntry(keys, root);
        entry[lastKey] = value;
	};    

	var getEntry = function(keys, root)
	{
        var entry = root;
        if ((keys === "") || (keys.length === 0))
        {
            //entry = root;
        }
        else
        {
            if (typeof (keys) === "string")
                keys = keys.split(".");
            
            var i,  cnt=keys.length, key;
            for (i=0; i< cnt; i++)
            {
                key = keys[i];
                if ( (entry[key] == null) || (typeof(entry[key]) !== "object") )                
                    entry[key] = {};
                
                entry = entry[key];            
            }           
        }
        
        return entry;
	};      
    
{
	C3.Plugins.Rex_Firebase_SaveSlot = class Rex_Firebase_SaveSlotPlugin extends C3.SDKPluginBase
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