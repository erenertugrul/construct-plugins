"use strict";

{
	const BEHAVIOR_CLASS = SDK.Behaviors.lgshake;

	BEHAVIOR_CLASS.Type = class lgshakeType extends SDK.IBehaviorTypeBase
	{
		constructor(sdkPlugin, iBehaviorType)
		{
			super(sdkPlugin, iBehaviorType);
		}
	};
}
