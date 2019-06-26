"use strict";
    // jcw_trace
	function InterceptSegment(s2x1, s2y1, s2x2, s2y2, s1x1, s1y1, s1x2, s1y2)
	{
		var s1dx = s1x2 - s1x1;
		var s1dy = s1y2 - s1y1;
		var s2dx = s2x2 - s2x1;
		var s2dy = s2y2 - s2y1;

		var den = s1dy * s2dx - s1dx * s2dy;
		if (den === 0) {return 0;}
		var num = (s1x1 - s2x1) * s1dy + (s2y1 - s1y1) * s1dx;
		return num / den;
	}
    // jcw_trace
    var map_01 = [[1,0], [0,1], [-1,0], [0,-1],
                  [1,1], [-1,1], [-1,-1], [1,-1]];   // Orthogonal or Isometric
  	var nly_map_2 = [1, 1, -1, -1, 2, 0, -2, 0];  // Staggered
	var dxy2dir = function (dx, dy, x, y)
	{
	    var dir = ((dx==1) && (dy==0))?  0:
	                  ((dx==0) && (dy==1))?  1:
	                  ((dx==-1) && (dy==0))? 2:
	                  ((dx==0) && (dy==-1))? 3:
                      ((dx==1) && (dy==1))?  4:
	                  ((dx==-1) && (dy==1))?  5:
	                  ((dx==-1) && (dy==-1))? 6:
	                  ((dx==1) && (dy==-1))? 7:
	                     null;
                                                          
		return dir;			   
	};
  	function quickAbs(x)
	{
		return x < 0 ? -x : x;
	};  
{
	C3.Plugins.Rex_ProjectionTx = class Rex_ProjectionTxPlugin extends C3.SDKPluginBase
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