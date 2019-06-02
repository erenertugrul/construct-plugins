"use strict";

{
	C3.Behaviors.Rex_Zigzag.Acts =
	{
	    SetActivated(s)
	    {
	        this.activated = s;
	    },

	    Start() {
	        this.currentCmd = null;
	        this.isRun = true;
	        this.CmdQueue.Reset();
	        // update positionData
	        this.positionData["x"] = this.inst.GetWorldInfo().GetX();
	        this.positionData["y"] = this.inst.GetWorldInfo().GetY();
	        if (this.CmdRotate.rotatable)
	            this.positionData["a"] = this.inst.GetWorldInfo().GetAngle();
	    },

	    Stop() {
	        this.currentCmd = null;
	        this.isRun = false;
	    },

	    SetMaxMovSpeed(s)
	    {
	        this.CmdMove.move["max"] = s;
	    },

	    SetMovAcceleration(s)
	    {
	        this.CmdMove.move["acc"] = s;
	    },

	    SetMovDeceleration(s)
	    {
	        this.CmdMove.move["dec"] = s;
	    },

	    SetMaxRotSpeed(s)
	    {
	        this.CmdRotate.move["max"] = s;
	    },

	    SetRotAcceleration(s)
	    {
	        this.CmdRotate.move["acc"] = s;
	    },

	    SetRotDeceleration(s)
	    {
	        this.CmdRotate.move["dec"] = s;
	    },

	    SetRepeatCount(s)
	    {
	        this.CmdQueue.repeatCount = s;
	        this.CmdQueue.repeatCountSave = s;
	    },

	    CleanCmdQueue() 
	    {
	        this.CmdQueue.CleanAll();
	    },

	    
	    AddCmd(_cmd, param) 
	    {
	        this.AddCommand(index2NameMap[_cmd], param);
	    },

	    AddCmdString(cmdString) 
	    {
	        this.AddCommandString(cmdString);
	    },

	    SetRotatable(s)
	    {
	        this.CmdRotate.rotatable = (s == 1);
	    },

	    SetMovingAngle(s)
	    {
	        var _angle = to_clamped_radians(s);
	        this.positionData["a"] = _angle;
	        if (this.CmdRotate.rotatable) {
	            inst.GetWorldInfo().SetAngle(_angle);
	            this.inst.SetBboxChanged();
	        }
	    },

	    SetPrecise(s)
	    {
	        var preciseMode = (s == 1);
	        this.CmdMove.preciseMode = preciseMode;
	        this.CmdRotate.preciseMode = preciseMode;
	    }
	};
}