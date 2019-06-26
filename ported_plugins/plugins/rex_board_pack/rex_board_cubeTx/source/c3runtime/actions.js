"use strict";

{
	C3.Plugins.Rex_SLGCubeTx.Acts =
	{
	    SetOrientation(orientation)
	    {        
	        this.is_isometric = (orientation == 1);
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
		}  
	};
}