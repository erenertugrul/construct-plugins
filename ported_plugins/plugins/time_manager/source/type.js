"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.CAMFTimeManager;

	PLUGIN_CLASS.Type = class CAMFTimeManagerType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
