"use strict";

{
	C3.Plugins.Rex_CSV2Array.Cnds =
	{
	    ForEachCell(csv_string)
	    {
	        var table = CSVToArray(csv_string, this.strDelimiter);
	        var y_cnt = table.length;
	        var x_cnt = table[0].length;
	        var i,j;
	        
	    	var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	   		var current_event = current_frame.GetCurrentEvent();
	    	var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	    	var c = this._runtime.GetEventSheetManager().GetEventStack();
	    	var h = c.Push(current_event);    
	        this.exp_Width = x_cnt;
	        this.exp_Height = y_cnt;                
	        if (solModifierAfterCnds)
	        {
	            for (j=0; j<y_cnt; j++ )
	            {
	                this.exp_CurY = j;              
	                for (i=0; i<x_cnt; i++ )
	                {
	                    this._runtime.GetEventSheetManager().GetEventStack().PushCopySol(current_event.solModifiers);
	                    
	                    this.exp_CurX = i;
	                    this.exp_CurValue = this.value_get(table[j][i]);                    
	                    current_event.Retrigger(current_frame,h);
	                    
	                    this._runtime.GetEventSheetManager().GetEventStack().PopSol(current_event.solModifiers);
	                }
	            }   
	        }
	        else
	        {
	            for (j=0; j<y_cnt; j++ )
	            {
	                this.exp_CurY = j;              
	                for (i=0; i<x_cnt; i++ )
	                {
	                    this.exp_CurX = i;
	                    this.exp_CurValue = this.value_get(table[j][i]);        
	                    current_event.Retrigger(current_frame,h);

	                }
	            }           
	        }

	        return false;
	    }
	};
}