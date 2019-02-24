"use strict";

{
	C3.Plugins.Rex_CSV2Dictionary.Cnds =
	{
		ForEachCell(csv_string)
		{
		    var table = CSVToArray(csv_string, this.strDelimiter);
		  		var i, cnt = table.length;
				if (cnt == 0){
				    return false;			
				}
		    
	    	var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	   		var current_event = current_frame.GetCurrentEvent();
	   		var solmod = current_event.GetSolModifiers();
	    	var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	    	var c = this._runtime.GetEventSheetManager().GetEventStack();
	    	var p = this._runtime.GetEventStack(); 
	    	var h = c.Push(current_event);  
			var entry, v;               
		    if (solModifierAfterCnds)
		    {
		        for (i=0; i<cnt; i++ )
		        {

		            this._runtime.GetEventSheetManager().PushCopySol(solmod);
		            entry = table[i];
		            this.exp_CurKey = entry[0];
		            this.exp_CurValue = this.value_get(entry[1]);
			    	current_event.Retrigger(current_frame,h);
					this._runtime.GetEventSheetManager().PopSol(solmod);		        
		        }
		        p.Pop();
		    }
		    else
		    {
		        for (i=0; i<cnt; i++  )
		        {
		 			entry = table[i];
		            this.exp_CurKey = entry[0];
		            this.exp_CurValue = this.value_get(entry[1]);       
		            current_event.Retrigger(current_frame,h);
		        }
		        p.Pop();         
		    }

		    return false;
		}
	};
}