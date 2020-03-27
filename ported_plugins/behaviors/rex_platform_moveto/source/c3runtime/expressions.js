"use strict";

{
	C3.Behaviors.Rex_Platform_MoveTo.Exps =
	{
		Activated()
		{
			return((this.activated) ? 1 : 0);
		},

		TargetX(){
			var x = (this.isMoving) ? this.target["x"] : 0;
			return(x);
		}
	};
}