"use strict";

{
	C3.Plugins.Rex_Firebase_SimpleMessage.Acts =
	{
	    SetDomainRef(domain_ref, sub_domain_ref)
		{
		    this.inBox.StopUpdate();        
	        
	        // clean previous outPort
		    if (this.offline_mode == OFFLMSG_DISCARD)
		    {
		        this.send_message(this.lastReceiverID, null);	        
		    }
	        this.lastReceiverID = null;  // re-build outPort in next send_message
	        
			this.rootpath = domain_ref + "/" + sub_domain_ref + "/";
		},
		    
	    SetUserInfo(userID, userName)
		{	    
	        this.userID = userID;
	        this.userName = userName; 
		},
	    StartUpdate(receiverID)
		{	   
		    if (receiverID == "")
		        return;
		    
		    var ref = this.get_ref(receiverID);
		    this.inBox.StartUpdate(ref);   
		},
	 
	    StopUpdate()
		{
		    this.inBox.StopUpdate();    
		},

	    SendMessage(receiverID, message)
		{
		    if (receiverID == "")
		        return;
		        
	        this.send_message(receiverID, message);
	        this.lastReceiverID = receiverID;        
		},   

	    CleanMessageBox(receiverID)
		{
		    if (receiverID == "")
		        return;
		    
	        this.send_message(receiverID, null);
		} 
	};
}