"use strict";

{
	C3.Plugins.Rex_SLGBoard.Cnds =
	{

	    ForEachCell(direction) 
	    {
	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event);

	        var self = this;
	        var callback = function (x, y) {
	            if (solModifierAfterCnds)
	                self._runtime.GetEventSheetManager().PushCopySol(solmod);

	            self.exp_CurLX = x;
	            self.exp_CurLY = y;
	            current_event.Retrigger(current_frame,h);

	            if (solModifierAfterCnds)
	                self._runtime.GetEventSheetManager().PopSol(solmod);

	        }

	        var maxX, maxY, minX, minY;
	        if (this.infinityMode) {
	            maxX = this.board.GetMaxX();
	            maxY = this.board.GetMaxY();
	            minX = this.board.GetMinX();
	            minY = this.board.GetMinY();
	        } else {
	            maxX = this.x_max;
	            maxY = this.y_max;
	            minX = 0;
	            minY = 0;
	        }

	        var curLX, curLY;
	        // Top to bottom, or Bottom to top -> y axis
	        if ((direction === 0) || (direction === 1)) {
	            for (var y = minY; y <= maxY; y++) {
	                curLY = (direction === 0) ? y : (maxY - y);
	                for (var x = minX; x <= maxX; x++) {
	                    curLX = x;
	                    callback(curLX, curLY);
	                }
	            }
	            p.Pop();
	        }

	        // Left to right, or Right to left -> x axis
	        else if ((direction === 2) || (direction === 3)) {
	            for (var x = minX; x <= maxX; x++) {
	                curLX = (direction === 2) ? x : (maxX - x);
	                for (var y = minY; y <= maxY; y++) {
	                    curLY = y;
	                    callback(curLX, curLY);
	                }
	            }
	            p.Pop();
	        }
	        return false;
	    },

	    IsOccupied(x, y, z) 
	    {
	        if (!this.IsInsideBoard(x, y))
	            return false;

	        return (this.xyz2uid(x, y, z) != null);
	    },

	    IsEmpty(x, y, z) 
	    {
	        return this.IsEmpty(x, y, z);
	    },

	    OnCollided(objA, objB) 
	    {
	        this.overlapTest(objA, objB);
	        // We've aleady run the event by now.
	        return false;
	    },

	    IsOverlapping(objA, objB) 
	    {
	        this.overlapTest(objA, objB);
	        // We've aleady run the event by now.
	        return false;
	    },

	    PointIsInBoard(px, py) 
	    {
	        return this.PointIsInBoard(px, py);
	    },

	    AreNeighbors(uidA, uidB) 
	    {
	        return (this.uid2NeighborDir(uidA, uidB) != null);
	    },

	    PickAllChess() {
	        return this.PickAllInsts();
	    },

	    OnChessKicked(chess_type) 
	    {
	        _uids.length = 0;
	        _uids.push(this.kickedChessUID);
	        var has_inst = this.PickUIDs(_uids, chess_type);
	        _uids.length = 0;
	        return has_inst;
	    },

	    PickChessAtLXY(chess_type, x, y) 
	    {
	        return this.PickChessAtLXY(chess_type, x, y);
	    },
	    PickChessAboveTile(chess_type, tile_type) 
	    {
	        return this.PickChessAboveTile(chess_type, tile_type);
	    },
	    PickChessAboveTileUID(chess_type, tile_uid) 
	    {
	        return this.PickChessAboveTileUID(chess_type, tile_uid);
	    },
	    IsOnTheBoard(chess_type) 
	    {
	        if (!chess_type)
	            return false;
	        var sol = chess_type.GetCurrentSol();
	        var chess_insts = sol.GetInstances();
	        var i, cnt = chess_insts.length,
	            uid;
	        var items = this.GetAllChess();
	        for (i = 0; i < cnt; i++) {
	            uid = chess_insts[i].GetUID();
	            if (!items.hasOwnProperty(uid))
	                return false;
	        }
	        return true;
	    },
	    PickChessAtLXYZ(chess_type, x, y, z) 
	    {
	        return this.PickChessAtLXYZ(chess_type, x, y, z);
	    },

	    PickNeighborChess(origin, dir, chess_type) 
	    {
	        if (!origin)
	            return false;
	        var origin_insts = origin.GetCurrentSol().GetInstances();
	        return this.PickNeighborChess(origin_insts, dir, chess_type);
	    },

	    
	    PickEmptyCell(z) 
	    {
	        // not support in infinityMode
	        if (this.infinityMode)
	            return false;

	        var x, y;
	        for (x = 0; x <= this.x_max; x++) {
	            for (y = 0; y <= this.y_max; y++) {
	                if (this.IsEmpty(x, y, z)) {
	                    __empty_cells.push([x, y]);
	                }
	            }
	        }
	        var cnt = __empty_cells.length;
	        if (cnt > 0) {
	            var i = Math.floor(Math.random() * cnt);
	            this.exp_EmptyLX = __empty_cells[i][0];
	            this.exp_EmptyLY = __empty_cells[i][1];
	        } else {
	            this.exp_EmptyLX = -1;
	            this.exp_EmptyLY = -1;
	        }
	        __empty_cells.length = 0;
	        return (cnt > 0);
	    },

	    HasEmptyCell(z) 
	    {
	        // not support in infinityMode        
	        if (this.infinityMode)
	            return true;

	        var x, y;
	        for (x = 0; x <= this.x_max; x++) {
	            for (y = 0; y <= this.y_max; y++) {
	                if (this.IsEmpty(x, y, z)) {
	                    this.exp_EmptyLX = x;
	                    this.exp_EmptyLY = y;
	                    return true;
	                }
	            }
	        }
	        return false;
	    },

	    AreWrappedNeighbors(uidA, uidB) 
	    {
	        var dir1 = this.uid2NeighborDir(uidA, uidB, 1);
	        if (dir1 == null)
	            return false;

	        var dir0 = this.uid2NeighborDir(uidA, uidB, 0);
	        return (dir1 != dir0);
	    },

	    PickChess(chess_type) 
	    {
	        return this.PickChess(chess_type);
	    },

	    PickChessAtLX(chess_type, x) 
	    {
	        return this.PickChessAtLX(chess_type, x);
	    },

	    PickChessAtLY(chess_type, y) 
	    {
	        return this.PickChessAtLY(chess_type, y);
	    },

	    PickChessAtLZ(chess_type, z) 
	    {
	        return this.PickChessAtLZ(chess_type, z);
	    },

	    PickEmptyCellOnTiles(tile_type, z) 
	    {
	        if (!tile_type)
	            return false;
	        var tiles = tile_type.GetCurrentSol().GetInstances();

	        var xyz, i, cnt = tiles.length;
	        for (i = 0; i < cnt; i++) {
	            xyz = this.uid2xyz(tiles[i].GetUID());
	            if (xyz == null)
	                continue;

	            if (this.IsEmpty(xyz.x, xyz.y, z)) {
	                __empty_cells.push([xyz.x, xyz.y]);
	            }
	        }

	        cnt = __empty_cells.length;
	        if (cnt > 0) {
	            var i =  Math.floor(Math.random() * cnt);
	            this.exp_EmptyLX = __empty_cells[i][0];
	            this.exp_EmptyLY = __empty_cells[i][1];
	        } else {
	            this.exp_EmptyLX = -1;
	            this.exp_EmptyLY = -1;
	        }
	        __empty_cells.length = 0;
	        return (cnt > 0);
	    },

	    HasEmptyCellOnTiles(tile_type, z) 
	    {
	        if (!tile_type)
	            return false;
	        var tiles = tile_type.GetCurrentSol().GetInstances();
	        var xyz, i, cnt = tiles.length;
	        for (i = 0; i < cnt; i++) {
	            xyz = this.uid2xyz(tiles[i].GetUID());
	            if (xyz == null)
	                continue;

	            if (this.IsEmpty(xyz.x, xyz.y, z)) {
	                this.exp_EmptyLX = xyz.x;
	                this.exp_EmptyLY = xyz.y;
	                return true;
	            }
	        }

	        this.exp_EmptyLX = -1;
	        this.exp_EmptyLY = -1;
	        return false;
	    },
	    IsChessOnBoard(chess_type) 
	    {
	        if (!chess_type)
	            return false;
	        var chess = chess_type.GetFirstPicked();
	        if (!chess)
	            return false;

	        return !!this.uid2xyz(chess.GetUID());
	    },

	    PickChessInsideSquare(chess_type, x0, x1, y0, y1) 
	    {
	        return this.PickChessInsideSquare(chess_type, x0, x1, y0, y1);
	    },

	    ForEachLZ(x, y) 
	    {
	        var zHash = this.xy2zHash(x, y);
	        if (!zHash)
	            return false;

	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event);

	        for (var z in zHash) {
	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PushCopySol(solmod);

	            if (!isNaN(z))
	                z = parseFloat(z);
	            this.exp_CurLZ = z;
	            current_event.Retrigger(current_frame,h);

	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PopSol(solmod);
	        }
	        p.Pop();
	        return false;
	    }

	};
}