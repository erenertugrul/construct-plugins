"use strict";

{
	C3.Plugins.Rex_Firebase_Query.Instance = class Rex_Firebase_QueryInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
		    
	    
	    	this.current_query = null; 
			
			if (properties)		// note properties may be null in some cases
			{
 				this.rootpath = properties[0] + "/";
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
		// export  
		GetQuery()
		{
	        var q = this.current_query;
	        this.current_query = null;
	        return q;
		}  
	};
}