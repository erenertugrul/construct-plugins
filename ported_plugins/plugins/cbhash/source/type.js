"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.CBhash;

	PLUGIN_CLASS.Type = class CBhashType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
