"use strict";

{
	C3.Plugins.Rex_Firebase_Rooms.Acts =
	{
	    SetUserInfo(userID, name)
		{
	        if (userID == "")
	        {
	            console.error("rex_firebase_rooms: UserID should not be empty string.");
	            return;
	        }
	        this.room.SetUser(userID, name);
		},

	    CreateRoom(roomName, roomType, maxPeers, lifePeriod, doorState, roomID, createThenJoin)
		{
	        this.LockedByAction = true;
	        var self = this;
	        var on_end = function ()
	        {
	            self.LockedByAction = false;
	        }
	        
		    // push a new room if roomID == ""
	        doorState = DOORSTATES[doorState];
	        createThenJoin = (createThenJoin === 1);
	        if (createThenJoin)
	        {

	            var on_create = function (error)
	            {           
	                if ((roomID !== "") && error)
	                {
	                    self.room.TryJoinRoom(roomID, on_end);
	                }
	            };
	            
	            var on_left = function (error)
	            {
	                if (error)
	                {
	                    on_end();
	                    return;               
	                }
	                
	                setTimeout(function()
	                {
	                    self.room.TryCreateRoom(roomName, roomType, maxPeers, lifePeriod, doorState, roomID, createThenJoin, on_create);
	                }, LEAVEDELAY);
	            }
	            
	            if (this.room.IsInRoom())
	            {
	                this.room.LeaveRoom(on_left);
	            }
	            else
	                this.room.TryCreateRoom(roomName, roomType, maxPeers, lifePeriod, doorState, roomID, createThenJoin, on_create);
	            
	        }
	        else  // create room only
	        {
	            this.room.TryCreateRoom(roomName, roomType, maxPeers, lifePeriod, doorState, roomID, createThenJoin, on_end);
	        }        
		}, 
		
	    SwitchDoor(doorState)
		{
	        doorState = DOORSTATES[doorState];        
	        this.room.SwitchDoor(doorState);
		},     
		
	    JoinRoom(roomID, leftThenJoin)
		{      
	        this.LockedByAction = true;
	        var self = this;
	        var on_end = function ()
	        {
	            self.LockedByAction = false;
	        };
	        
	        var try_join = function (error)
	        {
	            if (error || (roomID === ""))
	            {
	                on_end();
	                self.run_room_trigger(C3.Plugins.Rex_Firebase_Rooms.Cnds.OnJoinRoomError, "", "");     
	                return;
	            }
	            
	            setTimeout(function()
	            {
	                self.room.TryJoinRoom(roomID, on_end);
	            }, LEAVEDELAY);
	        }
	         
	        if (leftThenJoin===0)
	            try_join();
	        else
	            this.room.LeaveRoom(try_join);
		},   
	     
	    LeaveRoom()
		{
	        this.LockedByAction = true;
	        var self = this;
	        var on_end = function ()
	        {
	            self.LockedByAction = false;
	        };
	        
	        this.room.LeaveRoom(on_end);
		},   
	     	
		
	    KickUser(userID)
		{
	        this.room.KickUser(userID);
		},

	    
	    UpdateOpenRoomsList(roomType)
		{
	        this.roomsList.UpdateOpenRoomsList(roomType);
		},
		
	    StopUpdatingOpenRoomsList()
		{
	        this.roomsList.StopUpdatingOpenRoomsList();
		},	

	    
	    PermissionListAdd(userID, name, listType)
		{
	        var listName = (listType === 1)? "black-list" : "white-list";
	        this.room.SetPermissionList(listName, userID, name);
		},		
	    PermissionListRemove(userID, listType)
		{
	        var listName = (listType === 1)? "black-list" : "white-list";        
	        this.room.SetPermissionList(listName, userID, null);
		},

	    RequestMetadata()
		{
	        this.room.RequestMetadata();
		},
		
	    RequestUserMetadata(userID)
		{
	        
		},   	    
	    
	    JoinRandomRoom(leftThenJoin, retry)
		{
	        var roomID = "";
	        
	        this.LockedByAction = true;
	        var self = this;
	        var on_end = function (failed)
	        {
	            self.LockedByAction = false;
	            
	            if (failed)
	            {
	                self.run_room_trigger(C3.Plugins.Rex_Firebase_Rooms.Cnds.OnJoinRoomError, "", "");     
	            }
	            else
	            {
	                var roomName = self.room.roomName;
	                var roomID = self.room.roomID;
	                self.run_room_trigger(C3.Plugins.Rex_Firebase_Rooms.Cnds.OnJoinRoom, roomName, roomID);                     
	            }
	        };          
	        
	        // step 3. join room success, or retry
	        var on_join = function (error)
	        {
	            if (error)
	                main();
	            else
	                on_end();
	        };          
	        // step 3. join room success, or retry        
	        
	        // step 2. try join room, left then join   
	        var try_join = function (error)
	        {
	            if (error || (roomID === ""))
	            {
	                on_end(true);
	                return;
	            }
	            
	            setTimeout(function()
	            {            
	                self.room.TryJoinRoom(roomID, on_join, true);  // ignore trigger
	            }, LEAVEDELAY);
	        }
	        // step 2. try join room, left then join            
	        
	        // step 1. try join a random room
	        var main = function ()
	        {
	            if (retry < 0)
	            {
	                on_end(true);
	                return;
	            }
	            
	            retry -= 1;
	            var rooms = self.roomsList.GetRooms();
	            var idx = Math.floor( Math.random() * rooms.length );
	            var room = rooms[idx];
	            roomID = (room)? room["roomID"]:"";
	            
	            if (leftThenJoin===0)
	                try_join();
	            else
	                self.room.LeaveRoom(try_join);      
	        }
	        // step 1. try join a random room
	        
	        main();
		}, 

	    GetUsersList(roomID)
		{
	        var on_read = function (snapshot)
	        {
	            var val = snapshot["val"]();
	        }

	        var usersList_ref = this.get_roomUser_ref(roomID);  
	        usersList_ref["once"]("value", on_read);
		}     
	};
}