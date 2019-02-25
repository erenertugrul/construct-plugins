"use strict";

{
	C3.Plugins.Rex_Firebase_ItemFilter.Cnds =
	{
		OnSaveComplete(tag_)
		{
		    return C3.equalsNoCase(tag_, this.trig_tag);
		}, 
		OnSaveError(tag_)
		{
		    return C3.equalsNoCase(tag_, this.trig_tag);
		},
		
		OnRemoveComplete(tag_)
		{
		    return C3.equalsNoCase(tag_, this.trig_tag);
		}, 
		OnRemoveError(tag_)
		{
		    return C3.equalsNoCase(tag_, this.trig_tag);
		},	
		
		OnRequestComplete(tag_)
		{
		    return C3.equalsNoCase(tag_, this.trig_tag);
		}, 
		
		ForEachItemID()
		{
	        var current_frame = runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = runtime.GetEventSheetManager().GetEventStack();
	        var p = runtime.GetEventStack(); 
	        var h = c.Push(current_event);
			
			var k, o=this.request_itemIDs;
			for(k in o)
			{
	            if (solModifierAfterCnds)
	            {
	                runtime.GetEventSheetManager().PushCopySol(solmod);
	            }
	            
	            this.exp_CurItemID = k;
	            current_event.Retrigger(current_frame,h);
	            
			    if (solModifierAfterCnds)
			    {
			        runtime.GetEventSheetManager().PopSol(solmod);
			    }            
			}
		    p.Pop();
	        this.exp_CurItemID = "";   		
			return false;
		}  
	};
}