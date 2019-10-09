"use strict";

{
	const BEHAVIOR_CLASS = SDK.Behaviors.Rex_chess;

	BEHAVIOR_CLASS.Type = class Rex_chessType extends SDK.IBehaviorTypeBase
	{
		constructor(sdkPlugin, iBehaviorType)
		{
			super(sdkPlugin, iBehaviorType);
		}
	};
}
