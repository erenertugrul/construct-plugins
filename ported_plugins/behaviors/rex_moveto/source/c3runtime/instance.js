"use strict";

{
	C3.Behaviors.Rex_MoveTo.Instance = class Rex_MoveToInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			this.wi = this._inst.GetWorldInfo();
			this.inst = this._inst;

			this.moveParams = {};
			this.enabled = properties[0];
			this.target = { "x": 0, "y": 0, "a": 0 };
			this.isMoving = false;
			this.currentSpeed = 0;
			this.remainDistance = 0;
			this.remainDt = 0;
			this.prePosition = { "x": 0, "y": 0 };
			this.prePosition["x"] = 0;
			this.prePosition["y"] = 0;
			this.movingAngleData = newPointData(this.movingAngleData);
			this.movingAngleStartData = newPointData(this.movingAngleStartData);
			this.lastTick = null;
			this.isMyCall = false;

			if (properties)
			{
				this.moveParams["max"] = properties[1];
				this.moveParams["acc"] = properties[2];
				this.moveParams["dec"] = properties[3];
				this.soildStopEnable = properties[4];
				this.isContinueMode = properties[5];
			}

			


			// Opt-in to getting calls to Tick()
			this._StartTicking();
			this._StartTicking2();
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"en": this.enabled,
				"v": clone(this.moveParams),
				"t": clone(this.target),
				"is_m": this.isMoving,
				"c_spd": this.currentSpeed,
				"rd": this.remainDistance,
				"pp": clone(this.prePosition),
				"ma": clone(this.movingAngleData),
				"ms": clone(this.movingAngleStartData),
				"lt": this.lastTick,
			};
		}

		LoadFromJson(o)
		{
			this.enabled = o["en"];
			this.moveParams = o["v"];
			this.target = o["t"];
			this.isMoving = o["is_m"];
			this.currentSpeed = o["c_spd"];
			this.remainDistance = o["rd"];
			this.prePosition = o["pp"];
			this.movingAngleData = o["ma"];
			this.movingAngleStartData = o["ms"];
			this.lastTick = o["lt"];
		}
		
		GetDebuggerProperties()
		{
			const Acts = C3.Behaviors.Rex_MoveTo;
			const prefix = "Rex_MoveTo.";
			return [{
				title: prefix + ".Debug",
				properties: [
					{name: prefix + "Activated",	value: this.enabled },
					{name: prefix + "Is moving",		value: this.isMoving},
					{name: prefix + "Target X",			value:  this.target["x"] },
					{name: prefix + "Target Y",				value:  this.target["y"] },
					{name: prefix + "Current speed",		value: this.currentSpeed },
					{name: prefix + "Remaining distance",	value: this.remainDistance}
				]
			}];
		}
		Tick()
		{
			/*
			const wi = this._inst.GetWorldInfo();
			*/
			const dt = this._runtime.GetDt(this._inst);
			this.remainDt = 0;
			if ((!this.enabled) || (!this.isMoving)){
				return;
			}

			this.move(dt);
	
		}
	
		Tick2 () {
			this.movingAngleData["x"] = this.wi.GetX();
			this.movingAngleData["y"] = this.wi.GetY();
		}
		move(dt) {
			if (dt == 0)   // can not move if dt == 0
				return;

			if ((this.prePosition["x"] !== this.wi.GetX()) || (this.prePosition["y"] !== this.wi.GetY()))
				this.resetCurrentPosition();    // reset this.remainDistance

			// assign speed
			var isSlowDown = false;
			if (this.moveParams["dec"] != 0) {
				// is time to deceleration?
				var d = (this.currentSpeed * this.currentSpeed) / (2 * this.moveParams["dec"]); // (v*v)/(2*a)
				isSlowDown = (d >= this.remainDistance);
			}
			var acc = (isSlowDown) ? (-this.moveParams["dec"]) : this.moveParams["acc"];
			if (acc != 0) {
				this.setCurrentSpeed(this.currentSpeed + (acc * dt));
			}

			// Apply movement to the object     
			var distance = this.currentSpeed * dt;
			this.remainDistance -= distance;

			var isHitTarget = false;
			var angle = this.target["a"];
			var ux = Math.cos(angle);
			var uy = Math.sin(angle);
			// is hit to target at next tick?
			if ((this.remainDistance <= 0) || (this.currentSpeed <= 0)) {
				isHitTarget = true;
				this.wi.SetX(this.target["x"]);
				this.wi.GetY(this.target["y"]);

				if (this.currentSpeed > 0)
					this.remainDt = (-this.remainDistance) / this.currentSpeed;

				this.getMovingAngle();
				this.setCurrentSpeed(0);
				this.remainDistance = 0;			
			}
			else {
				var angle = this.target["a"];
				this.wi.SetX(this.wi.GetX() +(distance * ux));
				this.wi.SetY(this.wi.GetY() +(distance * uy));
			}

			this.wi.SetBboxChanged();

			var isSolidStop = false;
			if (this.soildStopEnable) {
				const a = this._runtime.GetCollisionEngine();
				var collobj = a.TestOverlapSolid(this.inst);
				if (collobj) {
					a.RegisterCollision(this.inst, collobj);
					a.PushOutSolid(this.inst, -ux, -uy, Math.max(distance, 50));
					isSolidStop = true;
				}
			}

			this.prePosition["x"] = this.wi.GetX();
			this.prePosition["y"] = this.wi.GetY();

			if (isSolidStop) {
				this.isMoving = false;  // stop
				this.isMyCall = true;
				this.Trigger(C3.Behaviors.Rex_MoveTo.Cnds.OnSolidStop, this.inst);
				this.isMyCall = false;
			}
			else if (isHitTarget) {
				this.isMoving = false;  // stop
				this.isMyCall = true;
				this.Trigger(C3.Behaviors.Rex_MoveTo.Cnds.OnHitTarget, this.inst);
				this.isMyCall = false;
			}
		}

		setCurrentSpeed(speed) {
			if (speed != null) {
				this.currentSpeed = (speed > this.moveParams["max"]) ?
					this.moveParams["max"] : speed;
			}
			else if (this.moveParams["acc"] == 0) {
				this.currentSpeed = this.moveParams["max"];
			}
		}

		resetCurrentPosition() {
			var dx = this.target["x"] - this.wi.GetX();
			var dy = this.target["y"] - this.wi.GetY();

			this.target["a"] = Math.atan2(dy, dx);
			this.remainDistance = Math.sqrt((dx * dx) + (dy * dy));
			this.prePosition["x"] = this.wi.GetX();
			this.prePosition["y"] = this.wi.GetY();
		}

		setTargetPos(_x, _y) {
			this.target["x"] = _x;
			this.target["y"] = _y;
			this.setCurrentSpeed(null);
			this.resetCurrentPosition();
			this.movingAngleData["x"] = this.wi.GetX();
			this.movingAngleData["y"] = this.wi.GetY();
			this.isMoving = true;

			// start position
			this.movingAngleStartData["x"] = this.wi.GetX();
			this.movingAngleStartData["y"] = this.wi.GetY();
			this.movingAngleStartData["a"] = clamp_angle_degrees(C3.angleTo(this.wi.GetX(), this.wi.GetY(), _x, _y));

			if (this.isContinueMode)
				this.move(this.remainDt);
		}

		isTickChanged() {
			var curTick = this._runtime.GetTickCount();
			var tickChanged = (this.lastTick != curTick);
			this.lastTick = curTick;
			return tickChanged;
		}

		getMovingAngle(ret) {
			if (this.isTickChanged()) {
				var dx = this.wi.GetX() - this.movingAngleData["x"];
				var dy = this.wi.GetY() - this.movingAngleData["y"];
				if ((dx != 0) || (dy != 0))
					this.movingAngleData["a"] = clamp_angle_degrees(Math.atan2(dy, dx));
			}
			return this.movingAngleData["a"];
		}
	
		
	};
}

