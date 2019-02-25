"use strict";
    var inc = function(a, b)
    {
        return (a > b)?  1:
               (a == b)? 0:
                         (-1);
    }; 
    var dec = function(a, b)
    {
        return (a < b)?  1:
               (a == b)? 0:
                         (-1);
    };
{
	C3.Plugins.Rex_Firebase_ItemMonitor.Cnds =
	{
		OnItemAdded()
		{
		    return true;
		}, 

		OnItemRemoved()
		{
		    return true;
		},	

		OnValueChnaged(name)
		{
		    return cr.equals_nocase(name, this.exp_LastPropertyName);
		}, 

		OnAnyValueChnaged()
		{
		    return true;
		},	
		
		OnPropertyAdded()
		{
		    return true;
		}, 

		OnPropertyRemoved()
		{
		    return true;
		},

		OnItemListChanged()
		{
		    return true;
		},	

		ForEachItemID(order)
		{
		    var itemIDList = Object.keys(this.items);
		    var sort_fn = (order == 0)? inc:dec;
		    itemIDList.sort(sort_fn);
		    return this.ForEachItemID(itemIDList, this.items);
		},	
		
		ForEachKey(itemID)
		{
		    var item_props = this.items[itemID];
		    if (item_props == null)
		        return false;
		        
	        var current_frame = runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = runtime.GetEventSheetManager().GetEventStack();
	        var p = runtime.GetEventStack(); 
	        var h = c.Push(current_event);
			
			var k, o=item_props;
			for(k in o)
			{
	            if (solModifierAfterCnds)
	            {
	                runtime.GetEventSheetManager().PushCopySol(solmod);
	            }
	            
	            this.exp_CurKey = k;
	            this.exp_CurValue = o[k];
	            current_event.Retrigger(current_frame,h);
	            
			    if (solModifierAfterCnds)
			    {
			        runtime.GetEventSheetManager().PopSol(solmod);
			    }            
			}
			p.Pop();
			    
			return false;
		}	
	};
}