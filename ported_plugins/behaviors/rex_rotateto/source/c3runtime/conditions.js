"use strict";

{
	C3.Behaviors.Rex_RotateTo.Cnds =
	{
		OnHitTarget()
		{ 
			return (this.is_my_call);
		},
		CompareSpeed(cmp,s)
		{ 
			return do_cmp(this.current_speed, cmp, s);
		},
		IsRotating()
		{ 
			return (this.activated && this.is_rotating);
		}
	};
}
