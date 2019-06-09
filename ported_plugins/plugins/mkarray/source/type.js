"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.mkArray;

	PLUGIN_CLASS.Type = class mkArrayType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
