"use strict";

{
	C3.Plugins.Rex_Firebase_UserID2ID.Instance = class Rex_Firebase_UserID2IDInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			    
                
	        this.exp_ID = "";
	        this.exp_UserID = "";
	        this.error = null;   
			
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

		get_ID_ref(ID)
		{
	        return this.get_ref()["child"](ID);
		}		
		
		try_getID(UserID, ID, on_failed)
		{
		    var ID_ref = this.get_ID_ref(ID);
		    var self = this;
	 
	        var on_write = function(current_value)
	        {
	            if (current_value === null)  //this ID has not been occupied
	                return UserID;
	            else
	                return;    // Abort the transaction
	        };
	        var on_complete = function(error, committed, snapshot) 
	        {
	            if (error || !committed) 
	            {
	                if (on_failed)
	                    on_failed(error);               
	            }
	            else
	            {
	                // done                
	                self.on_getID_successful(UserID, ID);  
	            };                    
	        };
	        ID_ref["transaction"](on_write, on_complete);
		}  

	    on_getID_successful (UserID_, ID_)
	    {
	        this.exp_UserID = UserID_;
	        this.exp_ID = ID_;
	        this.Trigger(C3.Plugins.Rex_Firebase_UserID2ID.Cnds.OnRequestIDSuccessful);
	    } 
	    on_getID_failed (UserID_)
	    { 
	        this.exp_UserID = UserID_;        
	        this.exp_ID = "";
	        this.Trigger(C3.Plugins.Rex_Firebase_UserID2ID.Cnds.OnRequestIDError);
	    }
	    
	    on_getUserID_successful (UserID_, ID_)
	    {
	        this.exp_UserID = UserID_;
	        this.exp_ID = ID_;        
	        this.Trigger(C3.Plugins.Rex_Firebase_UserID2ID.Cnds.OnRequestUserIDSuccessful);
	    } 
	    on_getUserID_failed (ID_)
	    { 
	        this.exp_UserID = "";
	        this.exp_ID = ID_;              
	        this.Trigger(C3.Plugins.Rex_Firebase_UserID2ID.Cnds.OnRequestUserIDError);
	    }

	};
}