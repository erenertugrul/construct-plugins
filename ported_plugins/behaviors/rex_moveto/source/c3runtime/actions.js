"use strict";

{
	C3.Behaviors.Rex_MoveTo.Acts =
	{
		SetEnabled(en) 
		
		{
				this.enabled = (en === 1);
		},

		SetMaxSpeed(s) 
		
		{
				this.moveParams["max"] = s;
				this.setCurrentSpeed(null);
		},

		SetAcceleration(a) 
		{
				this.moveParams["acc"] = a;
				this.setCurrentSpeed(null);
		},

		SetDeceleration(a) 
		{
				this.moveParams["dec"] = a;
		},

		SetTargetPos(x, y) 
		{
				this.setTargetPos(x, y)
		},

		SetCurrentSpeed(s) 
		{
				this.setCurrentSpeed(s);
		},

		SetTargetPosOnObject(objtype) 
		{
				if (!objtype){
					return;
				}
				var inst = objtype.GetFirstPicked();
				if (inst != null){
					this.setTargetPos(inst.GetWorldInfo().GetX(), inst.GetWorldInfo().GetY());
				}
		},

		SetTargetPosByDeltaXY(dx, dy) 
		{
				this.setTargetPos(this.wi.GetX() + dx, this.wi.GetY() + dy);
		},

		SetTargetPosByDistanceAngle(distance, angle) 
		{
				var a = to_clamped_radians(angle);
				var dx = distance * Math.cos(a);
				var dy = distance * Math.sin(a);
				this.setTargetPos(this.wi.GetX() + dx, this.wi.GetY() + dy);
		},

		Stop() 
		{
				this.isMoving = false;
		},

		SetTargetPosOnUID(uid) 
		{
				var inst = this._runtime.GetInstanceByUID(uid);
				if (inst != null)
					this.setTargetPos(inst.GetWorldInfo().GetX(), inst.GetWorldInfo().GetY());
		},

		SetStopBySolid(en) 
		{
				this.soildStopEnable = (en === 1);
		}
	};
}