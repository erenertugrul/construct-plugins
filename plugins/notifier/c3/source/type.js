"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.erenertugrul_notifier;
	
	PLUGIN_CLASS.Type = class NotifierType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}