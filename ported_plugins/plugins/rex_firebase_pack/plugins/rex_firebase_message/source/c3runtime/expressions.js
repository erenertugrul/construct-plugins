"use strict";

{
	C3.Plugins.Rex_Firebase_message.Exps =
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

		LastTitle()
		{
	        var title_ = null;
	        if (this.exp_LastMessage != null)
	            title_ = this.exp_LastMessage["title"];            
	        if (title_ == null)
	            title_ = "";  
	        
			return (title_);
		},

		LastContent()
		{
	        var content_ = null;
	        if (this.exp_LastMessage != null)
	            content_ = this.exp_LastMessage["content"];            
	        if (content_ == null)
	            content_ = "";  
	        
			return (content_);
		},	

		LastMessageID()
		{
	        var messageID = null;
	        if (this.exp_LastMessage != null)
	            messageID = this.exp_LastMessage["messageID"];            
	        if (messageID == null)
	            messageID = "";  
	        
			return (messageID);
		}
	};
}