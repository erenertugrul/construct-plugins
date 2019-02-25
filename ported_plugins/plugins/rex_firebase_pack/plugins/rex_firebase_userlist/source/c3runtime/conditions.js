"use strict";

{
	C3.Plugins.Rex_Firebase_Userlist.Cnds =
	{

		OnReceivingAllLists()
		{
		    return true;
		},	

		ForEachUserIDInList(list_name)
		{
		    if (!this.userLists.hasOwnProperty(list_name))
		        return false;

	    	var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	   		var current_event = current_frame.GetCurrentEvent();
	   		var solmod = current_event.GetSolModifiers();
	    	var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	    	var c = this._runtime.GetEventSheetManager().GetEventStack();
	    	var p = this._runtime.GetEventStack(); 
	    	var h = c.Push(current_event); 
			var k;
			for (k in user_list)
			{
	            if (solModifierAfterCnds)
	            {
		            this._runtime.GetEventSheetManager().PushCopySol(solmod);
	            }

	            this.exp_CurUserID = k;
		    	current_event.Retrigger(current_frame,h);
	            
			    if (solModifierAfterCnds)
			    {
		            this._runtime.GetEventSheetManager().PopSol(solmod);
			    }   
			}
	      	p.Pop();
		    return false;
		},
		
		UserIDInList(id, list_name)
		{
		    if (!this.userLists.hasOwnProperty(list_name))
		        return false;
		    
		    return this.userLists[list_name].hasOwnProperty(id);
		}
	};
}