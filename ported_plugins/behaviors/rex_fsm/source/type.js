"use strict";

{
	const BEHAVIOR_CLASS = SDK.Behaviors.Rex_FSM;

	BEHAVIOR_CLASS.Type = class Rex_FSMType extends SDK.IBehaviorTypeBase
	{
		constructor(sdkPlugin, iBehaviorType)
		{
			super(sdkPlugin, iBehaviorType);
		}
	};
}
