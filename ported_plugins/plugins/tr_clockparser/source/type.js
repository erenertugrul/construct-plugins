"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.TR_ClockParser;

	PLUGIN_CLASS.Type = class TR_ClockParserType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
