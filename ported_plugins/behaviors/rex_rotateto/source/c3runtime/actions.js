"use strict";

{
	C3.Behaviors.Rex_RotateTo.Acts =
	{
		SetActivated(s)
		{
			this.activated = (s == 1);
		},
		SetMaxSpeed(s)
		{
			this.move["max"] = s;
       	 this.SetCurrentSpeed(null);
		},
		SetAcceleration(a)
		{
			this.move["acc"] = a;
        	this.SetCurrentSpeed(null);
		},
		SetDeceleration(a)
		{
			this.move["dec"] = a;
		},
		SetTargetAngle(angle,clockwise_mode)
		{
			this.SetTargetAngle(to_clamped_degrees(angle), clockwise_mode);
		},
		SetCurrentSpeed(s)
		{
			this.SetCurrentSpeed(s);
		},
		SetTargetAngleOnObject(objtype,clockwise_mode)
		{
			if (!objtype)
				return;
			var inst = objtype.GetFirstPicked();
	        if (inst != null)
	        {
	            var angle = Math.atan2(inst.GetWorldInfo().GetY()-this.inst.GetY() , inst.GetWorldInfo().GetX()-this.inst.GetX());
	            this.SetTargetAngle(angle, clockwise_mode);
	        }
		},
		SetTargetAngleByDeltaAngle(dA,clockwise_mode)
		{
		    var dA_rad = to_clamped_degrees(dA);
		    if (clockwise_mode==0)
		        dA_rad = -dA_rad;
		    var angle = this.inst.GetAngle() + dA_rad;
	        this.SetTargetAngle(angle, clockwise_mode);
		},
		SetTargetAngleToPos(tx,ty,clockwise_mode)
		{
	    	var angle = Math.atan2(ty-this.inst.GetY() , tx-this.inst.GetX());
        	this.SetTargetAngle(angle, clockwise_mode);
		},
		Stop()
		{
 			this.is_rotating = false;
		}
	};
}
