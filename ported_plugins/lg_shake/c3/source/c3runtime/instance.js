"use strict";

{
	C3.Behaviors.lgshake.Instance = class lgshakeInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			this.inst = this._inst.GetWorldInfo();
			this.behavior = behInst;
			if (properties)
			{
				this.enabled = (properties[0] !== 0);
			}
			
			// Opt-in to getting calls to Tick()
			this._StartTicking2();
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"smg": this.behavior.shakeMag,
				"ss": this.behavior.shakeStart,
				"se": this.behavior.shakeEnd,
				"smd": this.behavior.shakeMode
			};
		}

		LoadFromJson(o)
		{
			this.behavior.shakeMag = o["smg"];
			this.behavior.shakeStart = o["ss"];
			this.behavior.shakeEnd = o["se"];
			this.behavior.shakeMode = o["smd"];
		}
		/*
		Tick()
		{
			const dt = this._runtime.GetDt(this._inst);
			const wi = this._inst.GetWorldInfo();
			
			// ... code to run every tick for this behavior ...
		}
		*/
		Tick2()
		{
			const dt = this._runtime.GetDt(this._inst);

			//
			if (!this.enabled)
			return;
		
			// Is in a shake?
			var now = this._runtime.GetGameTime();
			var time = this._runtime.GetTimeScale();
			//var now = this._runtime._wallTime._sum;
			var offx = 0, offy = 0;
			
			if (now >= this.behavior.shakeStart && now < this.behavior.shakeEnd)
			{
				var mag = this.behavior.shakeMag * Math.min(time, 1); //._timeScale
				
				// Mode 0 - reducing magnitude - lerp to zero
				if (this.behavior.shakeMode === 0){
					mag *= 1 - (now - this.behavior.shakeStart) / (this.behavior.shakeEnd - this.behavior.shakeStart);
				}
					
				var a = Math.random() * Math.PI * 2;
				var d = Math.random() * mag;
				offx = Math.cos(a) * d;
				offy = Math.sin(a) * d;
			}
			
			//update only when necessary and one more time to enforce object position
			if (offx != 0 || offy != 0 || (this.behavior.shakeEnforcePosition === 1 && this.behavior.shakeStart > 0)) {
				if (this.behavior.axis == 1){
					this.inst.SetX(this.behavior.shakeEnforcePosition ? this.behavior.shakeOriginalX + offx : this.inst.GetX() + offx);
				}
				else if (this.behavior.axis == 2){
					this.inst.SetY(this.behavior.shakeEnforcePosition ? this.behavior.shakeOriginalY + offy : this.inst.GetY()+ offy);
				}
				else{
					this.inst.SetX(this.behavior.shakeEnforcePosition ? this.behavior.shakeOriginalX + offx : this.inst.GetX() + offx);
					this.inst.SetY(this.behavior.shakeEnforcePosition ? this.behavior.shakeOriginalY + offy : this.inst.GetY()+ offy);
				}
					this.inst.SetBboxChanged();

				//turn off
				if (this.behavior.shakeEnforcePosition === 1 && now > this.behavior.shakeEnd)
					this.behavior.shakeStart = 0;
			}
		}
	};
}