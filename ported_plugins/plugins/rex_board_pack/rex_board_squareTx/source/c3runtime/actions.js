"use strict";

{
	C3.Plugins.Rex_SLGSquareTx.Acts =
	{
	    SetOrientation(m)
	    {        
	        this.mode = m;
		},
	    SetCellSize(width, height)
	    {        
	        this.SetWidth(width);
	        this.SetHeight(height);
		},
	    SetOffset(x, y)
	    {        
	        this.SetPOX(x);
	        this.SetPOY(y);
		}, 
	    SetDirections(d)
	    {        
	        this.is8Dir = (d==1);
		}	
	};
}