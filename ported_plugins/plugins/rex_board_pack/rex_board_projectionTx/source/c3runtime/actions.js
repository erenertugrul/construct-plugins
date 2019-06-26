"use strict";

{
	C3.Plugins.Rex_ProjectionTx.Acts =
	{
	    SetOffset(x, y)
	    {        
	        this.SetPOX(x);
	        this.SetPOY(y);
		}, 
	    
	    SetVectorU(dx, dy)
	    {        
	        this.SetVectorU(dx, dy);
		},
	    SetVectorV(dx, dy)
	    {        
	        this.SetVectorV(dx, dy);
		}, 
	    
	    SetDirections(d)
	    {        
	        this.is_8dir = (d==1);
		} 	
	};
}