"use strict";

{
	C3.Behaviors.Rex_Platform_MoveTo.Cnds =
	{
		OnHitTarget()
		{
			return (this.isMyCall);
		},

		IsMoving()
		{
			return (this.activated && this.isMoving);
		}
	};
}