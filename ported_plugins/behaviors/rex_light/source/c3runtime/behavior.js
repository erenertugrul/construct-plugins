"use strict";
	function clamp_angle_degrees(a)
	{
			a %= 360;       // now in (-360, 360) range
			if (a < 0)
				a += 360;   // now in [0, 360) range
			return a;
	}
	function to_clamped_degrees(x)
	{
			return clamp_angle_degrees(C3.toDegrees(x));
	}
{
	C3.Behaviors.Rex_light = class Rex_light extends C3.SDKBehaviorBase
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