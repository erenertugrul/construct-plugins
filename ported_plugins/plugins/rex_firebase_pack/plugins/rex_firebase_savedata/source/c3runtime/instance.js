"use strict";

{
	C3.Plugins.Rex_Firebase_SaveSlot.Instance = class Rex_Firebase_SaveSlotInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
	        this.ownerID = "";

	        this.error = null;             
			this.save_header = {};
			this.save_body = {};
			this.save_item = {};
			
			this.load_headers = null;
			this.load_body = null;
	        this.exp_LastSlotName = null;
			
			this.exp_CurSlotName = "";		
			this.exp_CurHeader = {};
	        this.exp_CurKey = "";
	        this.exp_CurValue = 0;   
			if (properties)		// note properties may be null in some cases
			{
 				this.rootpath = properties[0] + "/" + properties[1] + "/";  
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				// data to be saved for savegames
			};
		}
		
		LoadFromJson(o)
		{
			// load state for savegames
		}
		get_ref(k)
		{
	        if (k == null)
		        k = "";
		    var path;
		    if (isFullPath(k))
		        path = k;
		    else
		        path = this.rootpath + k + "/";
	            
	        // 2.x
	        if (!isFirebase3x())
	        {
	            return new window["Firebase"](path);
	        }  
	        
	        // 3.x
	        else
	        {
	            var fnName = (isFullPath(path))? "refFromURL":"ref";
	            return window["Firebase"]["database"]()[fnName](path);
	        }
	        
		}
	   
		updateCacheData(slot_name, save_header, save_body)
		{		    
	        if (this.load_headers == null)
	            this.load_headers = {};
	        if (!this.load_headers.hasOwnProperty(slot_name))
	            this.load_headers[slot_name] = {};
	        
	        var load_header = this.load_headers[slot_name];
	        for(var n in save_header)
	        {
	            n = setItemValue(n, save_header[n], load_header);
	        }
	        
	        if (slot_name === this.exp_LastSlotName)
	        {
	            if (this.load_body == null)
	                this.load_body = {};
	            for (var n in save_body)
	            {
	                setItemValue(n, save_body[n], this.load_body);
	            }
	        }
		}    
	};
}