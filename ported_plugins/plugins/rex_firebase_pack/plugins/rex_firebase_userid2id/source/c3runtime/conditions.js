"use strict";

{
	C3.Plugins.Rex_Firebase_UserID2ID.Cnds =
	{
		OnRequestIDSuccessful()
		{
		    return true;
		}, 	

		OnRequestIDError()
		{
		    return true;
		}, 
		
		OnRequestUserIDSuccessful()
		{
		    return true;
		}, 	

		OnRequestUserIDError()
		{
		    return true;
		}, 
		
		OnRemoveUserIDSuccessful()
		{
		    return true;
		}, 	

		OnRemoveUserIDError()
		{
		    return true;
		} 
	};
}