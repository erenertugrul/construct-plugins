"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.eren_DiscordRPC;

	PLUGIN_CLASS.Instance = class eren_DiscordRPCInstance extends SDK.IInstanceBase
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
