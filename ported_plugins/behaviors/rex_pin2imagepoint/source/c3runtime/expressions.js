"use strict";

{
	C3.Behaviors.Rex_pin2imgpt.Exps =
	{
		PinnedUID()
		{ 
			return this.pinObject ? this.pinObject.GetUID() : -1;
		}
	};
}
