"use strict";

{
	C3.Behaviors.Rex_RotateTo.Exps =
	{
		Activated()
		{ 
			return (this.activated)? 1:0;
		},
		Speed()
		{ 
			return this.current_speed; 
		},
		MaxSpeed()
		{ 
			return this.move["max"]; 
		},
		Acc()
		{ 
			return this.move["acc"]; 
		},
		Dec()
		{ 
			return this.move["dec"]; 
		},
		TargetAngle()
		{
	        var x = (this.is_rotating)? this.target["a"]:0;
			return x; 
		}
	};
}
