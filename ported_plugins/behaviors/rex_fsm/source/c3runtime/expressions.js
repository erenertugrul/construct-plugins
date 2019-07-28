"use strict";

{
	C3.Behaviors.Rex_FSM.Exps =
	{
		CurState()
		{
		    return(this.fsm.CurState);
		},
		
		PreState()
		{
		    return(this.fsm.PreState);
		}
	};
}