"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.scormc2;
	
	PLUGIN_CLASS.Type = class C3ScormPluginType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}