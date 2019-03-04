"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.jcw_trace;

	PLUGIN_CLASS.Type = class jcw_traceType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
