"use strict";

{
	C3.Plugins.Rex_SLGHexTx.Exps =
	{
		Width()
		{
		    return(this.width);
		},
		Height()
	    {
		    return(this.height);
		},
		POX()
		{
		    return(this.pox);
		},
		POY()
	    {
		    return(this.poy);
		},	
		
		DIRLRRIGHT()
	    {
		    return(0);
		},		
		DIRLRDOWNRIGHT()
	    {
		    return(1);
		},		
		DIRLRDOWNLEFT()
	    {
		    return(2);
		},		
		DIRLRLEFT()
	    {
		    return(3);
		},	
		DIRLRUPLEFT()
	    {
		    return(4);
		},		
		DIRLRUPRIGHT()
	    {
		    return(5);
		},	
		DIRUDDOWNRIGHT()
	    {
		    return(0);
		},		
		DIRUDDOWN()
	    {
		    return(1);
		},		
		DIRUDDOWNLEFT()
	    {
		    return(2);
		},		
		DIRUDUPLEFT()
	    {
		    return(3);
		},	
		DIRUDUP()
	    {
		    return(4);
		},		
		DIRUDUPRIGHT()
	    {
		    return(5);
		},	
		
		LXY2PX(lx,ly)
		{
	        var px = this.LXYZ2PX(lx,ly,0);
		    return(px);
		},
	    
		LXY2PY(lx,ly)
		{
	        var py = this.LXYZ2PY(lx,ly,0);
		    return(py);
		},		
		
		PXY2LX(px,py)
		{
	        var lx = this.PXY2LX(px,py);
		    return(lx);
		},
	    
		PXY2LY(px,py)
		{
	        var ly = this.PXY2LY(px,py);
		    return(ly);
		}    
	};
}