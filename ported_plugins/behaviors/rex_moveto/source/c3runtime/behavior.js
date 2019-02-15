	newPointData = function (point) {
		if (point == null){
			point = {};
		}
		point["x"] = 0;
		point["y"] = 0;
		point["a"] = -1;
		return point;
	};

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
	function do_cmp(x, cmp, y)
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
	}
	function to_clamped_radians(x)
	{
		return C3.clampAngle(C3.toRadians(x));
	}

	function clamp_angle_degrees(a)
	{
			a %= 360;       // now in (-360, 360) range
			if (a < 0)
				a += 360;   // now in [0, 360) range
			return a;
	}
	function to_clamped_degrees(x)
	{
			return clamp_angle_degrees(C3.toDegrees(x));
	}
"use strict";

{
	C3.Behaviors.Rex_MoveTo = class Rex_MoveTo extends C3.SDKBehaviorBase
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