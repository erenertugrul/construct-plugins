"use strict";
    var ODD_R = 0;
    var EVEN_R = 1;
    var ODD_Q = 2;
    var EVEN_Q = 3;
    var rotate_result = {q:0, r:0};
	function quickAbs(x)
	{
		return x < 0 ? -x : x;
	};
	var dxy2dir = function (dq, dr, q, r, mode)
	{
	    var parity;
	    switch (mode)
	    {
	    case ODD_R:
	    case EVEN_R:
	        parity = r & 1;	        
	    break;
	    
	    case ODD_Q:
	    case EVEN_Q:
	        parity = q & 1; 	        
	    break;	    
	    }
	    var _dxy2dir = dxy2dir_map[mode][parity];
	    
	    if (!_dxy2dir.hasOwnProperty(dq))
	        return null;
	    if (!_dxy2dir[dq].hasOwnProperty(dr))
	        return null;
	    
	    return _dxy2dir[dq][dr];
	};
		var dir2dxy_ODD_R = [
	    [ [+1,  0], [ 0, +1], [-1, +1],
          [-1,  0], [-1, -1], [ 0, -1] ],          
        [ [+1,  0], [+1, +1], [ 0, +1],
          [-1,  0], [ 0, -1], [+1, -1] ]
    ];
    var dir2dxy_EVEN_R = [
        [ [+1,  0], [+1, +1], [ 0, +1],
          [-1,  0], [ 0, -1], [+1, -1] ],          
        [ [+1,  0], [ 0, +1], [-1, +1],
          [-1,  0], [-1, -1], [ 0, -1] ]
    ];
	var dir2dxy_ODD_Q = [
        [ [+1,  0], [ 0, +1], [-1,  0],
          [-1, -1], [ 0, -1], [+1, -1] ],          
        [ [+1, +1], [ 0, +1], [-1, +1],
          [-1,  0], [ 0, -1], [+1,  0] ]
    ];
    var dir2dxy_EVEN_Q = [
        [ [+1, +1], [ 0, +1], [-1, +1],
          [-1,  0], [ 0, -1], [+1,  0] ],          
        [ [+1,  0], [ 0, +1], [-1,  0],
          [-1, -1], [ 0, -1], [+1, -1] ]
    ];
	var neighbors = [dir2dxy_ODD_R,
	                 dir2dxy_EVEN_R,
	                 dir2dxy_ODD_Q,
	                 dir2dxy_EVEN_Q];
	                 
	// reverse dir2dxy to dxy2dir
    var dxy2dir_ODD_R = [];
    var dxy2dir_EVEN_R = []; 
    var dxy2dir_ODD_Q = [];
    var dxy2dir_EVEN_Q = []; 
    var dxy2dir_map = {0:dxy2dir_ODD_R,
                       1:dxy2dir_EVEN_R,
                       2:dxy2dir_ODD_Q,
                       3:dxy2dir_EVEN_Q};
    
    var dxy2dir_gen = function (dir2dxy_in, dxy2dir_out)
    {
        var p,dir;
        var dx,dy;                    
        for (p=0; p<2; p++)
        { 
            var _dxy2dir = {};
            for (dir=0; dir<6; dir++)
            {
                dx = dir2dxy_in[p][dir][0];
                dy = dir2dxy_in[p][dir][1];
                if (!_dxy2dir.hasOwnProperty(dx))
                    _dxy2dir[dx] = {};
                _dxy2dir[dx][dy] = dir;
            }   
            dxy2dir_out.push(_dxy2dir);                 
        }
    }
    dxy2dir_gen(dir2dxy_ODD_R, dxy2dir_ODD_R);
    dxy2dir_gen(dir2dxy_EVEN_R, dxy2dir_EVEN_R);    
    dxy2dir_gen(dir2dxy_ODD_Q, dxy2dir_ODD_Q);
    dxy2dir_gen(dir2dxy_EVEN_Q, dxy2dir_EVEN_Q);      

{
	C3.Plugins.Rex_SLGHexTx = class Rex_SLGHexTxPlugin extends C3.SDKPluginBase
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