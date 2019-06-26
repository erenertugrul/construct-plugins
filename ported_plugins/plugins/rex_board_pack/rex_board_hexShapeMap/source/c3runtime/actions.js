"use strict";

{
	C3.Plugins.Rex_hexShapeMap.Acts =
	{
		ResetHexagon(board_objs, tile_objs, layer, radius)
		{
		    if ((!board_objs) || (!tile_objs))
		        return;           
		    var board = get_hex_board(board_objs);
		    if (!board)
		        return;
		    
		    var map = get_hexagon_shape(board, radius);
		    var maxXY = get_map_maxXY(map);
		    board.GetSdkInstance().ResetBoard(maxXY.x, maxXY.y);
		    create_chess(board, map, tile_objs, 0, layer);
		},

		ResetTriangle(board_objs, tile_objs, layer, type, height)
		{
		    if ((!board_objs) || (!tile_objs))
		        return;           
		    var board = get_hex_board(board_objs);
		    if (!board)
		        return;
		    
		    var map = get_triangle_shape(board, type, height);
		    var maxXY = get_map_maxXY(map);
		    board.GetSdkInstance().ResetBoard(maxXY.x, maxXY.y);
		    create_chess(board, map, tile_objs, 0, layer);
		},

		ResetParallelogram(board_objs, tile_objs, layer, type, width, height)
		{
		    if ((!board_objs) || (!tile_objs))
		        return;           
		    var board = get_hex_board(board_objs);
		    if (!board)
		        return;
		    
		    var map = get_parallelogram_shape(board, type, width, height);
		    var maxXY = get_map_maxXY(map);
		    board.GetSdkInstance().ResetBoard(maxXY.x, maxXY.y);
		    create_chess(board, map, tile_objs, 0, layer);
		}  
	};
}