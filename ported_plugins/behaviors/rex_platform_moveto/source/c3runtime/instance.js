"use strict";

{
	C3.Behaviors.Rex_Platform_MoveTo.Instance = class Rex_Platform_MoveToInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			this.wi = this._inst.GetWorldInfo();
			this.inst = this._inst;

			this.platformBehaviorInst = null;
			
			this.isMoving = false;
			this.target = {
				"m": 0,       // 0: x mode , 1: distance mode
				"dir": 0, // 0:left , 1: right
				"x": 0,
				"y": 0,
				"d": 0,
				"ds": 0
			};
			this.isMyCall = false;
			if (properties)
			{
				this.activated = properties[0];
			}

			


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
				"im": this.isMoving,
				"t": clone(this.target),
			};
		}

		LoadFromJson(o)
		{
			this.activated = o["en"];
			this.isMoving = o["im"];
			this.target = o["t"];
		}
		
		getPlatformBehaviorInst() 
		{
			if (this.platformBehaviorInst != null)
				return this.platformBehaviorInst;

			if (!C3.Behaviors.Platform) {
				return;
			}
			var behavior_insts = this.inst.GetBehaviorInstances();
			var i, len = behavior_insts.length;
			for (i = 0; i < len; i++) {
				if (behavior_insts[i].GetObjectInstance().GetBehaviorInstanceFromCtor(C3.Behaviors.Platform)) {
					this.platformBehaviorInst = behavior_insts[i];
					return this.platformBehaviorInst;
				}
			}
			
			return;
		}
		move(dir)   // 0: left , 1: right
		{
			var platformBehaviorInst = this.getPlatformBehaviorInst();
			C3.Behaviors.Platform.Acts.SimulateControl.call(platformBehaviorInst.GetSdkInstance(), dir);
		}
		Tick()
		{
			/*
			const wi = this._inst.GetWorldInfo();
			*/
			const dt = this._runtime.GetDt(this._inst);
			if ((!this.activated) || (!this.isMoving)) {
				return;
			}

			var is_hit_target = false;
			if (this.target["m"] == 0)       // x mode
			{
				if (((this.target["dir"] == 1) && (this.wi.GetX() >= this.target["x"])) ||
					((this.target["dir"] == 0) && (this.wi.GetX() <= this.target["x"])))
					is_hit_target = true;
				else
					this.move(this.target["dir"]);
			}
			else if (this.target["m"] == 1)    // distance mode
			{
				var x = this.wi.GetX();
				var y = this.wi.GetY();
				this.target["ds"] += C3.distanceTo(this.target["x"], this.target["y"], x, y);
				if (this.target["ds"] >= this.target["d"])
					is_hit_target = true;
				else {
					this.move(this.target["dir"]);
					this.target["x"] = x;
					this.target["y"] = y;
				}
			}

			if (is_hit_target) {
				this.isMoving = false;
				this.isMyCall = true;
				this.Trigger(C3.Behaviors.Rex_Platform_MoveTo.Cnds.OnHitTarget, this.inst);
				this.isMyCall = false;
			}
	
		}
		SetTargetPos(_x) 
		{
			this.isMoving = true;
			this.target["m"] = 0;
			this.target["dir"] = (_x > this.wi.GetX()) ? 1 : 0;
			this.target["x"] = _x;
			this.target["y"] = 0;
			this.target["d"] = 0;
			this.target["ds"] = 0;
		}

		SetTargetPosByDistance(distance, dir) 
		{
			this.isMoving = true;
			this.target["m"] = 1;
			this.target["dir"] = dir;
			this.target["x"] = this.wi.GetX();
			this.target["y"] = this.wi.GetY();
			this.target["d"] = distance;
			this.target["ds"] = 0;
		}

		
	};
}

