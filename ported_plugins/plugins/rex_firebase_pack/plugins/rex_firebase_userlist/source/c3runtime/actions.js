"use strict";

{
	C3.Plugins.Rex_Firebase_Userlist.Acts =
	{
 
	   SetOwner(id)
		{
	        this.close_owner_listener();
	        this.owner_userID = id;
	        // clean current local user lists
	        clean_table(this.userLists);
	        
	        this.setup_owner_listener();
		},
		
	   RequestAllLists()
		{
	        if (this.owner_userID==="")
	            return;            
	                
	        var user_ref = this.get_ref(this.owner_userID);
	        var self = this;
	        var on_read = function (snapshot)
	        {
	            var l = snapshot["val"]();
	            if (l === null)
	                clean_table(self.userLists);
	            else
	                self.userLists = l;

	            self.Trigger(C3.Plugins.Rex_Firebase_Userlist.Cnds.OnReceivingAllLists);
	        };
	        
	        user_ref["once"]("value", on_read); 
		},
		
	   AddUserIn2Sides(target_id, owner_list, target_list)
		{
	        if (this.owner_userID==="")
	            return;
	            
	        this.userList_addUser(this.owner_userID, owner_list, target_id);
	        this.userList_addUser(target_id, target_list, this.owner_userID);
		},	
		
	   RemoveUserFrom2Sides (target_id, owner_list, target_list)
		{
	        if (this.owner_userID==="")
	            return;

	        this.userList_removeUser(this.owner_userID, owner_list, target_id);
	        this.userList_removeUser(target_id, target_list, this.owner_userID);
		},
			
	   AddUser(target_id, list_name)
		{
	        if (this.owner_userID==="")
	            return;
	            
	        this.userList_addUser(this.owner_userID, list_name, target_id);
		},	
		
	   RemoveUser(target_id, list_name)
		{
	        if (this.owner_userID==="")
	            return;

	        this.userList_removeUser(this.owner_userID, list_name, target_id); 
		},

	   InviteUser(target_id, owner_list, target_list, msg)
		{
	        if (this.owner_userID==="")
	            return;
	             
	        var inviter_ref = this.get_inviter_list_ref(target_id)["child"](this.owner_userID);
	        var invite_info = {"inviter-id":this.owner_userID,
	                           "inviter-list":owner_list,
	                           "my-list": target_list,
	                           "message":msg,                           
	                          };
	        inviter_ref["set"](invite_info);        
		},	
		
	   ResponseInvitation(inviter_id, is_accept)
		{
	        if (this.owner_userID==="")
	            return;
	            
	        var inviter_ref = this.get_inviter_list_ref(this.owner_userID)["child"](inviter_id);
	        var self = this;
	        var on_read = function (snapshot)
	        {
	            var invite_info = snapshot["val"]();
	            if (invite_info === null)
	                return;
	            
	            if (is_accept == 1)
	            {
	                self.userList_addUser(self.owner_userID, invite_info["my-list"], invite_info["inviter-id"]);
	                self.userList_addUser(invite_info["inviter-id"], invite_info["inviter-list"], self.owner_userID);
	            }
	            inviter_ref["remove"]();
	        };
	        inviter_ref["once"]("value", on_read);        
		},

	   CancelInvitation(target_id)
		{
	        if (this.owner_userID==="")
	            return;
	             
	        var inviter_ref = this.get_inviter_list_ref(target_id)["child"](this.owner_userID);
	        inviter_ref["remove"]();        
		},

	   RemoveMembership(target_id, owner_list, target_list)
		{
	        if (this.owner_userID==="")
	            return;
	            
	        this.userList_removeUser(this.owner_userID, owner_list, target_id);        
	        var remove_notify_ref = this.get_cancel_notify_ref(target_id)["child"](this.owner_userID);
	        var cancel_info = {"cancel-id":this.owner_userID,
	                           "my-list": target_list                
	                          };
	        remove_notify_ref["set"](cancel_info);        
		}
	};
}