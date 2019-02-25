"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.Rex_Firebase_Counter;

	PLUGIN_CLASS.Instance = class Rex_Firebase_CounterInstance extends SDK.IInstanceBase
	{
		constructor(sdkType, inst)
		{
			super(sdkType, inst);
		}
		Release()
		{
		}
		OnCreate()
		{
		}
		OnDestroyed()
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
