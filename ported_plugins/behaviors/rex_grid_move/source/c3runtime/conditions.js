"use strict";

{
	C3.Behaviors.Rex_GridMove.Cnds =
	{
		OnHitTarget()
		{
			return (this._cmd_move_to.is_my_call);
		},

		OnMoving()
		{
			return false;
		},

		IsMoving()
		{
			return (this._cmd_move_to.is_moving);
		},

		OnMovingRequestAccepted()
		{
			return (this.is_my_call);
		},	
		OnMovingRequestRejected()
		{
			return (this.is_my_call);
		},
		IsMovingRequestAccepted()
		{
			return this.is_moving_request_accepted;
		},
		TestMoveToOffset(dx, dy)
		{
			var xyz = this.chess_xyz_get();
			if (xyz == null)
			    return false;

		    var board = this.GetBoard();
		    var tx = board.WrapLX(xyz.x+dx);
		    var ty = board.WrapLY(xyz.y+dy);
		    var tz = xyz.z;
		    var dir = this.target2dir(tx, ty, tz);
		    var can_move = this.test_move_to(tx, ty, tz, dir);	    
			return (can_move==1);
		},
		TestMoveToNeighbor(dir)
		{
			var xyz = this.chess_xyz_get();
			if (xyz == null)
			    return false;

		    var board = this.GetBoard();
		    var tx = board.GetNeighborLX(xyz.x, xyz.y, dir);
		    var ty = board.GetNeighborLY(xyz.x, xyz.y, dir);
		    var tz = xyz.z;
		    var can_move = this.test_move_to(tx, ty, tz, dir);	    
			return (can_move==1);			 
		},	

		OnCollidedBegin(objtype, group_name)
		{
			return this._collide_test(this._colliding_xyz, objtype, group_name);
		},

		OnGetSolid()
		{
			return true;
		}

	};
}