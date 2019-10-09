"use strict";

{
	C3.Behaviors.Rex_chess.Cnds =
	{
		CompareLX(cmp, lx)
		{
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        return false;
		    var _xyz = board.GetSdkInstance().uid2xyz(this.inst.GetUID());    
			return do_cmp(_xyz.x, cmp, lx);
		},

		CompareLY(cmp, ly)
		{
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        return false;
		    var _xyz = board.GetSdkInstance().uid2xyz(this.inst.GetUID());    
			return do_cmp(_xyz.y, cmp, ly);
		},

		CompareLZ(cmp, lz)
		{
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        return false;
		    var _xyz = board.GetSdkInstance().uid2xyz(this.inst.GetUID());    
			return do_cmp(_xyz.z, cmp, lz);
		},	
			
		IsTile()
		{
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        return false;
		    var _xyz = board.GetSdkInstance().uid2xyz(this.inst.GetUID());	    
			return (_xyz.z == 0);
		},

		IsOnTheBoard(board_objs)
		{
			if (!board_objs)
				return;
			return (this.GetBoard() == board_objs.GetFirstPicked());
		},	

		OnCollided(objB)
		{
			if (!objB)
				return;
					    
		    var objA = this.inst.GetObjectClass();
			var board = this.GetBoard();
			if (board == null)
			    return false;
		        
		    board.GetSdkInstance()._overlap_test(objA, objB);
			// We've aleady run the event by now.
			return false;
		},

		IsOverlapping(objB)
		{
			if (!objB)
				return;
					    
		    var objA = this.inst.GetObjectClass();
			var board = this.GetBoard();
			if (board == null)
			    return false;
		        
		    board.GetSdkInstance()._overlap_test(objA, objB);
			// We've aleady run the event by now.
			return false;
		},	

		AreNeighbors(uidB)
		{
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
				return false;
			
		    return (board.GetSdkInstance().uid2NeighborDir(this.inst.GetUID(), uidB) != null);
		},	

		NoChessAbove()
		{
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        return false;
		    
		    var _xyz = board.GetSdkInstance().uid2xyz(this.inst.GetUID());
		    if (_xyz.z !== 0)  // not a tile
		        return false;
		    
		    var cnt = board.GetSdkInstance().xy2zCnt(_xyz.x, _xyz.y);
			return (cnt == 1);		
		},	

		NoChessAboveLZ(z)
		{
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        return false;
		    
		    var _xyz = board.GetSdkInstance().uid2xyz(this.inst.GetUID());
			return board.GetSdkInstance().IsEmpty(_xyz.x, _xyz.y, z);	
		}	
	};
}