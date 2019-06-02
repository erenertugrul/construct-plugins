"use strict";

{
	C3.Behaviors.Rex_Zigzag.Instance = class Rex_ZigzagInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			this.inst = this._inst;
	        this.currentCmd = null;
	        this.isMyCall = false;
			
			if (properties)
			{
		        this.activated = properties[0];
		        this.isRun = (properties[1] == 1);
		        var isRotatable = (properties[2] == 1);
		        var preciseMode = (properties[12] == 1);
		        var continuedMode = (properties[13] == 1);
		        var initAngle = (isRotatable) ? this.inst.GetWorldInfo().GetAngle() : to_clamped_radians(properties[11]);
                this.CmdQueue = new CmdQueue(properties[3]);
            	this.CmdMove = new CmdMoveKlass(this.inst,properties[5],properties[6],properties[7],preciseMode,continuedMode);
            	this.CmdRotate = new CmdRotateKlass(this.inst,isRotatable,properties[8],properties[9],properties[10],preciseMode,continuedMode);
            	this.CmdWait = new CmdWaitKlass(continuedMode);
            	this.AddCommandString(properties[4]);
			}
			this.positionData = {
                "x": 0,
                "y": 0,
                "a": 0
            };
            this.cmdMap = {
                "M": this.CmdMove,
                "R": this.CmdRotate,
                "W": this.CmdWait
            };

        	this.positionData["x"] = this.inst.GetWorldInfo().GetX();
        	this.positionData["y"] = this.inst.GetWorldInfo().GetY();
            this.positionData["a"] = initAngle;
			
			// Opt-in to getting calls to Tick()
			this._StartTicking();
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
	            "en": this.activated,
	            "ir": this.isRun,
	            "ps": this.positionData,
	            "cq": this.CmdQueue.saveToJSON(),
	            "cc": this.currentCmd,
	            "cm": this.CmdMove.saveToJSON(),
	            "cr": this.CmdRotate.saveToJSON(),
	            "cw": this.CmdWait.saveToJSON(),
			};
		}

		LoadFromJson(o)
		{
	        this.activated = o["en"];
	        this.isRun = o["ir"];
	        this.positionData = o["ps"];
	        this.CmdQueue.loadFromJSON(o["cq"]);
	        this.currentCmd = o["cc"];
	        this.CmdMove.loadFromJSON(o["cm"]);
	        this.CmdRotate.loadFromJSON(o["cr"]);
	        this.CmdWait.loadFromJSON(o["cw"]);

	        if (this.currentCmd != null) // link to cmd object
	        {
	            var cmd = this.cmdMap[this.currentCmd["cmd"]];
	            cmd.target = this.positionData;
	        }
		}
		
		
		Tick()
		{
			var dt = this._runtime.GetDt(this._inst);
			const wi = this._inst.GetWorldInfo();
			
			if ((this.activated == 0) || (!this.isRun))
            return;

	        var cmd;
	        while (dt) {
	            if (this.currentCmd == null) // try to get new cmd
	            {
	                this.currentCmd = this.CmdQueue.GetCmd();
	                if (this.currentCmd != null) {
	                    // new command start
	                    cmd = this.cmdMap[this.currentCmd["cmd"]];
	                    cmd.CmdInit(this.positionData, this.currentCmd["param"], this.currentCmd["speed"]);
	                    this.isMyCall = true;
	                    this.Trigger(C3.Behaviors.Rex_Zigzag.Cnds.OnCmdStart);
	                    this.isMyCall = false;
	                } else {
	                    // command queue finish
	                    this.isRun = false;
	                    this.isMyCall = true;
	                    this.Trigger(C3.Behaviors.Rex_Zigzag.Cnds.OnCmdQueueFinish);
	                    this.isMyCall = false;
	                    break;
	                }
	            } else {
	                cmd = this.cmdMap[this.currentCmd["cmd"]];
	            }

	            dt = cmd.Tick(dt);
	            if (cmd.isDone) {
	                // command finish
	                this.isMyCall = true;
	                this.Trigger(C3.Behaviors.Rex_Zigzag.Cnds.OnCmdFinish);
	                this.isMyCall = false;
	                this.currentCmd = null;
	            }
	        }
		}
	    AddCommand(cmd, param) 
	    {
	        this.CmdQueue.Push(transferCmd(cmd, param));
	    }

	    AddCommandString(cmdString) 
	    {
	        if (cmdString != "")
	            this.CmdQueue.PushList(parseCmdString(cmdString));
	    }
		
	};
}