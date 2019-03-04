"use strict";

{
	C3.Plugins.jcw_trace.Exps =
	{
		HitUID() 
		{ 
			return (this.tr.uid); 
		},
		HitX() 
		{ 	
			return (this.tr.hitx); 
		},
		HitY() 
		{
			
			return (this.tr.hity);
		},
		NormalAngle() 
		{ 
			return (C3.toDegrees(this.tr.normalang)); 
		},
		ReflectAngle() 
		{ 
			return (C3.toDegrees(this.tr.GetReflectAng())); 
		},
		HitFrac() 
		{ 
			return (this.tr.t);
		}
	};
	
}