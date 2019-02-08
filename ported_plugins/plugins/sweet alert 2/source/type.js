"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.SweetAlert;

	PLUGIN_CLASS.Type = class SweetAlertType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
