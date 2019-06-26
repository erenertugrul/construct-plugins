"use strict";

{
	C3.Plugins.Rex_SLGHexTx.Acts =
	{
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
	    SetOrientation(is_updown, is_indent)
	    {        
	        this.SetOrientation((is_updown===1), (is_indent===1));      
		}
	};
}