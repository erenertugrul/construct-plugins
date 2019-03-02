"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.MagiCam;

	PLUGIN_CLASS.Type = class MagiCamType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
