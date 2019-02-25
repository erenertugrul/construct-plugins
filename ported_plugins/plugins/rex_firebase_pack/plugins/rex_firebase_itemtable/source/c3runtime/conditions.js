"use strict";

{
	C3.Plugins.Rex_Firebase_ItemTable.Cnds =
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
		
		OnLoadComplete(tag_)
		{
		    return C3.equalsNoCase(tag_, this.trig_tag);
		}, 

	    	
		ForEachItemID(order)
		{
		    var itemIDList = Object.keys(this.load_items);
		    var sort_fn = (order === 0)? inc:dec;
		    itemIDList.sort(sort_fn);
		    return this.ForEachItemID(itemIDList, this.load_items);
		},	
		
		ForEachKey(itemID)
		{
		    var item_props = this.load_items[itemID];
		    if (item_props == null)
		        return false;
		        
	    	var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	   		var current_event = current_frame.GetCurrentEvent();
	   		var solmod = current_event.GetSolModifiers();
	    	var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	    	var c = this._runtime.GetEventSheetManager().GetEventStack();
	    	var p = this._runtime.GetEventStack(); 
	    	var h = c.Push(current_event);
			
			var k, o=item_props;
			for(k in o)
			{
	            if (solModifierAfterCnds)
	            {
		            this._runtime.GetEventSheetManager().PushCopySol(solmod);
	            }
	            
	            this.exp_CurKey = k;
	            this.exp_CurValue = o[k];
		    	current_event.Retrigger(current_frame,h);
	            
			    if (solModifierAfterCnds)
			    {
	             	this._runtime.GetEventSheetManager().PopSol(solmod);
			    }            
			}
			p.Pop();

			return false;
		},	
	    
		OnCleanAllComplete()
		{
		    return true;
		}, 
		OnCleanAllError()
		{
		    return true;
		}   
	};
}