"use strict";

{
	C3.Plugins.Rex_Firebase_Rooms.Instance = class Rex_Firebase_RoomsInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
		    // room
	        this.room = new RoomMgrKlass(this);

	        // room list
	        this.roomsList = new RoomsListKlass(this);
	        // user list
	        this.usersList = this.room.usersList;
			
			if (properties)		// note properties may be null in some cases
			{
         		this.rootpath = properties[0] + "/" + properties[1] + "/";   
       		 	this.room.doorAutoControl = (properties[2] === 1);
			}
	        this.LockedByAction = false;        
		    this.triggeredRoomName = "";
		    this.triggeredRoomID = "";  
		    this.triggeredUserName = "";
		    this.triggeredUserID = "";     
	        this.exp_CurRoom = null;
	        this.exp_CurUser = null;  
	        this.exp_LoopIndex = 0;        
		      

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
	    
	   
	        
	    get_room_ref(roomID)
	    {
	        var ref = this.get_ref("rooms");
	        if (roomID)
	            ref = ref["child"](roomID);
	        return ref;
	    }    
	    
	    get_roomUser_ref(roomID, joinAt)
	    {
	        var ref = this.get_room_ref(roomID)["child"]("users");
	        if (joinAt != null)
	            ref = ref["child"](joinAt);
	        return ref;
	    }
	    
	    get_roomAliveFlag_ref(roomID)
	    {
	        return this.get_room_ref(roomID)["child"]("alive");
	    }
	    
	    get_roomfilter_ref(roomID)
	    {
	        var ref = this.get_ref("room-filter");
	        if (roomID != null)
	            ref = ref["child"](roomID);
	        return ref;
	    }    
	    get_roommetadata_ref(roomID)
	    {
	        var ref = this.get_ref("room-metadata");
	        if (roomID != null)
	            ref = ref["child"](roomID);
	        return ref;
	    }
	 
	    
	    get_usermetadata_ref(userID)
	    {
	        return this.get_ref("user-metadata")["child"](userID);
	    }   
	    

	    run_room_trigger(trig, roomName, roomID)
	    {
	        // trigger next tick
	        var self=this;
	        setTimeout(function()
	        {
	            self.triggeredRoomName = roomName;
	            self.triggeredRoomID = roomID;  
	            self.Trigger(trig);               
	        }, 0);
	    }
	    run_userlist_trigger(trig, userName, userID)
	    {
	        // trigger next tick
	        var self=this;
	        setTimeout(function()
	        {        
	            self.triggeredUserName = userName;
	            self.triggeredUserID = userID;  
	            self.Trigger(trig);   
	        }, 0);            
	    } 

	};
}