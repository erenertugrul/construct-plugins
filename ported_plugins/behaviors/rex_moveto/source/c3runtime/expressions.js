"use strict";

{
	C3.Behaviors.Rex_MoveTo.Exps =
	{
		Activated() 
		{
			return (this.enabled) ? 1 : 0;
		},

		Speed() 
		{
			return (this.currentSpeed);
		},

		MaxSpeed() 
		{
			return (this.moveParams["max"]);
		},

		Acc() 
		{
			return (this.moveParams["acc"]);
		},

		Dec() 
		{
			return (this.moveParams["dec"]);
		},

		TargetX() 
		{
			return (this.target["x"]);
		},

		TargetY() 
		{
			return (this.target["y"]);
		},

		MovingAngle() 
		{
			return (this.getMovingAngle());
		},

		MovingAngleStart() 
		{
			return (this.movingAngleStartData["a"]);
		}
	};
}