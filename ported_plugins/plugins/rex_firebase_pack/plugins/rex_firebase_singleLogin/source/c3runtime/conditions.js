"use strict";

{
	C3.Plugins.Rex_Firebase_SingleLogin.Cnds =
	{
		OnLoginSuccess  ()
		{
		    return true;
		},
		
		OnLoginError  ()
		{
		    return true;
		},	
	    
		OnKicked  ()
		{
		    return true;
		},	
		
		OnLoginListChanged  ()
		{
		    return true;
		},	    
	    
		ForEachLogin  ()
		{	     
	        if (this.loginList === null)
	            return false;
	        
			return this.loginList.ForEachItem(this._runtime);
		}   
	};
}