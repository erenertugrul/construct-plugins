"use strict";

{
	C3.Plugins.Rex_FirebaseAPIV3.Instance = class Rex_FirebaseAPIV3Instance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			if (properties)		// note properties may be null in some cases
			{
	            window["Firebase"]["database"]["enableLogging"](properties[4] === 1);   
		        if (properties[0] !== "")
		        {
		        	 
		            this.initializeApp(properties[0], properties[1], properties[2], properties[3]);
		        }   
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
		initializeApp(apiKey, authDomain, databaseURL, storageBucket)
		{
	        var config = {
	            "apiKey": apiKey,
	            "authDomain": authDomain,
	            "databaseURL": databaseURL,
	            "storageBucket": storageBucket,
	        };
	        firebase["initializeApp"](config);
	        runAfterInitializeHandlers();
		}
		getRef(k)
		{
	        if (k == null)
	        	k = "";
	    	var path;
		    if (isFullPath(k))
		        path = k;
		    else
		        path = this.rootpath + k + "/";
	            
	        return getRef(path);
		}
		OnCreate()
		{

		}
	};
}