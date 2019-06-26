"use strict";

{
	C3.Plugins.Rex_SLGBoard.Exps =
	{
	    UID2LX( uid) 
	    {
	        var xyz = this.uid2xyz(uid);
	        var x = (xyz == null) ? (-1) : xyz.x;
	        return(x);
	    },

	    UID2LY( uid) 
	    {
	        var xyz = this.uid2xyz(uid);
	        var y = (xyz == null) ? (-1) : xyz.y;
	        return(y);
	    },

	    UID2LZ( uid) 
	    {
	        var xyz = this.uid2xyz(uid);
	        var z = (xyz == null) ? (-1) : xyz.z;
	        return(z);
	    },

	    LXYZ2UID( x, y, z) 
	    {
	        var uid = this.xyz2uid(x, y, z);
	        if (uid == null)
	            uid = -1;
	        return(uid);
	    },

	    LZ2UID( uid, z) 
	    {
	        var ret_uid = this.lz2uid(uid, z);
	        if (ret_uid == null)
	            ret_uid = (-1);
	        return(ret_uid);
	    },

	    LXY2PX( x, y) 
	    {
	        var px = this.GetLayout().LXYZ2PX(x, y, 0);
	        return(px);
	    },

	    LXY2PY( x, y) 
	    {
	        var py = this.GetLayout().LXYZ2PY(x, y, 0);
	        return(py);
	    },

	    UID2PX( uid) 
	    {
	        var xyz = this.uid2xyz(uid);
	        var px = (xyz) ? this.GetLayout().LXYZ2PX(xyz.x, xyz.y) : -1;
	        return(px);
	    },

	    UID2PY( uid) 
	    {
	        var xyz = this.uid2xyz(uid);
	        var py = (xyz) ? this.GetLayout().LXYZ2PY(xyz.x, xyz.y) : -1;
	        return(py);
	    },

	    UID2LA( uid_o, uid_to) 
	    {
	        var angle;
	        var xyz_o = this.uid2xyz(uid_o);
	        var xyz_to = this.uid2xyz(uid_to);
	        if ((xyz_o == null) || (xyz_to == null))
	            angle = (-1);
	        else {
	            angle = this.GetLayout().XYZ2LA(xyz_o, xyz_to);
	            if (angle == null)
	                angle = (-1);
	        }
	        return(angle);
	    },

	    LXYZ2PX( lx, ly, lz) 
	    {
	        return(this.GetLayout().LXYZ2PX(lx, ly, lz));
	    },

	    LXYZ2PY( lx, ly, lz) 
	    {
	        return(this.GetLayout().LXYZ2PY(lx, ly, lz));
	    },

	    UID2ZCnt( uid) 
	    {
	        var cnt;
	        var xyz = this.uid2xyz(uid);
	        if (xyz != null)
	            cnt = this.xy2zCnt(xyz.x, xyz.y);
	        else
	            cnt = 0;
	        return(cnt);
	    },

	    LXY2ZCnt( x, y) 
	    {
	        var cnt = this.xy2zCnt(x, y);
	        return(cnt);
	    },

	    PXY2LX( px, py) 
	    {
	        return(this.GetLayout().PXY2LX(px, py));
	    },

	    PXY2LY( px, py) 
	    {
	        return(this.GetLayout().PXY2LY(px, py));
	    },

	    DIR2UID( uid, dir, z) 
	    {
	        var ret_uid = this.dir2uid(uid, dir, z);
	        if (ret_uid == null)
	            ret_uid = (-1);
	        return(ret_uid);
	    },

	    BoardWidth()
	    {
	        return(this.x_max + 1);
	    },

	    BoardHeight()
	    {
	        return(this.y_max + 1);
	    },

	    PXY2NearestPX( px, py) 
	    {
	        var layout = this.GetLayout();
	        var lx = layout.PXY2LX(px, py);
	        var ly = layout.PXY2LY(px, py);
	        lx = C3.clamp(Math.round(lx), 0, this.x_max);
	        ly = C3.clamp(Math.round(ly), 0, this.y_max);
	        return(layout.LXYZ2PX(lx, ly, 0));
	    },

	    PXY2NearestPY( px, py) 
	    {
	        var layout = this.GetLayout();
	        var lx = layout.PXY2LX(px, py);
	        var ly = layout.PXY2LY(px, py);
	        lx = C3.clamp(Math.round(lx), 0, this.x_max);
	        ly = C3.clamp(Math.round(ly), 0, this.y_max);
	        return(layout.LXYZ2PY(lx, ly, 0));
	    },

	    LogicDistance( uid_A, uid_B) 
	    {
	        var xyz_A = this.uid2xyz(uid_A);
	        var xyz_B = this.uid2xyz(uid_B);
	        var distanc;
	        if ((xyz_A == null) || (xyz_B == null))
	            distanc = (-1)
	        else
	            distanc = this.GetLayout().LXYZ2Dist(xyz_B.x, xyz_B.y, xyz_B.z, xyz_A.x, xyz_A.y, xyz_A.z);

	        return(distanc);
	    },

	    EmptyLX()
	    {
	        return(this.exp_EmptyLX);
	    },

	    EmptyLY()
	    {
	        return(this.exp_EmptyLY);
	    },

	    DirCount()
	    {
	        return(this.GetLayout().GetDirCount());
	    },

	    NeigborUID2DIR( uid_A, uid_B) 
	    {
	        var dir = this.uid2NeighborDir(uid_A, uid_B);
	        if (dir == null)
	            dir = (-1);
	        return(dir);
	    },

	    ALLDIRECTIONS()
	    {
	        return(ALLDIRECTIONS);
	    },

	    PXY2UID( px, py, lz) {
	        if (lz == null)
	            lz = 0;
	        var layout = this.GetLayout();
	        var lx = layout.PXY2LX(px, py);
	        var ly = layout.PXY2LY(px, py);
	        var uid = this.xyz2uid(lx, ly, lz);
	        if (uid == null)
	            uid = -1;
	        return(uid);
	    },

	    CurLX()
	    {
	        return(this.exp_CurLX);
	    },

	    CurLY()
	    {
	        return(this.exp_CurLY);
	    },

	    CurLZ()
	    {
	        return(this.exp_CurLZ);
	    },

	    MaxLX()
	    {
	        return(this.board.GetMaxX() || 0);
	    },

	    MaxLY()
	    {
	        return(this.board.GetMaxY() || 0);
	    },

	    MinLX()
	    {
	        return(this.board.GetMinX() || 0);
	    },

	    MinLY()
	    {
	        return(this.board.GetMinY() || 0);
	    }
	};
}