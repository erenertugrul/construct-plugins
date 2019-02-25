"use strict";

{
	C3.Plugins.Rex_Firebase_Token.Acts =
	{
	    SetDomainRef(domain_ref, sub_domain_ref)
		{
		    this.LeaveGroup();
			this.rootpath = domain_ref + "/" + sub_domain_ref + "/"; 
		},
		
	    JoinGroup(UserID)
		{	   	    	    
		    this.JoinGroup(UserID);
		},
		
	    LeaveGroup()
		{
		    this.LeaveGroup();
		}	
	};
}