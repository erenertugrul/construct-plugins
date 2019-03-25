"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.MouseLock;

	PLUGIN_CLASS.Type = class MouseLockType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
