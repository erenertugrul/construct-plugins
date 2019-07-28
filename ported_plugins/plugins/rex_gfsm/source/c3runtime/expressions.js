"use strict";

{
	C3.Plugins.Rex_FSM.Exps =
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