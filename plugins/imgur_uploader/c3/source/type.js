"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.imgur_upload;

	PLUGIN_CLASS.Type = class imgur_uploadType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
