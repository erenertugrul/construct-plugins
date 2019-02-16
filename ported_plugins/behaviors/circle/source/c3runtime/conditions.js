"use strict";

{
	C3.Behaviors.Circle.Cnds =
	{
		IsEnabled()
		{
			return this.enabled;
		},
		
		CompareSpeed(cmp, s)
		{
			return do_cmp(this.speed, cmp, s);
		},

		CompareRadiusX(cmp, r)
		{
			return do_cmp(this.radiusX, cmp, r);
		},
		CompareRadiusY(cmp, r)
		{
			return do_cmp(this.radiusY, cmp, r);
		},
		CompareOriginX(cmp, o)
		{
			return do_cmp(this.originX, cmp, o);
		},
		CompareOriginY(cmp, o)
		{
			return do_cmp(this.originY, cmp, o);
		}
	
	};
}