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
			var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
			var c = this._runtime.GetEventSheetManager().GetEventStack();
			var h = c.Push(current_event);    
			var entry, v;               
		    if (solModifierAfterCnds)
		    {
		        for (i=0; i<cnt; i++ )
		        {

		            this._runtime.GetEventSheetManager().GetEventStack().PushCopySol(current_event.solModifiers);
		            entry = table[i];
		            this.exp_CurKey = entry[0];
		            this.exp_CurValue = this.value_get(entry[1]);
			    	current_event.retrigger();
		            this._runtime.GetEventSheetManager().GetEventStack().PopSol(current_event.solModifiers);
		        
		        }   
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
		    }

		    return false;
		}
	};
}