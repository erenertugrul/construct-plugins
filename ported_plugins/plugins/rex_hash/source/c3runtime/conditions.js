"use strict";

{
	C3.Plugins.Rex_Hash.Cnds =
	{
		ForEachItem(key)
		{
	        var entry = this.getEntry(key);
	        
	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event);

	        var key, value;
	        this.exp_Loopindex = -1;
			for (key in entry)
		    {
	            if (solModifierAfterCnds)
			        this._runtime.GetEventSheetManager().PushCopySol(solmod);
	            
	            this.exp_CurKey = key;
	            this.exp_CurValue = entry[key];	
	            this.exp_Loopindex ++;              
				current_event.Retrigger(current_frame,h);
	          
				
	            if (solModifierAfterCnds)            
				    this._runtime.GetEventSheetManager().PopSol(solmod);
			}	
	        p.Pop();
	        this.exp_CurKey = "";
	        this.exp_CurValue = 0;      
			return false;
		}, 

		KeyExists(keys)
		{
		    if (keys == "")
	            return false;
	        var data = this.getValue(keys);		    
	        return (data !== undefined);
		}, 	

		IsEmpty(keys)
		{
	        var entry = this.getEntry(keys);
	        var cnt = getItemsCount(entry);		    
	        return (cnt <= 0);
		} 	
	};
}