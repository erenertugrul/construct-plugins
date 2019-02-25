"use strict";

{
	C3.Plugins.Rex_Firebase_SaveSlot.Cnds =
	{
		OnSave()
		{
		    return true;
		}, 
		OnSaveError()
		{
		    return true;
		},

		OnGetAllHeaders()
		{
		    return true;
		},
		ForEachHeader(slot_name)
		{
		    if (this.load_headers == null)
			    return false;
	    	var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	   		var current_event = current_frame.GetCurrentEvent();
	   		var solmod = current_event.GetSolModifiers();
	    	var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	    	var c = this._runtime.GetEventSheetManager().GetEventStack();
	    	var p = this._runtime.GetEventStack(); 
	    	var h = c.Push(current_event);
			
			var k, o=this.exp_CurHeader;
			for(k in this.load_headers)
			{
	            if (solModifierAfterCnds)
	            {
		            this._runtime.GetEventSheetManager().PushCopySol(solmod);
	            }
	            
	            this.exp_CurSlotName = k;
	            this.exp_CurHeader = this.load_headers[k];
		    	current_event.Retrigger(current_frame,h);
	            
			    if (solModifierAfterCnds)
			    {
		             this._runtime.GetEventSheetManager().PopSol(solmod);
			    }            
			}
			p.Pop();
			    
	        this.exp_CurSlotName = "";			
	        this.exp_CurHeader = o;       		
			return false;
		},

		OnGetBody()
		{
		    return true;
		},

		OnGetUnusedBody()
		{
		    return true;
		},	

		AllSlotAreEmpty()
		{
		    if (this.load_headers == null)
		        return true;
		    	    
		    return is_empty(this.load_headers);
		},	

		IsOccupied(slot_name)
		{
		    if (this.load_headers == null)
		        return false;
		    	    
		    return this.load_headers.hasOwnProperty(slot_name);
		},		
	    
		ForEachKeyInHeader(slot_name)
		{
		    if (!this.load_headers || !this.load_headers[slot_name])
			    return false;
				
	    	var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	   		var current_event = current_frame.GetCurrentEvent();
	   		var solmod = current_event.GetSolModifiers();
	    	var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	    	var c = this._runtime.GetEventSheetManager().GetEventStack();
	    	var p = this._runtime.GetEventStack(); 
	    	var h = c.Push(current_event);
			
			var k, header = this.load_headers[slot_name];
			for(k in header)
			{
	            if (solModifierAfterCnds)
	            {
		            this._runtime.GetEventSheetManager().PushCopySol(solmod);
	            }
	            
	            this.exp_CurKey = k;
	            this.exp_CurValue = header[this.exp_CurKey];
		    	current_event.Retrigger(current_frame,h);
	            
			    if (solModifierAfterCnds)
			    {
		            this._runtime.GetEventSheetManager().PopSol(solmod);
			    }            
			}
			p.Pop();
	 		
			return false;
		},
	    
		ForEachKeyInBody()
		{
		    if (!this.load_body)
			    return false;
				
	    	var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	   		var current_event = current_frame.GetCurrentEvent();
	   		var solmod = current_event.GetSolModifiers();
	    	var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	    	var c = this._runtime.GetEventSheetManager().GetEventStack();
	    	var p = this._runtime.GetEventStack(); 
	    	var h = c.Push(current_event);
			
			for(var k in  this.load_body)
			{
	            if (solModifierAfterCnds)
	            {
		            this._runtime.GetEventSheetManager().PushCopySol(solmod);
	            }
	            
	            this.exp_CurKey = k;
	            this.exp_CurValue = this.load_body[this.exp_CurKey];
		    	current_event.Retrigger(current_frame,h);
	            
			    if (solModifierAfterCnds)
			    {
		            this._runtime.GetEventSheetManager().PopSol(solmod);
			    }            
			}
			p.Pop();
			         		
			return false;
		},    
	    
		BodyIsInvalid()
		{
		    return (this.load_body == null);
		},	
	    
		OnClean()
		{
		    return true;
		},

		OnCleanError()
		{
		    return true;
		},		
	    
		OnGetAllHeadersError()
		{
		    return true;
		},

		OnGetBodyError()
		{
		    return true;
		}	    
	    
	};
}