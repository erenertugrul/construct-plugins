"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.Rex_Date;

	PLUGIN_CLASS.Type = class Rex_DateType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
