"use strict";

{
	C3.Plugins.Rex_Firebase_Rooms.Cnds =
	{

	    OnCreateRoom()
	    {
	        return true;
	    },  

	    OnCreateRoomError()
	    {
	        return true;
	    },
	    
	    OnJoinRoom()
	    {
	        return true;
	    },  

	    OnJoinRoomError()
	    {
	        return true;
	    },      

	    OnLeftRoom()
	    {
	        return true;
	    },  

	    OnKicked()
	    {
	        return true;
	    },

	    OnOpened()
	    {
	        return true;
	    },      

	    OnClosed()
	    {
	        return true;
	    },      
	    
	    IsInRoom()
	    {
	        return this.room.IsInRoom();
	    },  
	    
	    OnUpdateRoomsList()
	    {
	        return true;
	    },   
	    
	    ForEachRoom(start, end)
	    {        
	        return this.roomsList.ForEachRoom(start, end);
	    },  
	    
	    OnUpdateUsersList()
	    {
	        return true;
	    },  
	    
	    ForEachUser(start, end)
	    {        
	        return this.usersList.ForEachUser(start, end);
	    },      
	    
	    OnUserJoin()
	    {
	        return true;
	    },              
	    
	    OnUserLeft()
	    {
	        return true;
	    },      
	    
	    IsFirstUser()
	    {
	        return this.usersList.isFirstUser();
	    },      
	    
	    IsFull()
	    {
	        return this.usersList.IsFull();
	    },      
	    
	    OnBecomeFirstUser()
	    {
	        return true;
	    },      

	    ForEachUserInPermissionList(listType)
	    {        
	        var listName = (listType === 1)? "black-list" : "white-list";
	        var permissionList = (this.room.metadata)? this.room.metadata[listName] : null;
	        if (permissionList == null)
	            return false;
	        
	            
	    	var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	   		var current_event = current_frame.GetCurrentEvent();
	   		var solmod = current_event.GetSolModifiers();
	    	var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	    	var c = this._runtime.GetEventSheetManager().GetEventStack();
	    	var p = this._runtime.GetEventStack(); 
	    	var h = c.Push(current_event);
	        
	        var userID, user;
	        this.exp_CurUser = {};
	        this.exp_LoopIndex = -1;
	        for(userID in permissionList)
	        {
	            if (solModifierAfterCnds)
	            {
	                this._runtime.GetEventSheetManager().PushCopySol(solmod);
	            }
	            
	            this.exp_CurUser["ID"] = userID
	            this.exp_CurUser["name"] = permissionList[userID];
	            this.exp_LoopIndex ++;            
	            current_event.Retrigger(current_frame,h);

	            
	            if (solModifierAfterCnds)
	            {
	                this._runtime.GetEventSheetManager().PopSol(solmod);
	            }            
	        }
	        p.Pop();

	        this.exp_CurUser = null;
	        return false;
	    },      
	    
	    IsLocked()
	    {
	        return this.LockedByAction;
	    },  
	        
	    OnGetUsersList()
	    {
	        return true;
	    }
	};
}