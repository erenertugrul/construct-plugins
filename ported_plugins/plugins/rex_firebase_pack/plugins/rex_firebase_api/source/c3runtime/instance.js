"use strict";

{
	C3.Plugins.Rex_FirebaseAPI.Instance = class Rex_FirebaseAPIInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
		
			
			if (properties)		// note properties may be null in some cases
			{
        	window["Firebase"]["enableLogging"](properties[0] == 1);        

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
		OnCreate()
		{	
        	runAfterInitializeHandlers();
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
	            
	        return get_ref(path);
		}
	};
}