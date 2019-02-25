"use strict";

{
	C3.Plugins.Rex_Firebase_SingleLogin.Instance = class Rex_Firebase_SingleLoginInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
	
		    this.myUserID = null;
	        this.myLoginID = null;
	        this.loginList = null;
	        
	        this.tryLogin = false;
		    this.exp_CurLoginItem = null;	    	    
		    this.exp_CurLoginItemIdx = -1;
			if (properties)		// note properties may be null in some cases
			{
 				 this.rootpath = properties[0] + "/" + properties[1] + "/";
 				 this.kickMode = properties[2];
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
		get_ref (k)
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
		create_loginList ()
		{
		    var loginList = new window.FirebaseItemListKlass();
		    
		    loginList.updateMode = loginList.AUTOALLUPDATE;
	        loginList.keyItemID = "loginID";
		    
		    var self = this;        
	        var snapshot2Item = function (snapshot)
	        {
	            var item = {};            
		        item[loginList.keyItemID] = get_key(snapshot);
	            item["timestamp"] = snapshot["val"]();
	            return item;
	        };
	        loginList.snapshot2Item = snapshot2Item;        
	        
		    var on_update = function()
		    {
		        var myIndex = loginList.GetItemIndexByID(self.myLoginID);  
	            if (myIndex != null)    
	            {            
	                var loggingOut = false;
	                if (self.kickMode === 1)   // Kick previous
	                {
	                    var lastIndex = loginList.GetItems().length - 1;
	                    loggingOut = (myIndex !== lastIndex);               
	                }
	                else if (self.kickMode === 2)   // Kick current
	                {
	                     loggingOut = (myIndex !== 0);
	                }
	                
	                if (self.tryLogin)
	                {
	                    self.tryLogin = false;
	                    if (!loggingOut)
	                        self.Trigger(C3.Plugins.Rex_Firebase_SingleLogin.Cnds.OnLoginSuccess); 	  
	                }
	                 	                             
	                if (loggingOut)
	                {
	                    self.loggingOut();
	                    self.Trigger(C3.Plugins.Rex_Firebase_SingleLogin.Cnds.OnKicked); 	  
	                }
	                
	                self.Trigger(C3.Plugins.Rex_Firebase_SingleLogin.Cnds.OnLoginListChanged);                
	            }
	            else    // kicked from other machine
	            {
	                self.tryLogin = false;
	                self.loggingOut();
	                self.Trigger(C3.Plugins.Rex_Firebase_SingleLogin.Cnds.OnKicked); 
	                self.Trigger(C3.Plugins.Rex_Firebase_SingleLogin.Cnds.OnLoginListChanged);                 
	            }
		    };	    
		    loginList.onItemsFetch = on_update;
	        
		    var onGetIterItem = function(item, i)
		    {
		        self.exp_CurLoginItem = item;
		        self.exp_CurLoginItemIdx = i;
		    };
		    loginList.onGetIterItem = onGetIterItem;         
	        
	        return loginList;
	    }

	    login  (userID)
		{
	        var userRef = this.get_ref(userID);
		    var loginRef = userRef["push"](); 

		    var self = this;	
		    var on_write = function (error)
		    {
	            if (error)
	            {
	                loginRef["onDisconnect"]()["cancel"]();
		            self.myUserID = null;
	                self.myLoginID = null;
	                self.Trigger(C3.Plugins.Rex_Firebase_SingleLogin.Cnds.OnLoginError); 	                   
	            }
			    else
	            {
	                self.tryLogin = true;
		            self.myUserID = userID;
	                self.myLoginID = get_key(loginRef);
	                if (self.loginList === null)
	                    self.loginList = self.create_loginList();
	                var query = userRef["orderByKey"]();
	                
	                setTimeout(function()
	                {
	                    self.loginList.StartUpdate(query);
	                }, 0);
	            }
		    };

	        loginRef["onDisconnect"]()["remove"]();
	        var ts = serverTimeStamp();
		    loginRef["set"](ts, on_write);
		}
	    
	    loggingOut  ()
		{ 
		    if (this.myUserID === null)
		        return;
		        
	        this.loginList.StopUpdate();
	        this.loginList.Clean();
	        
		    var loginRef = this.get_ref(this.myUserID)["child"](this.myLoginID);
		    loginRef["remove"]();
		    loginRef["onDisconnect"]()["cancel"]();
		} 
	};
}