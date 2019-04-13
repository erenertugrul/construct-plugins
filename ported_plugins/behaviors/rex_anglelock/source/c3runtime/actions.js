"use strict";

{
	C3.Behaviors.rex_anglelock.Acts =
	{
		SetActivated(s)
		{
			this.activated = (s==1);
		}, 
		
		SetLockedAngle(a)
		{
			this.locked_angle = to_clamped_radians(a);
		}
	};
}