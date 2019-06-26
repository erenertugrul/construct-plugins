"use strict";
	var get_hex_board = function(board_objs)
    {   
        var board = board_objs.GetFirstPicked();
        if (!board)
            return null; 
        var layout = board.GetSdkInstance().GetLayout();
        if (C3.Plugins.Rex_SLGHexTx && (layout instanceof C3.Plugins.Rex_SLGHexTx.Instance))
            return board;
        else
            return null; 
    };
    
    var get_hexagon_shape = function(board, radius)
    {
        var layout = board.GetSdkInstance().GetLayout();
        var map = [], lxy;
        var q, r1,r2, r;
        var xyz;
        for (q = -radius; q <= radius; q++) 
        {
            r1 = Math.max(-radius, -q - radius);
            r2 = Math.min(radius, -q + radius);
            for (r = r1; r <= r2; r++) 
            {
                lxy = {x:layout.xyz2q(q, r, -q-r), 
                       y:layout.xyz2r(q, r, -q-r) };
                map.push(lxy);
            }
        }
        align_map(layout, map);
        return map;        
    };
    
    var get_triangle_shape = function(board, type ,height)
    {
        var layout = board.GetSdkInstance().GetLayout();
        var map = [], lxy;        
        var q, r, r_start, r_end;
        var xyz;
        for (q = 0; q <= height; q++) 
        {            
            if (type === 0)
            {
                r_start = 0;
                r_end = height - q;
            }
            else
            {
                r_start = height - q;
                r_end = height;            
            }
            
            for (r = r_start; r <= r_end; r++) 
            {
                lxy = {x:layout.xyz2q(q, r, -q-r), 
                       y:layout.xyz2r(q, r, -q-r) };
                map.push(lxy);
            }
        }
        align_map(layout, map);
        return map;        
    };  

    var get_parallelogram_shape = function(board, type, width, height)
    {
        var layout = board.GetSdkInstance().GetLayout();
        var map = [], lxy;        
        var q, r, s;
        var xyz, offset = Math.max(width, height);
        if (type === 0)
        {
            for (q = 0; q <= width; q++) 
            {            
                for (r = 0; r <= height; r++) 
                {
                    lxy = {x:layout.xyz2q(q, r, -q-r), 
                           y:layout.xyz2r(q, r, -q-r) };
                    map.push(lxy);
                }
            }
        }
        else if (type === 1)
        {
            for (s = 0; s <= width; s++) 
            {            
                for (q = 0; q <= height; q++) 
                {
                    lxy = {x:layout.xyz2q(q, -q-s, s), 
                           y:layout.xyz2r(q, -q-s, s) };
                    map.push(lxy);
                }
            }
        }
        else if (type === 2)
        {
            for (r = 0; r <= width; r++) 
            {            
                for (s = 0; s <= height; s++) 
                {
                    lxy = {x:layout.xyz2q(-r-s, r, s), 
                           y:layout.xyz2r(-r-s, r, s) };
                    map.push(lxy);
                }
            }
        }        
        align_map(layout, map);
        return map;        
    };  
       
    var align_map = function(layout, map)
    {
        var minX, minY;
        var i, cnt=map.length, lxy;
        for(i=0; i<cnt; i++)
        {
            lxy = map[i];
            if ((minX == null) || (lxy.x < minX))
                minX = lxy.x;
            if ((minY == null) || (lxy.y < minY))
                minY = lxy.y;
        }
        if ((minX !== 0) || (minY !== 0))
        {
            var new_lx, new_ly;
            for(i=0; i<cnt; i++)
            {
                lxy = map[i];
                new_lx = layout.OffsetLX(lxy.x, lxy.y, 0, -minX, -minY, 0);
                new_ly = layout.OffsetLY(lxy.x, lxy.y, 0, -minX, -minY, 0);
                lxy.x = new_lx;
                lxy.y = new_ly;
            }
        }        
        return map        
    };    
    
    var result_maxXY = {x:0, y:0};
    var get_map_maxXY = function(map)
    {
        var maxX, maxY;
        var i, cnt=map.length, lxy;
        for(i=0; i<cnt; i++)
        {
            lxy = map[i];
            if ((maxX == null) || (lxy.x > maxX))
                maxX = lxy.x;
            if ((maxY == null) || (lxy.y > maxY))
                maxY = lxy.y;  
        }
        result_maxXY.x = maxX;
        result_maxXY.y = maxY;
        return result_maxXY;    
    };    
    
    var create_chess = function(board, map, tile_type, lz, layer)
    {     
        var i, cnt=map.length, lxy;
        for(i=0; i<cnt; i++)
        {
            lxy = map[i];
            board.GetSdkInstance().CreateChess(tile_type, lxy.x, lxy.y, lz, layer);
        }    
    };  
{
	C3.Plugins.Rex_hexShapeMap = class Rex_hexShapeMapPlugin extends C3.SDKPluginBase
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