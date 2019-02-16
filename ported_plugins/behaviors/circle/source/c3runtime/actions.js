"use strict";

{
	C3.Behaviors.Circle.Acts =
	{
		SetSpeed(s)
		{
			this.speed = C3.toRadians(s);
		},
		
		SetAcceleration(a)
		{
			this.acc = C3.toRadians(a);
		},
		
		SetAngle(a)
		{
			this.angle = C3.toRadians(a);
		},

		SetEnabled(en)
		{
			this.enabled = (en === 1);
		},

		SetRadiusX(rX)
		{
			this.radiusX = rX;
		},
		
		SetRadiusY(rY)
		{
			this.radiusY = rY;
		},

		SetOriginX(oX)
		{
			this.originX = oX;
		},
		
		SetOriginY(oY)
		{
			this.originY = oY;
		}
	};
}