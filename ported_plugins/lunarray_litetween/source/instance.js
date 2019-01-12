"use strict";

{
	const BEHAVIOR_CLASS = SDK.Behaviors.lunarray_LiteTween;
	
	BEHAVIOR_CLASS.Instance = class lunarray_LiteTweenInstance extends SDK.IBehaviorInstanceBase
	{
		constructor(lunarray_LiteTweenType, behInst)
		{
			super(lunarray_LiteTweenType, behInst);
		}
		
		Release()
		{
		}
		
		// Stays empty
		OnCreate()
		{
		}
		
		// Stays empty
		OnPropertyChanged(id, value)
		{
		}
		
		LoadC2Property(name, valueString)
		{
			return false;		// not handled
		}
	};
}