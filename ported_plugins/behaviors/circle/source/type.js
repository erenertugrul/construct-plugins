"use strict";

{
	const BEHAVIOR_CLASS = SDK.Behaviors.Circle;

	BEHAVIOR_CLASS.Type = class CircleType extends SDK.IBehaviorTypeBase
	{
		constructor(sdkPlugin, iBehaviorType)
		{
			super(sdkPlugin, iBehaviorType);
		}
	};
}
