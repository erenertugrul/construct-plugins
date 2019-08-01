"use strict";

{
	C3.Behaviors.Rex_ShakeMod.Exps =
	{
		OX()
		{        
	        var x = (this.OX !== null)? this.OX : this.inst.GetWorldInfo().GetX();
			return( x );
		}, 

		OY()
		{        
	        var y = (this.OY !== null)? this.OY : this.inst.GetWorldInfo().GetY();
			return( y );
		},     

		Duration()
		{
			return( this.duration );
		},    
	 
		Remainder()
		{        
	        var t = (this.remaining > 0)? this.remaining : 0;
			return( t );
		}
	};
}