"use strict";

{
	C3.Behaviors.lgshake.Acts =
	{
		Shake(mag, dur, mode, enforcePosition,axis)
		{
			this.behavior.shakeMag = mag;
			this.behavior.shakeStart = this._runtime.GetGameTime();
			this.behavior.shakeEnd = this.behavior.shakeStart + dur;
			this.behavior.shakeMode = mode;
			this.behavior.shakeEnforcePosition = enforcePosition;
			this.behavior.shakeOriginalX = this.inst.GetX();
			this.behavior.shakeOriginalY = this.inst.GetY();
			this.behavior.axis = axis;
		},
		SetEnabled(e)
		{
			this.enabled = (e !== 0);
		}
	};
}


