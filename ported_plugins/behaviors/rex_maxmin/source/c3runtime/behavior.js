"use strict";
var do_cmp = function (x, cmp, y)
{
	if (typeof x === "undefined" || typeof y === "undefined")
		return false;
	switch (cmp)
	{
		case 0:     // equal
			return x === y;
		case 1:     // not equal
			return x !== y;
		case 2:     // less
			return x < y;
		case 3:     // less/equal
			return x <= y;
		case 4:     // greater
			return x > y;
		case 5:     // greater/equal
			return x >= y;
		default:
			return false;
	}
};
{
	C3.Behaviors.Rex_maxmin = class Rex_maxmin extends C3.SDKBehaviorBase
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