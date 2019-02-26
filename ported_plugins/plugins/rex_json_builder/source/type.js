"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.Rex_JSONBuider;

	PLUGIN_CLASS.Type = class Rex_JSONBuiderType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
