"use strict";

{
	const BEHAVIOR_CLASS = SDK.Behaviors.PinPlus;

	BEHAVIOR_CLASS.Type = class PinPlusType extends SDK.IBehaviorTypeBase
	{
		constructor(sdkPlugin, iBehaviorType)
		{
			super(sdkPlugin, iBehaviorType);
		}
	};
}
