"use strict";

{
	C3.Behaviors.Circle.Instance = class CircleInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			//this.wi = this._inst.GetWorldInfo();
			this.inst = this._inst;



			if (properties)
			{
				this.speed = C3.toRadians(properties[0]);
				this.acc = C3.toRadians(properties[1]);
				this.angle = C3.toRadians(properties[2]);
				this.radiusX = properties[3];
				this.radiusY = properties[4];
				this.enabled = (properties[5] !== 0);
			}

			this.originX = this.inst.GetWorldInfo().GetX() - Math.cos(this.angle) * this.radiusX;
			this.originY = this.inst.GetWorldInfo().GetY() - Math.sin(this.angle) * this.radiusY;
		
			


			// Opt-in to getting calls to Tick()
			this._StartTicking();
			//this._StartTicking2();
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"speed": this.speed,
				"acc": this.acc,
				"angle": this.angle,
				"radiusX": this.radiusX,
				"radiusY": this.radiusY,
				"originX": this.originX,
				"originY": this.originY,
				"enabled": this.enabled
			};
		}

		LoadFromJson(o)
		{
			this.speed = o["speed"];
			this.acc = o["acc"];
			this.angle = o["angle"];
			this.radiusX = o["radiusX"];
			this.radiusY = o["radiusY"];
			this.originX = o["originX"];
			this.originY = o["originY"];
			this.enabled = o["enabled"];
		}
		
		GetDebuggerProperties()
		{
			const Acts = C3.Behaviors.Circle;
			const prefix = "Circle.";
			return [{
				title: prefix + "Debug",
				properties: [
					{name: "Speed",	value: C3.toDegrees(this.speed), onedit: v => C3.toRadians(value)},
					{name: "Acceleration",		value: C3.toDegrees(this.acc), onedit: v => C3.toRadians(value)},
					{name: "Circle Angle",			value:  C3.toDegrees(this.angle), onedit: v => C3.toRadians(value) },
					{name: "RadiusX",				value:  this.radiusX },
					{name: "RadiusY",		value: this.radiusY},
					{name: "Origin X",	value: this.originX},
					{name: "Origin Y",	value: this.originY},
					{name: "Enabled",	value: this.enabled}

				]
			}];
		}
		Tick()
		{
			
			const wi = this._inst.GetWorldInfo();
			
			const dt = this._runtime.GetDt(this._inst);

					if(!this.enabled)
			return;

			if (dt === 0)
				return;
				
			if (this.acc !== 0)
				this.speed += this.acc * dt;
				
			if (this.speed !== 0)
			{
				// increment angle
				this.angle = C3.clampAngle(this.angle + this.speed * dt);
				wi.SetX((Math.cos(this.angle) * (this.radiusX) ) + this.originX);
				wi.SetY((Math.sin(this.angle) * (this.radiusY) ) + this.originY);
				
				wi.SetBboxChanged();
			}

	
		}
		
	};
}

