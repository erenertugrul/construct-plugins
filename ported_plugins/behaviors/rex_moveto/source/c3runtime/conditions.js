"use strict";

{
	C3.Behaviors.Rex_MoveTo.Cnds =
	{
		OnHitTarget() {
			return (this.isMyCall);
		},

		CompareSpeed(cmp, s) {
			return do_cmp(this.currentSpeed, cmp, s);
		},

		OnMoving()  // deprecated
		{
			return false;
		},

		IsMoving() {
			return (this.enabled && this.isMoving);
		},

		CompareMovingAngle(cmp, s) {
			var angle = this.getMovingAngle();
			if (angle != (-1))
				return do_cmp(this.getMovingAngle(), cmp, s);
			else
				return false;
		},

		OnSolidStop() {
			return this.isMyCall;
		}
	
	};
}