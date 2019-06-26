"use strict";
    var map_01 = [[1,0], [0,1], [-1,0], [0,-1],
                  [1,1], [-1,1], [-1,-1], [1,-1]];   // Orthogonal or Isometric
	var nlx_map_2_0 = [0, -1, -1, 0, 0, -1, 0, 1]; // Staggered (y%2==0)
	var nlx_map_2_1 = [1, 0, 0, 1, 0, -1, 0, 1]; // Staggered (y%2==1)
	var nly_map_2 = [1, 1, -1, -1, 2, 0, -2, 0];  // Staggered
	var dxy2dir = function (dx, dy, x, y, mode)
	{
	    var dir;
	    if (mode == 0)   // Orthogonal
	    {
	        dir = ((dx==1) && (dy==0))?  0:
	              ((dx==0) && (dy==1))?  1:
	              ((dx==-1) && (dy==0))? 2:
	              ((dx==0) && (dy==-1))? 3:
                  ((dx==1) && (dy==1))?  4:
	              ((dx==-1) && (dy==1))?  5:
	              ((dx==-1) && (dy==-1))? 6:
	              ((dx==1) && (dy==-1))? 7:
	                                     null;
	    }
	    else if (mode == 1)   // Isometric
		{
	        dir = ((dx==1) && (dy==0))?  0:
	              ((dx==0) && (dy==1))?  1:
	              ((dx==-1) && (dy==0))? 2:
	              ((dx==0) && (dy==-1))? 3:
                  ((dx==1) && (dy==1))?  4:
	              ((dx==-1) && (dy==1))?  5:
	              ((dx==-1) && (dy==-1))? 6:
	              ((dx==1) && (dy==-1))? 7:
	                                     null;
		}
		else if (mode == 2)  // Staggered
	    {
	        if (y&1)
	        {
	            dir = ((dx==1) && (dy==-1))?  0:
	                  ((dx==1) && (dy==1))?   1:
	                  ((dx==0) && (dy==1))?   2:
	                  ((dx==0) && (dy==-1))?  3:
	                  ((dx==0) && (dy==2))?  4:
	                  ((dx==-1) && (dy==0))?  5:
	                  ((dx==0) && (dy==-2))? 6:
	                  ((dx==1) && (dy==-0))? 7:
	                                          null;  	            
	        }
	        else
	        {
	            dir = ((dx==0) && (dy==-1))?  0:
	                  ((dx==0) && (dy==1))?   1:
	                  ((dx==-1) && (dy==1))?  2:
	                  ((dx==-1) && (dy==-1))? 3:
	                  ((dx==0) && (dy==2))?  4:
	                  ((dx==-1) && (dy==0))?  5:
	                  ((dx==0) && (dy==-2))? 6:
	                  ((dx==1) && (dy==-0))? 7:
	                                          null;	            
	        }
		} 
		return dir;			   
	};
	function quickAbs(x)
	{
		return x < 0 ? -x : x;
	};  
		
{
	C3.Plugins.Rex_SLGSquareTx = class Rex_SLGSquareTxPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}