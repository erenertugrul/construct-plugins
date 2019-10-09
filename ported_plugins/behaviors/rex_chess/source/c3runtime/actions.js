"use strict";

{
	C3.Behaviors.Rex_chess.Acts =
	{
		AddChess(board_objs, lx, ly, lz)
		{
			if (!board_objs)
				return;
					    
		    var chess_uid = this.inst.GetUID();
		    if (this.board != null)  // at other board
		        this.board.RemoveChess(chess_uid);
		    this.board = board_objs._instances[0];
		    this.board.GetSdkInstance().AddChess(this.inst,lx, ly, lz);
		    
		    if (this.board.GetSdkInstance().uid2xyz(chess_uid) == null)  // add chess fail
		        this.board = null;
		}, 			

		RemoveChess()
		{
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        return;
		    board.GetSdkInstance().RemoveChess(this.inst.GetUID());   
		}, 	

		MoveChess(tile_objs)
		{
			if (!tile_objs)
				return;
					    
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        return;
		        
		    var tile_uid = _get_uid(tile_objs);
		    if (tile_uid == null)
		        return;  
		    
		    var chess_uid = this.inst.GetUID();
		    var chess_xyz = board.GetSdkInstance().uid2xyz(chess_uid);
		    var tile_xyz = board.GetSdkInstance().uid2xyz(tile_uid);
		    if (tile_xyz == null)
		        return;  
		                
		    board.GetSdkInstance().MoveChess(chess_uid, tile_xyz.x, tile_xyz.y, chess_xyz.z); 
		},	

		MoveChess2Index(lx, ly, lz)
		{	
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        return;

		    var chess_uid = this.inst.GetUID();
		    board.GetSdkInstance().RemoveChess(chess_uid);   
		    board.GetSdkInstance().AddChess(chess_uid, lx, ly, lz);        
		}, 

		SwapChess(uidB)
		{	
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        return;   
		    board.GetSdkInstance().SwapChess(this.inst.GetUID(), uidB);
		}	
	};
}