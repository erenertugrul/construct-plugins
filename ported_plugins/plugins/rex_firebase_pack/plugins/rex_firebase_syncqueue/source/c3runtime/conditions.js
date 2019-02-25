"use strict";

{
	C3.Plugins.Rex_Firebase_SyncQueue.Cnds =
	{
		OnGetData()
		{
		    return true;
		},
	    
		OnGetInputData()
		{
		    this.has_input_handler = true;
		    return true;
		}
	};
}