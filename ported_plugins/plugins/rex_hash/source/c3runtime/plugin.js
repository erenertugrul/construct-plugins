"use strict";
	var getItemsCount = function (o)
	{
	    if (o == null)  // nothing
	        return (-1);
	    else if ((typeof o == "number") || (typeof o == "string"))  // number/string
	        return 0;
		else if (o.length != null)  // list
		    return o.length;
	        
	    // hash table
	    var key,cnt=0;
	    for (key in o)
	        cnt += 1;
	    return cnt;
	};
    
    var din = function (d, default_value, space)
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
        {
            o = JSON.stringify(d,null,space);
        }
        else
            o = d;
	    return o;
    };   

    var isArray = function(o)
    {
        return (o instanceof Array);
    }    
	
{
	C3.Plugins.Rex_Hash = class Rex_HashPlugin extends C3.SDKPluginBase
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