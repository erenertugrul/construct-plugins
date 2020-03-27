function clone(obj) {
	if (null == obj || "object" != typeof obj)
		return obj;
	var result = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr))
			result[attr] = obj[attr];
	}
	return result;
};
"use strict";

{
	C3.Behaviors.Rex_Platform_MoveTo = class Rex_Platform_MoveTo extends C3.SDKBehaviorBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}