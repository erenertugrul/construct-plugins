"use strict";

{
	C3.Behaviors.Rex_Platform_MoveTo.Acts =
	{
		SetActivated(s) 
		{
			this.activated = (s == 1);
		},

		SetTargetPosX(_x) 
		{
			this.SetTargetPos(_x)
		},

		SetTargetPosOnObject(objtype) 
		{
			if (!objtype)
				return;
			var inst = objtype.GetFirstPicked();
			if (inst != null)
				this.SetTargetPos(inst.GetWorldInfo().GetX());
		},

		SetTargetPosByDeltaX(_x) 
		{
			this.SetTargetPos(this.inst.GetWorldInfo().GetX() + _x)
		},

		SetTargetPosByDistance(distance, dir) 
		{
			this.SetTargetPosByDistance(distance, dir);
		},

		Stop()
		{
			this.isMoving = false;
		}
	};
}