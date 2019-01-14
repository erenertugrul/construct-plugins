"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.SimpleQRScanner;

	PLUGIN_CLASS.Type = class SimpleQRScannerType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
