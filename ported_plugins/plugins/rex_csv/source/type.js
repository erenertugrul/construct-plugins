"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.Rex_CSV;

	PLUGIN_CLASS.Type = class Rex_CSVType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
