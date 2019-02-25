"use strict";

{
	C3.Plugins.Rex_Firebase_Transaction.Instance = class Rex_Firebase_TransactionInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
		
	      this.rootpath = "";
	        this.abort = false;
	        this.valueIn = null; 
	        this.valueWrite = null;        
	        this.isCommitted = null;
	        this.valueOut = null;
			if (properties)		// note properties may be null in some cases
			{
 
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
	};
}