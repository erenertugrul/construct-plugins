"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.ExtraExps;

	PLUGIN_CLASS.Type = class ExtraExpsType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
