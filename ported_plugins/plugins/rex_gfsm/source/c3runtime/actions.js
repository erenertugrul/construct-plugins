"use strict";

{
	C3.Plugins.Rex_FSM.Acts =
	{
		SetActivated(s)
		{
			this.activated = (s==1);
		},     
		
	    Request()
		{
	        if (!this.activated)
	            return;

	        this.fsm.Request();
		},  
	    
	    GotoState(new_state)
		{
	        if (!this.activated)
	            return;
	   
		    this.fsm.Request(new_state);
		},     

		NextStateSet(state)
		{
	        this.next_state = state;
		}  
	};
}