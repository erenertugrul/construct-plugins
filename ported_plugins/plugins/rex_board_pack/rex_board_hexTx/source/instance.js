"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.Rex_SLGHexTx;

	PLUGIN_CLASS.Instance = class Rex_SLGHexTxInstance extends SDK.IInstanceBase
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
