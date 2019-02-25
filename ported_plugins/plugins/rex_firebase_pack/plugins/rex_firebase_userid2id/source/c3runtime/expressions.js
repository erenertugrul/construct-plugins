"use strict";

{
	C3.Plugins.Rex_Firebase_UserID2ID.Exps =
	{
		ID()
		{
			return (this.exp_ID);
		},

		UserID()
		{
			return (this.exp_UserID);
		},	
		
		LastErrorCode()
		{
	        var code;
		    if (this.error)
	            code = this.error["code"];
			return (code || "");
		}, 
		
		LastErrorMessage()
		{
	        var s;
		    if (this.error)
	            s = this.error["serverResponse"];
			return (s || "");
		}	   
	};
}