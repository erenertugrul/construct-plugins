"use strict";

{
	C3.Plugins.Rex_SLGBoard.Acts =
	{
		ResetBoard(width, height) 
		{
		    this.ResetBoard(width - 1, height - 1);
		},

		AddTile(objs, x, y) 
		{
		    if (!objs)
		        return;

		    var inst = objs.GetFirstPicked();
		    this.AddChess(inst, x, y, 0);
		},

		DestroyChess(chess_type) 
		{
		    if (!chess_type)
		        return;

		    var chess = chess_type.GetCurrentSol().GetInstances();
		    var i, chess_cnt = chess.length;
		    for (i = 0; i < chess_cnt; i++) {
		        this.RemoveChess(chess[i].GetUID());
		        this._runtime.DestroyInstance(chess[i]);
		    }
		},


		AddChess(obj_type, x, y, z) 
		{
		    if (obj_type == null)
		        return;

		    var inst;
		    if (typeof (obj_type) === "object")
		        inst = obj_type.GetFirstPicked();
		    else // uid
		        inst = obj_type;

		    this.AddChess(inst, x, y, z);
		},

		SetupLayout(layout_objs) 
		{
		    if (layout_objs == null)
		        return;

		    var layout = layout_objs.GetFirstPicked();
		    if (layout.GetSdkInstance().check_name == "LAYOUT")
		        this.layout = layout.GetSdkInstance();
		    else
		        console.log("Board should connect to a layout object");
		},

		CreateTile(objtype, x, y, layer) 
		{
		    this.CreateChess(objtype, x, y, 0, layer);
		},

		CreateChess(objtype, x, y, z, layer) 
		{
		    this.CreateChess(objtype, x, y, z, layer);
		},

		RemoveChess(obj_type) 
		{
		    if (!obj_type)
		        return;

		    if (typeof (obj_type) === "object") {
		        var insts = obj_type.GetCurrentSol().GetInstances();
		        var i, cnt = insts.length;
		        for (i = 0; i < cnt; i++)
		            this.RemoveChess(insts[i].GetUID());
		    } else // uid
		    {
		        var uid = obj_type;
		        this.RemoveChess(uid);
		    }
		},

		MoveChess(chess_type, tile_objs) 
		{
		    var chess_uid = getUID(chess_type);
		    var tile_uid = getUID(tile_objs);
		    if ((chess_uid == null) || (tile_uid == null))
		        return;

		    var chess_xyz = this.uid2xyz(chess_uid);
		    var tile_xyz = this.uid2xyz(tile_uid);
		    if ((chess_xyz == null) || (tile_xyz == null))
		        return;
		    this.MoveChess(chess_uid, tile_xyz.x, tile_xyz.y, chess_xyz.z);
		},

		MoveChess2LXYZ(chess_type, x, y, z) 
		{
		    var chess_uid = getUID(chess_type);
		    if (chess_uid == null)
		        return;

		    this.RemoveChess(chess_uid, true);
		    this.AddChess(chess_uid, x, y, z);
		},

		SwapChess(uidA, uidB) 
		{
		    this.SwapChess(uidA, uidB);
		},

		PickAllChess() 
		{
		    this.PickAllInsts();
		},

		PickChessAtLXY(chess_type, x, y) 
		{
		    this.PickChessAtLXY(chess_type, x, y);
		},
		PickChessAboveTile(chess_type, tile_type) 
		{
		    this.PickChessAboveTile(chess_type, tile_type);
		},
		PickChessAboveTileUID(chess_type, tile_uid) 
		{
		    this.PickChessAboveTileUID(chess_type, tile_uid);
		},

		PickChessAtLXYZ(chess_type, x, y, z) 
		{
		    this.PickChessAtLXYZ(chess_type, x, y, z);
		},
		SetBoardWidth(width) 
		{
		    this.SetBoardWidth(width - 1);
		},

		SetBoardHeight(height) 
		{
		    this.SetBoardHeight(height - 1);
		},

		PickNeighborChess(origin, dir, chess_type) 
		{
		    if (!origin)
		        return false;

		    var origin_insts = origin.GetCurrentSol().GetInstances();
		    this.PickNeighborChess(origin_insts, dir, chess_type);
		},

		CreateChessAboveTile(chess_type, tile_type, z, layer) 
		{
		    if ((!chess_type) || (tile_type == null))
		        return false;

		    // create chess above tile instances
		    if (typeof (tile_type) === "object") {
		        var tiles = tile_type.GetCurrentSol().GetInstances();
		        var i, tiles_cnt = tiles.length;
		        for (i = 0; i < tiles_cnt; i++) {
		            var xyz = this.uid2xyz(tiles[i].GetUID());
		            if (xyz == null)
		                continue;
		            this.CreateChess(chess_type, xyz.x, xyz.y, z, layer);
		        }
		    }

		    // tile_type is inst_uid or symbol, or list in JSON string
		    else {
		        var xyz = this.uid2xyz(tile_type);

		        // single tile
		        if (xyz) {
		            this.CreateChess(chess_type, xyz.x, xyz.y, z, layer);
		        } else // might be list in JSON string
		        {
		            var uid_list;
		            try {
		                uid_list = JSON.parse(tile_type);
		            } catch (e) {
		                uid_list = null;
		            }

		            if (uid_list === null)
		                return;

		            var i, cnt = uid_list.length,
		                xyz;
		            for (i = 0; i < cnt; i++) {
		                xyz = this.uid2xyz(uid_list[i]);
		                if (xyz == null)
		                    continue;
		                this.CreateChess(chess_type, xyz.x, xyz.y, z, layer);
		            }
		        }

		    }
		},

		FillChess(tile_type, layer, z) 
		{
		    // not support in infinityMode
		    if (this.infinityMode)
		        return;

		    if (!tile_type)
		        return false;
		    if (z == null)
		        z = 0;
		    var x, y;
		    for (y = 0; y <= this.y_max; y++) {
		        for (x = 0; x <= this.x_max; x++) {
		            this.CreateChess(tile_type, x, y, z, layer);
		        }
		    }
		},

		SetWrapMode(enable) 
		{
		    this.isWrapMode = (enable == 1);
		},

		PickChess(chess_type) 
		{
		    this.PickChess(chess_type);
		},

		PickChessAtLX(chess_type, x) 
		{
		    this.PickChessAtLX(chess_type, x);
		},

		PickChessAtLY(chess_type, y) 
		{
		    this.PickChessAtLY(chess_type, y);
		},

		PickChessAtLZ(chess_type, z) 
		{
		    this.PickChessAtLZ(chess_type, z);
		},

		MoveChessLZ(chess_type, z) 
		{
		    var chess_uid = getUID(chess_type);
		    if (chess_uid == null)
		        return;

		    var xyz = this.uid2xyz(chess_uid);
		    if (xyz == null)
		        return;

		    this.RemoveChess(chess_uid);
		    this.AddChess(chess_uid, xyz.x, xyz.y, z);
		},

		MoveChessLXY(chess_type, x, y) 
		{
		    var chess_uid = getUID(chess_type);
		    if (chess_uid == null)
		        return;

		    var xyz = this.uid2xyz(chess_uid);
		    if (xyz == null)
		        return;

		    this.RemoveChess(chess_uid);
		    this.AddChess(chess_uid, x, y, xyz.z);
		},

		PickChessInsideSquare(chess_type, x0, x1, y0, y1) 
		{
		    this.PickChessInsideSquare(chess_type, x0, x1, y0, y1);
		}
	};
}