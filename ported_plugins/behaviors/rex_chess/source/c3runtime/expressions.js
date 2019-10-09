"use strict";

{
	C3.Behaviors.Rex_chess.Exps =
	{
		LX()
		{
		    var lx;
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        lx = (-1);
		    else
		        lx = board.GetSdkInstance().uid2xyz(this.inst.GetUID()).x;
			return(lx);
		},	

		LY()
		{
		    var ly;
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        ly = (-1);
		    else
		        ly = board.GetSdkInstance().uid2xyz(this.inst.GetUID()).y;
			return(ly);
		},

		LZ()
		{
		    var lz;
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        lz = (-1);
		    else
		        lz = board.GetSdkInstance().uid2xyz(this.inst.GetUID()).z;
			return(lz);
		},		

		BoardUID()
		{
		    var uid;
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        uid = (-1);
		    else
		        uid = board._uid;
			return(uid);
		},		    
		LZ2UID(lz)
		{
		    var ret_uid;
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        ret_uid = (-1);
		    else
		    {
		        ret_uid = board.GetSdkInstance().lz2uid(this.inst.GetUID(), lz);
		        if (ret_uid == null)
		            ret_uid = (-1);
		    }		
		    return(ret_uid);
		}, 	

		PX(logic_x,logic_y)
		{	    
		    var px;
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        px = (-1);
		    else
		    {
		        var _xyz = board.GetSdkInstance().uid2xyz(this.inst.GetUID());
		        px = board.GetSdkInstance().layout.LXYZ2PX(_xyz.x,_xyz.y,_xyz.z);
		    }
		    return(px);
		},

		PY(logic_x,logic_y)
		{
		    var py;
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        py = (-1);
		    else
		    {
		        var _xyz = board.GetSdkInstance().uid2xyz(this.inst.GetUID());
		        py = board.GetSdkInstance().layout.LXYZ2PY(_xyz.x,_xyz.y,_xyz.z);
		    }
		    return(py);
		},

		UID2LA( uid_to)
		{
		    var angle;
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        angle = (-1);
		    else
		    {
		        var xyz_o = board.GetSdkInstance().uid2xyz(this.inst.GetUID()); 
		        var xyz_to = board.GetSdkInstance().uid2xyz(uid_to);
		        if (xyz_to == null)
		            angle = (-1);
		        else
		        {
		            angle = board.GetSdkInstance().layout.XYZ2LA(xyz_o, xyz_to);	
		            if (angle == null)
		                angle = (-1); 
		        }
		       
		    }
		    return(angle);
		},

		ZCnt()
		{  	    
		    var cnt;
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        py = (-1);
		    else
		    {
		        var _xyz = board.GetSdkInstance().uid2xyz(this.inst.GetUID());
		        cnt = board.GetSdkInstance().xy2zCnt(_xyz.x, _xyz.y);
		    }
		    return(cnt);
		},	 

		DIR2UID(dir,lz)
		{
		    var ret_uid;
		    var board = this.GetBoard();
		    if (board == null)  // not at any board
		        ret_uid = (-1);
		    else
		    {
		        ret_uid = board.GetSdkInstance().dir2uid(this.inst.GetUID(), dir, lz);
		        if (ret_uid == null)
			        ret_uid = (-1);
		    }
		    return(ret_uid);
		}		
	};
}