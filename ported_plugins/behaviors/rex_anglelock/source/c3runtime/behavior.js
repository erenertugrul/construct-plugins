"use strict";
var to_clamped_radians = function(x)
{
	return C3.clampAngle(C3.toRadians(x));
}
{
	C3.Behaviors.rex_anglelock = class rex_anglelock extends C3.SDKBehaviorBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}