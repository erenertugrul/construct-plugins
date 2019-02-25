"use strict";

{
	C3.Plugins.Rex_Firebase_SingleLogin.Acts =
	{
	    SetDomainRef(domain_ref, sub_domain_ref)
		{
			this.rootpath = domain_ref + "/" + sub_domain_ref + "/";
		},
		
	    Login(userID)
		{
	        this.login(userID);
		},
	 
	    LoggingOut()
		{ 
		    this.loggingOut();
		},
		
	    KickByIndex(index)
		{
	        if (this.loginList === null)
	            return false;
	        
	        var item = this.loginList.GetItems()[index];
	        if (!item)
	            return;
	        
	        var loginID = item[this.loginList.keyItemID];
		    var loginRef = this.get_ref(this.myUserID)["child"](loginID);
		    loginRef["remove"]();
		}
	};
}