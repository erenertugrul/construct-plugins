"use strict";

{
	C3.Plugins.Rex_Firebase_Authentication.Instance = class Rex_Firebase_AuthenticationInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
						// Initialise object properties
 			if (properties)		// note properties may be null in some cases
			{
				this.rootpath = properties[0];
			}
	        this.isMyLoginCall = false;        
	        this.isMyLogOutCall = false;         
	        this.lastError = null;
	        this.lastAuthData = null;  // only used in 2.x
	        this.lastLoginResult = null; // only used in 3.x

	        var self=this;
	        var setupFn = function ()
	        {
	            self.setOnLogoutHandler();
	        }         
	        window.FirebaseAddAfterInitializeHandler(setupFn);


	        window.FirebaseGetCurrentUserID = function()
	        {
	            return self.getCurrentUserID();
	        };

			

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
		Oncreate()
		{

		}
		get_ref(k)
		{
	        if (k == null)
		        k = "";
		        
		    var path;
		    if (k.substring(0,8) == "https://")
		        path = k;
		    else
		        path = this.rootpath + k + "/";
		        
	        return new window["Firebase"](path);
		}
		setOnLogoutHandler()
		{        
	        var self = this;        
	        var onAuthStateChanged = function (authData)
	        {                      
	            if (authData) 
	            {
	                // user authenticated with Firebase
	                //console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
	                
	                var isMyLoginCall = self.isMyLoginCall && !self.isMyLogOutCall;               
	                self.lastError = null;
	                self.lastAuthData = authData;  
	                
	                if (!isMyLoginCall)
	                    self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLoginByOther, self);
	                else
	                {
	                    self.isMyLoginCall = false; 
	                    self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLoginSuccessful, self);        
	                }
	                
	            }
	            else 
	            {
	                var isMyLogOutCall = self.isMyLogOutCall;
	                self.isMyLogOutCall = false;                
	                self.lastAuthData = null;   
	                self.lastLoginResult = null;
	                
	                // user is logged out                
	                if (!isMyLogOutCall)
	                    self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLoggedOutByOther, self);
	                else
	                    self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLoggedOut, self);               
	                
	            }
	        }; 
	        
	        // 2.x
	        if (!isFirebase3x())
	        {
	            this.lastAuthData  = this.get_ref()["getAuth"]();
	            this.get_ref()["onAuth"](onAuthStateChanged);
	        }
	        
	        // 3.x
	        else
	        {
	            getAuthObj()["onAuthStateChanged"](onAuthStateChanged);
	        }        
		}  
	    
	    getCurrentUserID()
	    {
	        var uid;
	        // 2.x
	        if (!isFirebase3x())
	            uid = (this.lastAuthData)? this.lastAuthData["uid"]:"";
	        
	        // 3.x
	        else
	            uid = getUserProperty3x("uid");

	        return uid;        
	    }   
	};
}