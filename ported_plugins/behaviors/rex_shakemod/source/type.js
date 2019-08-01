"use strict";

{
	const BEHAVIOR_CLASS = SDK.Behaviors.Rex_ShakeMod;

	BEHAVIOR_CLASS.Type = class Rex_ShakeModType extends SDK.IBehaviorTypeBase
	{
		constructor(sdkPlugin, iBehaviorType)
		{
			super(sdkPlugin, iBehaviorType);
		}
	};
}
