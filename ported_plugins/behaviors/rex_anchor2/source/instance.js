"use strict";

{
	const BEHAVIOR_CLASS = SDK.Behaviors.rex_Anchor2;

	BEHAVIOR_CLASS.Instance = class rex_Anchor2Instance extends SDK.IBehaviorInstanceBase
	{
		constructor(sdkBehType, behInst)
		{
			super(sdkBehType, behInst);
		}
		Release()
		{
		}
		OnCreate()
		{
		}
		OnPropertyChanged(id, value)
		{
		}
		LoadC2Property(name, valueString)
		{
			return false;       // not handled
		}
	};
}
