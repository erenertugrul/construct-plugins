"use strict";

{
	C3.Behaviors.Rex_Zigzag.Cnds =
	{
	    CompareMovSpeed(cmp, s) 
	    {
	        return do_cmp(this.CmdMove.currentSpeed, cmp, s);
	    },

	    CompareRotSpeed(cmp, s) 
	    {
	        return do_cmp(this.CmdRotate.currentSpeed, cmp, s);
	    },

	    IsCmd(_cmd) 
	    {
	        return isValidCmd(this.currentCmd, _cmd);
	    },

	    OnCmdQueueFinish() 
	    {
	        return (this.isMyCall);
	    },

	    OnCmdStart(_cmd) 
	    {
	        return (isValidCmd(this.currentCmd, _cmd) && this.isMyCall);
	    },

	    OnCmdFinish(_cmd) 
	    {
	        return (isValidCmd(this.currentCmd, _cmd) && this.isMyCall);
	    }
	};
}