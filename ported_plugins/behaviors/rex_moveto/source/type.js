"use strict";

{
	const BEHAVIOR_CLASS = SDK.Behaviors.Rex_MoveTo;

	BEHAVIOR_CLASS.Type = class Rex_MoveToType extends SDK.IBehaviorTypeBase
	{
		constructor(sdkPlugin, iBehaviorType)
		{
			super(sdkPlugin, iBehaviorType);
		}
	};
}
