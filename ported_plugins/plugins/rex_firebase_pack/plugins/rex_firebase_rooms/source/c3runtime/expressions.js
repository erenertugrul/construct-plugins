"use strict";

{
	C3.Plugins.Rex_Firebase_Rooms.Exps =
	{

		UserName()
		{
			return (this.room.userName);
		}, 
	    
		UserID()
		{
			return (this.room.userID);
		}, 

		MyUserName()
	    {
	        return this.UserName;
	    },   
		MyUserID()
	    {
	        return this.UserID;
	    },
	    
		RoomName()
		{
			return (this.room.roomName);
		}, 
	    
		RoomID()
		{
			return (this.room.roomID);
		},    
		
		TriggeredRoomName()
		{
			return (this.triggeredRoomName);
		}, 
	    
		TriggeredRoomID()
		{
			return (this.triggeredRoomID);
		},               
	    
		CurRoomName()
		{
	        var room = this.exp_CurRoom;
	        var name = (room)? room["name"]:"";	    
			return (name);
		}, 
	    
		CurRoomID()
		{
	        var room = this.exp_CurRoom;
	        var ID = (room)? room["roomID"]:"";
			return (ID);
		}, 
	    
		CurCreatorName()
		{
	        var room = this.exp_CurRoom;
	        var name;
	        if (room)
	        {
	            var user = room["moderators"];
	            for(var ID in user)
	            {
	                name = user[ID];
	                break;
	            }                
	        }
	        if (name == null)
	            name = "";        
			return (name);
		}, 
	    
		CurCreatorID()
		{
	        var room = this.exp_CurRoom;
	        var ID;
	        if (room)
	        {
	            var user = room["moderators"];
	            for(ID in user)
	            {
	                break;
	            }                
	        }
	        if (ID == null)
	            ID = "";
			return (ID);
		},  

		Index2RoomName( index)
		{
	        var room = this.roomsList.GetRooms()[index];
	        var name = (room)? room["name"]:"";	    
			return (name);
		}, 

		Index2RoomID( index)
		{
	        var room = this.roomsList.GetRooms()[index];
	        var ID = (room)? room["roomID"]:"";	    
			return (ID);
		},    

		RoomsCount( index)
		{    
			return (this.roomsList.GetRooms().length);
		},     
	    
		CurUserName()
		{
	        var user = this.exp_CurUser;
	        var name = (user)? user["name"]:"";		    
			return (name);
		},

		CurUserID()
		{
	        var user = this.exp_CurUser;        
	        var ID = (user)? user["ID"]:"";		
			return (ID);
		},
	    
	    Index2UserName( index)
		{        
	        var user = this.usersList.usersList.GetItems()[index];
	        var name = (user)? user["name"]:"";		    
			return (name);
		},		
	    
		Index2UserID( index)
		{
	        var user = this.usersList.usersList.GetItems()[index];
	        var ID = (user)? user["ID"]:"";		
			return (ID);
		},

		TriggeredUserName()
		{
			return (this.triggeredUserName);
		},
			
		TriggeredUserID()
		{
			return (this.triggeredUserID);
		},
			
		UsersCount()
		{        
			return (this.usersList.usersList.GetItems().length);
		},   
			
		CurRoomMaxPeers()
		{        
	        var room = this.exp_CurRoom;
	        var maxPeers = (room)? (room["maxPeers"] || 0) : 0;
			return (maxPeers);
		},  
	    
	    Index2RoomMaxPeers( index)
		{        
	        var room = this.roomsList.GetRooms()[index];
	        var maxPeers = (room)? (room["maxPeers"] || 0) : 0;
			return (maxPeers);
		},	    
	    
		WhiteListToJSON()
		{
	        var permissionList;
	        
	        if (this.room.metadata)
	            permissionList = this.room.metadata["white-list"];
	        if (permissionList == null)
	            permissionList = {}
	        
			return (JSON.stringify(permissionList));
		},   

		BlackListToJSON()
		{
	        var permissionList;
	        
	        if (this.room.metadata)
	            permissionList = this.room.metadata["black-list"];
	        if (permissionList == null)
	            permissionList = {}
	        
			return (JSON.stringify(permissionList));
		},	

		ChannelRef( name, roomID)
		{
	        if (roomID == null)
	            roomID = this.room.roomID;
	        
	        var path = this.rootpath + "/rooms/" + roomID +"/";
	        if (name != null)
	            path += "channel-"+name + "/";
		    return (path);
		},	  

		LoopIndex()
		{
		    return (this.exp_LoopIndex);
		}      
	    
    
	};
}