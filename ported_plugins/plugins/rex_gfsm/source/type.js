"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.Rex_FSM;

	PLUGIN_CLASS.Type = class Rex_FSMType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
