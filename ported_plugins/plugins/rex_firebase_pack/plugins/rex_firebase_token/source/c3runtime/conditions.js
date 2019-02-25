"use strict";

{
	C3.Plugins.Rex_Firebase_Token.Cnds =
	{
		OnGetToken()
		{
		    return true;
		},
	    
		OnTokenOwnerChanged()
		{
		    return true;
		},
		
		IsOwner()
		{
		    return (this.token.IsInGroup() && this.token.IsOwner());
		}, 
		
		OnReleaseToken()
		{
		    return true;
		}
	};
}