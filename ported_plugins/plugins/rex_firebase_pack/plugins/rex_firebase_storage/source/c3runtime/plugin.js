"use strict";
    var parseMetadata = function(metadata, defaultContentType)
    {
        if ((metadata.indexOf("{") !== -1) && (metadata.indexOf("}") !== -1))
        {
            metadata = JSON.parse(metadata);
        }
        else if (metadata !== "")
        {
            metadata = {"contentType":  metadata}; 
        }
        else
            metadata = {};
        
        if (!metadata.hasOwnProperty("contentType") && defaultContentType)
            metadata["contentType"] = defaultContentType;

        return metadata;
    };
    
	var setValue = function(keys, value, root)
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

 	var getItemValue = function (item, k, default_value)
	{
        var v;
	    if (item == null)
            v = null;
        else if ( (k == null) || (k === "") )
            v = item;
        else if ((typeof(k) === "number") || (k.indexOf(".") == -1))
            v = item[k];
        else
        {
            var kList = k.split(".");
            v = item;
            var i,cnt=kList.length;
            for(i=0; i<cnt; i++)
            {
                if (typeof(v) !== "object")
                {
                    v = null;
                    break;
                }
                    
                v = v[kList[i]];
            }
        }

        return din(v, default_value);
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
        
    function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        var byteString = atob(dataURI.split(',')[1]);
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        // write the bytes of the string to an ArrayBuffer
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var _ia = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteString.length; i++) {
            _ia[i] = byteString.charCodeAt(i);
        }
    
        var dataView = new DataView(arrayBuffer);
        var blob = new Blob([dataView], { "type": mimeString });
        return [blob, mimeString];
    };
	function frame_getCanvas()
	{
        var tmpcanvas = document.createElement("canvas");
        tmpcanvas.width = this.width;
        tmpcanvas.height = this.height;
        var tmpctx = tmpcanvas.getContext("2d");
        
        if (this.spritesheeted)
        {
        	tmpctx.drawImage(this.texture_img, this.offx, this.offy, this.width, this.height,
        							 0, 0, this.width, this.height);
        }
        else
        {
        	tmpctx.drawImage(this.texture_img, 0, 0, this.width, this.height);
        }
		
		return tmpcanvas;
	};
{
	C3.Plugins.Rex_Firebase_Storage = class Rex_Firebase_StoragePlugin extends C3.SDKPluginBase
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