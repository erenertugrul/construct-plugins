"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.Rex_Firebase_Rooms;

	PLUGIN_CLASS.Instance = class Rex_Firebase_RoomsInstance extends SDK.IInstanceBase
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
		OnPropertyChanged(id, value)
		{
		}
		LoadC2Property(name, valueString)
		{
			return false;       // not handled
		}
	};
}
