"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.Rex_tmx_XML_parser;

	PLUGIN_CLASS.Instance = class Rex_tmx_XML_parserInstance extends SDK.IInstanceBase
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
