"use strict";

{
	const BEHAVIOR_CLASS = SDK.Behaviors.Rex_CameraFollower;

	BEHAVIOR_CLASS.Type = class Rex_CameraFollowerType extends SDK.IBehaviorTypeBase
	{
		constructor(sdkPlugin, iBehaviorType)
		{
			super(sdkPlugin, iBehaviorType);
		}
	};
}
