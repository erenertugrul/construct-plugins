"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.Rex_FirebaseAPI;

	PLUGIN_CLASS.Type = class Rex_FirebaseAPIType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
