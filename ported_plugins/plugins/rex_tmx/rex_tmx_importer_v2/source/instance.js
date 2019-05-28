"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.Rex_tmx_importer_v2;

	PLUGIN_CLASS.Instance = class Rex_tmx_importer_v2Instance extends SDK.IInstanceBase
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
