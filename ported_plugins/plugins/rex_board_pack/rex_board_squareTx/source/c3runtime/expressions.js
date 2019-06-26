"use strict";

{
	C3.Plugins.Rex_SLGSquareTx.Exps =
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
		DIRRIGHT()
		{
		    return(0);
		},		
		DIRDOWN()
		{
		    return(1);
		},		
		DIRLEFT()
		{
		    return(2);
		},		
		DIRUP()
		{
		    return(3);
		},
		DIRRIGHTDOWN()
		{
		    return(4);
		},		
		DIRLEFTDOWN()
		{
		    return(5);
		},		
		DIRLEFTUP()
		{
		    return(6);
		},		
		DIRRIGHTUP()
		{
		    return(7);
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