"use strict";

{
	C3.Plugins.Rex_Firebase_Userlist.Instance = class Rex_Firebase_UserlistInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
		
	        this.owner_userID = "";
	        this.userLists = {};
	        this.exp_CurUserID = "";
	        this.CurUserInfo = null;
	        this.inviter_lists = null;
	        this.listener_refs = [];
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
		    if (k.substring(0,8) == "https://")
		        path = k;
		    else
		        path = this.rootpath + k + "/";
		        
	        return new window["Firebase"](path);
		}
		
		get_list_ref(userId, list_name)
		{	    
	        return this.get_ref(userId + "/lists/" + list_name);
		}
	    
		get_inviter_list_ref(userId)
		{	    
	        return this.get_ref(userId)["child"]("invite");
		}    
	    
		get_cancel_notify_ref(userId)
		{	    
	        return this.get_ref(userId)["child"]("cancel");
		}
	    
	    userList_addUser (owner_id, list_name, target_id)
		{
	        var list_ref = this.get_list_ref(owner_id, list_name);
	        list_ref["child"](target_id)["set"](true);   
		}

	    userList_removeUser (owner_id, list_name, target_id)
		{
	        var list_ref = this.get_list_ref(owner_id, list_name);
	        list_ref["child"](target_id)["remove"]();     
		}   

	    setup_owner_listener ()
		{
	        this.setup_cancel_listener();
		} 
	    
	    close_owner_listener ()
		{
	        var i, cnt=this.listener_refs.length;
	        for (i=0; i<cnt; i++)
	            this.listener_refs[i]["off"]();
		}   
	    
	    setup_cancel_listener ()
		{
	        var remove_notify_ref = this.get_cancel_notify_ref(this.owner_userID);
	        var self = this;
	        var on_cancel = function (snapshot)
	        {
	            var info = snapshot["val"]();
	            if (info === null)
	                return;
	            
	            var user_ref = self.get_list_ref(self.owner_userID, info["my-list"])["child"](info["cancel-id"]);
	            user_ref["remove"]();
	            remove_notify_ref["child"](info["cancel-id"])["remove"]();
	        };
	        remove_notify_ref["on"]("child_added", on_cancel);
	        this.listener_refs.push(remove_notify_ref);
		}     
	
	};
}