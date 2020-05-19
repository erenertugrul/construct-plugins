"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.jsPDF;

	PLUGIN_CLASS.Type = class jsPDFType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
