"use strict";

{
	C3.Plugins.Rex_Firebase_UserID2ID.Acts =
	{
 
	    RequestGetRandomID(UserID, digits, retry)
		{
	        if (UserID === "")
	            return;
	            
	        var self = this;            
	        var retry_cnt = retry;          
	        var try_get_id = function()
	        {
	            if (retry_cnt == 0)
	            {
	                // failed
	                self.error = null;
	                self.on_getID_failed(UserID);
	            }
	            else
	            {
	                retry_cnt -= 1;            
	                var newID = generate_ID(digits);
	                self.try_getID(UserID, newID, try_get_id);
	            }
	        };
	        
	        var on_read = function(snapshot)
	        {
	            var result = snapshot["val"]();    // { ID:UserID }
	            if (result == null)
	            {
	                try_get_id();
	            }
	            else
	            {
	                // get ID
	                var return_ID = _get_key(result);                
	                self.on_getID_successful(UserID, return_ID);
	            }
	        };
	        
	        var on_read_failure = function(error)
	        {
	            self.error = error;
	            self.on_getID_failed(UserID);
	        };
	        var query = this.get_ref()["orderByValue"]()["equalTo"](UserID)["limitToFirst"](1);
	        query["once"]("value", on_read, on_read_failure);
		},
		
	    RequestGetUserID(ID)
		{
	        if (ID === "")
	            return;
	             
	        var self = this;             
	        var on_read = function(snapshot)
	        {
	            var return_UserID = snapshot["val"]();
	            self.error = null;            
	            if (return_UserID == null)
	                self.on_getUserID_failed(ID);
	            else
	                self.on_getUserID_successful(return_UserID, ID);
	        };
	        var on_read_failure = function(error)
	        {
	            self.error = error;
	            self.on_getUserID_failed(ID);
	        };
	        
	        var ID_ref = this.get_ID_ref(ID);                        
	        ID_ref["once"]("value", on_read, on_read_failure);
		},	
		
	    RequestTryGetID(UserID, ID)
		{               
		    if ((UserID === "") || (ID === ""))
		        return;
		        
		    var GETCMD = (ID == null);
	        var self = this;             
	        var on_read = function(snapshot)
	        {
	            var result = snapshot["val"]();    // { ID:UserID }
	            var return_ID = _get_key(result);
	            self.error = null;            
	            if (GETCMD)  // get existed ID
	            {
	                if (return_ID == null)
	                    self.on_getID_failed(UserID);
	                else
	                    self.on_getID_successful(UserID, return_ID); 
	            }
	            else
	            {
	                if (return_ID == null)  // try set new ID
	                    self.try_getID(UserID, ID, on_getID_failed);
	                else                     // ID is existed
	                {
	                    if (return_ID != ID)  
	                        self.on_getID_failed(UserID);
	                    else
	                        self.on_getID_successful(UserID, ID); 
	                }                        
	            }        
	        };
	        var on_getID_failed = function ()
	        {
	            self.on_getID_failed(UserID);
	        };
	        
	        var on_read_failure = function(error)
	        {
	            self.error = error;
	            self.on_getID_failed(UserID);
	        };        
	                
	        var query = this.get_ref()["orderByValue"]()["equalTo"](UserID)["limitToFirst"](1);
	        query["once"]("value", on_read, on_read_failure);
		},	

	    RemoveUserID(UserID)
		{               
		    if (UserID === "")
		        return;
		        
	        var self = this;    
	        
		    var onComplete = function(error) 
		    {
	            self.exp_UserID = UserID;
	            self.error = error;   
	            if (error)
	                self.Trigger(C3.Plugins.Rex_Firebase_UserID2ID.Cnds.OnRemoveUserIDError);
	            else
	                self.Trigger(C3.Plugins.Rex_Firebase_UserID2ID.Cnds.OnRemoveUserIDSuccessful); 
	        };
	        var on_read = function(snapshot)
	        {
	            var result = snapshot["val"]();    // { ID:UserID }
	            var return_ID = _get_key(result);
	            if (return_ID == null)
	            {
	                onComplete();
	            }
	            else
	            {
	                var ref = self.get_ID_ref(return_ID);
	                ref["set"](null, onComplete);
	            }      
	        };
	        var on_read_failure = function(error)
	        {
	            onComplete(error);
	        };        

	        var query = this.get_ref()["orderByValue"]()["equalTo"](UserID)["limitToFirst"](1);
	        query["once"]("value", on_read);
		}
	};
}