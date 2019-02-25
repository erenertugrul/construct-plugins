"use strict";
var num2base32 = ["0","1","2","3","4","5","6","7","8","9",
                             "b","c","d","e","f","g","h","j","k","m",
                             "n","p","q","r","s","t","u","v","w","x",
                             "y","z"];
var isCleanBook = function (o)
{
    // object has only one property, and this property is ""
    var cnt = 0;
    for (var k in o)
    {
        if ((k === "") && (cnt === 0))
            return true;
        
        cnt++;
    }
    
    return false;
}
var getFullKey = function (prefix, tableID, itemID, key)
{
    var k = prefix;
    if (tableID != null)
        k += "/" + tableID;
    if (itemID != null)
        k +=  "/" + itemID;
    if (key != null)
    {
        key = key.replace(/\./g, "/");
        k += "/" + key;
    }
    
    return k;
}
{
	C3.Plugins.Rex_Firebase_ItemBook = class Rex_Firebase_ItemBookPlugin extends C3.SDKPluginBase
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