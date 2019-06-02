"use strict";

{
	C3.Behaviors.Rex_Zigzag.Exps =
	{
	    Activated()
	    {
	        return(this.activated);
	    },

	    MovSpeed()
	    {
	        return(this.CmdMove.currentSpeed);
	    },

	    MaxMovSpeed()
	    {
	        return(this.CmdMove.move["max"]);
	    },

	    MovAcc()
	    {
	        return(this.CmdMove.move["acc"]);
	    },

	    MovDec()
	    {
	        return(this.CmdMove.move["dec"]);
	    },

	    RotSpeed()
	    {
	        return(this.CmdRotate.currentSpeed);
	    },

	    MaxRotSpeed()
	    {
	        return(this.CmdRotate.move["max"]);
	    },

	    RotAcc()
	    {
	        return(this.CmdRotate.move["acc"]);
	    },

	    RotDec()
	    {
	        return(this.CmdRotate.move["dec"]);
	    },

	    Rotatable()
	    {
	        return(this.CmdRotate.rotatable);
	    },

	    RepCnt()
	    {
	        return(this.CmdQueue.repeatCountSave);
	    },

	    CmdIndex()
	    {
	        return(this.CmdQueue.currentCmdQueueIndex);
	    },

	    MovAngle()
	    {
	        var angle;
	        if (isValidCmd(this.currentCmd, 2) || isValidCmd(this.currentCmd, 3)) {
	            angle = this.CmdRotate.currentAngleDeg;
	            if (angle < 0)
	                angle = 360 + angle;
	        } else
	            angle = to_clamped_degrees(this.positionData["a"]);
	        return(angle);
	    }
	};
}