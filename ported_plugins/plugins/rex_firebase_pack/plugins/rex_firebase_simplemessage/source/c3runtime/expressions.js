"use strict";

{
	C3.Plugins.Rex_Firebase_SimpleMessage.Exps =
	{
    
		LastSenderID()
		{
	        var senderID = null;
	        if (this.exp_LastMessage != null)
	            senderID = this.exp_LastMessage["senderID"];
	        if (senderID == null)
	            senderID = "";
		    
			return (senderID);
		},  

		LastSenderName()
		{
	        var senderName = null;
	        if (this.exp_LastMessage != null)
	            senderName = this.exp_LastMessage["senderName"];
	        if (senderName == null)
	            senderName = "";            
	            
			return (senderName);
		}, 

		LastMessage()
		{
	        var message = null;
	        if (this.exp_LastMessage != null)
	            message = this.exp_LastMessage["message"];            
	        if (message == null)
	            message = "";  
	        
			return (message);
		}
	};
}