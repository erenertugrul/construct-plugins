"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.Rex_ANN;

	PLUGIN_CLASS.Type = class Rex_ANNType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
