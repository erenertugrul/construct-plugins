"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.Rex_Hash;

	PLUGIN_CLASS.Type = class Rex_HashType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
