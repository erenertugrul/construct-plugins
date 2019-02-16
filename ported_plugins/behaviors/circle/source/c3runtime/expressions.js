"use strict";

{
	C3.Behaviors.Circle.Exps =
	{
		Speed(ret)
		{
			return C3.toDegrees(this.speed);
		},
		
		Acceleration(ret)
		{
			return C3.toDegrees(this.acc);
		},

		Angle(ret)
		{
			return C3.toDegrees(this.angle);
		},
		
		RadiusX(ret)	
		{
			return this.radiusX;
		},
		
		RadiusY(ret)
		{
			return this.radiusY;
		},

		OriginX(ret)	
		{
			return this.originX;
		},
		
		OriginY(ret)
		{
			return this.originY;
		}
	
	};
}