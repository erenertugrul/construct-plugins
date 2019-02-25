"use strict";

{
	C3.Plugins.Rex_Firebase_message.Acts =
	{
	    SetUserInfo(userID, userName)
		{	    
	        this.userID = userID;
	        this.userName = userName; 
		},    
	    StartUpdate()
		{
		    this.start_update();
		},
	 
	    StopUpdate()
		{ 
		    this.stop_update();
		},

	    Send(receiverID, title_, content_)
		{
		    this.send(receiverID, title_, content_);
		}  
	};
}