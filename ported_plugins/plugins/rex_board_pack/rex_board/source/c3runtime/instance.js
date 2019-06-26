"use strict";

{
	C3.Plugins.Rex_SLGBoard.Instance = class Rex_SLGBoardInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			this.inst = this._inst;
			const b = this._runtime.Dispatcher();
        	this._disposables = new C3.CompositeDisposable(C3.Disposable.From(b, "instancedestroy", (a) => this._OnInstanceDestroyed(a.instance)), C3.Disposable.From(b, "afterload", () => this._OnAfterLoad()))
    		
			// Initialise object properties
			this.board = new window.RexC2BoardKlass();
	        this.check_name = "BOARD";


	        this.layout = null;
	        this.layoutUid = -1; // for loadings
	        this.kickedChessUID = -1;
	        this.exp_EmptyLX = -1;
	        this.exp_EmptyLY = -1;
	        this.exp_CurLX = 0;
	        this.exp_CurLY = 0;
	        this.exp_CurLZ = 0;
			if (properties)		// note properties may be null in some cases
			{
		        this.infinityMode = (properties[3] === 1);
	        	this.isWrapMode = (properties[2] === 1);
	        	this.ResetBoard(properties[0] - 1, properties[1] - 1);
			}
		}
		
		Release()
		{
			super.Release();
		}
		_OnInstanceDestroyed(inst)
		{
			this.RemoveChess(inst.GetUID());
        	if (inst == inst.GetUID()){
        		
        		this.ResetBoard(-1, -1);
        	}
		}
		_OnAfterLoad()
		{
	        if (this.layoutUid === -1)
	            this.layout = null;
	        else{
        		this.layout = this._runtime.GetInstanceByUID(this.layoutUid);
	        }
            this.layoutUid = -1;
        }
		SaveToJson()
		{
			var layout = this.GetLayout();
			return {
	            "luid": (layout != null) ? layout.uid : (-1),
	            "mx": this.x_max,
	            "my": this.y_max,
	            "b": this.board.saveToJSON(),
	            "iswrap": this.isWrapMode
			};
		}
		
		LoadFromJson(o)
		{
	        this.layoutUid = o["luid"];
	        this.x_max = o["mx"];
	        this.y_max = o["my"];
	        this.board.loadFromJSON(o["b"]);
	        this.isWrapMode = o["iswrap"];
		}
	    GetLayout() 
    	{
	        if (this.layout != null)
	            return this.layout;

	        var plugins = this._runtime.GetAllObjectClasses();
	        var name, inst;
	        for (name in plugins) {

	        	inst = plugins[name]._instances[0];
	            if (inst)
	            {
		            if ((C3.Plugins.Rex_SLGSquareTx && (inst._sdkInst instanceof C3.Plugins.Rex_SLGSquareTx.Instance)) ||
	                	(C3.Plugins.Rex_SLGHexTx && (inst._sdkInst instanceof C3.Plugins.Rex_SLGHexTx.Instance)) ||
	                	(C3.Plugins.Rex_ProjectionTx && (inst._sdkInst instanceof C3.Plugins.Rex_ProjectionTx.Instance)) ||
	                	(C3.Plugins.Rex_SLGCubeTx && (inst._sdkInst instanceof C3.Plugins.Rex_SLGCubeTx.Instance))
	            		)
		            {
	                	this.layout = inst._sdkInst;
	                	return this.layout;
            		}
	        	}
	        }
	        return null;
    	}
		ResetBoard(x_max, y_max) 
		{
		    if (this.infinityMode)
		        this.x_max = -1;
		    else if (x_max >= -1)
		        this.x_max = x_max;

		    if (this.infinityMode)
		        this.y_max = -1;
		    if (y_max >= -1)
		        this.y_max = y_max;

		    this.board.Reset();
		}

		GetAllChess() 
		{
		    return this.board.GetAllChess();
		}

		SetBoardWidth(x_max) 
		{
		    if (this.infinityMode)
		        return;
		    else if (this.x_max === x_max)
		        return;
		    else if (this.x_max < x_max) // extend
		    {
		        // do nothing
		    } else // (this.x_max > x_max) : collapse
		    {
		        var x, y, z, zHash;
		        for (x = this.x_max; x > x_max; x--) {
		            for (y = 0; y <= this.y_max; y++) {
		                zHash = this.xy2zHash(x, y);
		                if (!zHash)
		                    continue;
		                for (z in zHash)
		                    this.RemoveChess(zHash[z], true);
		            }
		        }
		    }
		    this.x_max = x_max;
		}

		SetBoardHeight(y_max) 
		{
		    if (this.infinityMode)
		        return;
		    else if (this.y_max == y_max)
		        return;
		    else if (this.y_max < y_max) // extend
		    {
		        // do nothing
		    } else // (this.y_max > y_max) : collapse
		    {
		        var x, y, z, zHash;
		        for (x = 0; x <= this.x_max; x++) {
		            for (y = this.y_max; y > y_max; y--) {
		                zHash = this.xy2zHash(x, y);
		                if (!zHash)
		                    continue;
		                for (z in zHash)
		                    this.RemoveChess(zHash[z], true);
		            }
		        }
		    }
		    this.y_max = y_max;
		}

		IsInsideBoard(x, y, z) 
		{
		    var is_in_board;
		    // check x,y boundary
		    if (this.infinityMode)
		        is_in_board = true;
		    else
		        is_in_board = (x >= 0) && (y >= 0) && (x <= this.x_max) && (y <= this.y_max);

		    // check z 
		    if (is_in_board && (z != null))
		        is_in_board = (this.xyz2uid(x, y, z) != null);

		    return is_in_board;
		}

		IsEmpty(x, y, z) 
		{
		    var zHash = this.xy2zHash(x, y);
		    if (!zHash) {
		        if (this.infinityMode)
		            return true;
		        else if (!this.IsInsideBoard(x, y)) // not infinityMode
		            return false;
		        else
		            return true;
		    } else if (z === 0)
		        return (zHash[0] == null);
		    else
		        return (zHash[0] != null) && (zHash[z] == null);
		}


		xyz2uid(x, y, z) 
		{
		    return this.board.GetCell(x, y, z);
		}

		xy2zHash(x, y) 
		{
		    return this.board.GetCell(x, y) || null;
		}

		xy2zCnt(x, y) 
		{
		    var zHash = this.xy2zHash(x, y);
		    if (!zHash)
		        return 0;

		    var zcnt = 0;
		    for (var z in zHash)
		        zcnt += 1;
		    return zcnt;
		}

		lz2uid(uid, lz) 
		{
		    var o_xyz = this.uid2xyz(uid);
		    if (o_xyz == null)
		        return null;
		    if (o_xyz.z == lz)
		        return uid;

		    return this.xyz2uid(o_xyz.x, o_xyz.y, lz);
		}

		GetNeighborLX(lx, ly, dir, isWrapMode) 
		{
		    if (this.infinityMode)
		        isWrapMode = false;
		    else if (isWrapMode == null)
		        isWrapMode = this.isWrapMode;

		    var layout = this.GetLayout();
		    var nlx = layout.GetNeighborLX(lx, ly, dir);
		    if (isWrapMode)
		        nlx = this.WrapLX(nlx);

		    return nlx;
		}

		WrapLX(lx, isWrapMode) 
		{
		    if (this.infinityMode)
		        isWrapMode = false;
		    else if (isWrapMode == null)
		        isWrapMode = this.isWrapMode;

		    if (!isWrapMode)
		        return lx;

		    var cnt = this.x_max + 1;
		    lx = lx % cnt;
		    if (lx < 0)
		        lx = lx + (cnt);

		    return lx;
		}

		GetNeighborLY(lx, ly, dir, isWrapMode) 
		{
		    if (this.infinityMode)
		        isWrapMode = false;
		    else if (isWrapMode == null)
		        isWrapMode = this.isWrapMode;

		    var layout = this.GetLayout();
		    var nly = layout.GetNeighborLY(lx, ly, dir);
		    if (isWrapMode)
		        nly = this.WrapLY(nly);

		    return nly;
		}

		WrapLY(ly, isWrapMode) 
		{
		    if (this.infinityMode)
		        isWrapMode = false;
		    else if (isWrapMode == null)
		        isWrapMode = this.isWrapMode;

		    if (!isWrapMode)
		        return ly;

		    var cnt = this.y_max + 1;
		    ly = ly % cnt;
		    if (ly < 0)
		        ly = ly + (cnt);

		    return ly;
		}

		dir2uid(uid, dir, tz, isWrapMode) 
		{
		    var o_xyz = this.uid2xyz(uid);
		    if (o_xyz == null)
		        return null;

		    var tx = this.GetNeighborLX(o_xyz.x, o_xyz.y, dir, isWrapMode);
		    var ty = this.GetNeighborLY(o_xyz.x, o_xyz.y, dir, isWrapMode);
		    if (tz == null)
		        tz = o_xyz.z;
		    return this.xyz2uid(tx, ty, tz);
		}

		uid2xyz(uid) 
		{
		    return this.GetAllChess()[uid] || null;
		}

		uid2inst(uid, ignored_chess_check) 
		{
		    var uid_digital = parseInt(uid);
		    if (typeof (uid_digital) !== "number")
		        return null;
		    else if (uid_digital < 0)
		        return null;
		    else if (!ignored_chess_check && (!this.uid2xyz(uid))) // not on the board
		        return null;
		    else
		        return this._runtime.GetInstanceByUID(uid);
		}

		SwapChess(uidA, uidB) 
		{
		    var xyzA = this.uid2xyz(uidA);
		    var xyzB = this.uid2xyz(uidB);
		    if ((xyzA == null) || (xyzB == null))
		        return false;

		    this.RemoveChess(uidA);
		    this.RemoveChess(uidB);
		    this.AddChess(uidA, xyzB.x, xyzB.y, xyzB.z);
		    this.AddChess(uidB, xyzA.x, xyzA.y, xyzA.z);
		    return true;
		}

		CanPut(x, y, z, test_mode) 
		{
		    var result;
		    switch (test_mode) {
		        case 0: // x,y is inside board
		            result = this.IsInsideBoard(x, y);
		            break;
		        case 1: // x,y is inside board, and stand on a tile if z!=0
		            var check_z = (z == 0) ? null : 0;
		            result = this.IsInsideBoard(x, y, check_z);
		            break;
		        case 2: // x,y is stand on a tile and is empty
		            result = this.IsEmpty(x, y, z);
		            break;
		    }
		    return result;
		}

		RemoveChess(uid, kickingNotify) 
		{
		    if (uid == null)
		        return;

		    var xyz = this.uid2xyz(uid);
		    if (xyz == null)
		        return;

		    if (kickingNotify && this.uid2inst(uid)) {
		        this.kickedChessUID = uid;
		        this.Trigger(C3.Plugins.Rex_SLGBoard.Cnds.OnChessKicked);
		    }

		    this.board.RemoveCell(uid);
		}

		AddChess(inst, x, y, z) 
		{
		    if (inst == null)
		        return;

		    // check if lxy is inside board
		    if (!this.IsInsideBoard(x, y))
		        return;

		    // "inst" could be instance(object) or uid(number) or ?(string)
		    var instIsInstType = (typeof (inst) === "object");
		    var uid = (instIsInstType) ? inst.GetUID() : inst;

		    this.RemoveChess(uid); // keep unique uid (symbol)            
		    this.RemoveChess(this.xyz2uid(x, y, z), true);
		    this.board.AddCell(uid, x, y, z);

		    // board changed, check logical overlapping
		    if (instIsInstType || (this.uid2inst(uid) != null))
		        this.Trigger(C3.Plugins.Rex_SLGBoard.Cnds.OnCollided);
		}

		MoveChess(inst, x, y, z) 
		{
		    var uid = (typeof (inst) === "object") ? inst.GetUID() : inst;
		    this.RemoveChess(uid);
		    this.AddChess(uid, x, y, z);
		}

		uid2NeighborDir(uidA, uidB, isWrapMode) 
		{
		    var xyzA = this.uid2xyz(uidA);
		    var xyzB = this.uid2xyz(uidB);
		    if (!xyzA || !xyzB)
		        return null;

		    return this.xy2NeighborDir(xyzA.x, xyzA.y, xyzB.x, xyzB.y, isWrapMode);
		}


		xy2NeighborDir(x0, y0, x1, y1, isWrapMode) 
		{
		    GXYZA.x = x0, GXYZA.y = y0;
		    GXYZB.x = x1, GXYZB.y = y1;
		    var layout = this.GetLayout();
		    var dir = layout.NeighborXYZ2Dir(GXYZA, GXYZB);

		    if (dir == null) {
		        if (this.infinityMode)
		            isWrapMode = false;
		        if (isWrapMode == null)
		            isWrapMode = this.isWrapMode;

		        if (isWrapMode) {
		            var i, dirCount = layout.GetDirCount();
		            var tx, ty;
		            for (i = 0; i < dirCount; i++) {
		                tx = this.GetNeighborLX(GXYZA.x, GXYZA.y, i, isWrapMode);
		                ty = this.GetNeighborLY(GXYZA.x, GXYZA.y, i, isWrapMode);
		                if ((tx == GXYZB.x) && (ty == GXYZB.y)) {
		                    dir = i;
		                    break;
		                }
		            }
		        }
		    }
		    return dir;
		}

		CreateChess(objtype, x, y, z, layer) 
		{
		    if (!objtype || !layer)
		        return;

		    if (!this.IsInsideBoard(x, y))
		        return;

		    // callback
		    var self = this;
		    var callback = function(inst) {
		        self.AddChess(inst, x, y, z);
		    }
		    // callback

		    var layout = this.GetLayout();
		    var px = layout.LXYZ2PX(x, y, z);
		    var py = layout.LXYZ2PY(x, y, z);
		    var inst = window.RexC2CreateObject.call(this, objtype, layer, px, py, callback);
		    return inst;
		}

		overlapTest(_objA, _objB) 
		{
		    var _insts_A = _objA.GetCurrentSol().GetInstances();
		    var _insts_B = _objB.GetCurrentSol().GetInstances();
		    var objA, objB, insts_A, insts_B;
		    if (_insts_A.length > _insts_B.length) {
		        objA = _objB;
		        objB = _objA;
		        insts_A = _insts_B;
		        insts_B = _insts_A;
		    } else {
		        objA = _objA;
		        objB = _objB;
		        insts_A = _insts_A;
		        insts_B = _insts_B;
		    }

		    var runtime = this._runtime;
		    var current_frame = runtime.GetEventSheetManager().GetCurrentEventStackFrame();
		    var current_event = current_frame.GetCurrentEvent();
		    var solmod = current_event.GetSolModifiers();
		    var c = runtime.GetEventSheetManager().GetEventStack();
		    var p = runtime.GetEventStack(); 
		    var h = c.Push(current_event);
		    var is_the_same_type = (objA === objB);
		    var cnt_instA = insts_A.length;
		    var i, z, inst_A, uid_A, xyz_A, zHash, tmp_inst, tmp_uid;
		    var cursol_A, cursol_B;
		    for (i = 0; i < cnt_instA; i++) {
		        inst_A = insts_A[i];
		        uid_A = inst_A.GetUID();
		        xyz_A = this.uid2xyz(uid_A);
		        if (xyz_A == null)
		            continue;

		        var zHash = this.xy2zHash(xyz_A.x, xyz_A.y);
		        if (!zHash)
		            continue;

		        for (z in zHash) {
		            tmp_uid = zHash[z];
		            if (tmp_uid == uid_A)
		                continue;
		            tmp_inst = this.uid2inst(tmp_uid);
		            if (insts_B.indexOf(tmp_inst) != (-1)) {
		                runtime.GetEventSheetManager().PushCopySol(solmod);
		                cursol_A = objA.GetCurrentSol().GetInstances();
		                cursol_B = objB.GetCurrentSol().GetInstances();
		                cursol_A._SetSelectAll(false);
		                cursol_B._SetSelectAll(false);
		                // If ltype === rtype, it's the same object (e.g. Sprite collides with Sprite)
		                // In which case, pick both instances                                        
		                if (is_the_same_type) {
		                    // just use lsol, is same reference as rsol
		                    cursol_A.length = 2; //dikkat instantaceler silindi
		                    cursol_A[0] = inst_A;
		                    cursol_A[1] = tmp_inst;
		                } else // Pick each instance in its respective SOL
		                {
		                    cursol_A.length = 1;
		                    cursol_A[0] = inst_A;
		                    cursol_B.length = 1;
		                    cursol_B[0] = tmp_inst;
		                }
		                current_event.Retrigger(current_frame,h);
		                runtime.GetEventSheetManager().PopSol(solmod);
		            }
		        }
		        p.Pop();
		    }
		}

		PickUIDs(uids, chess_type, ignored_chess_check) 
		{
		    if (!chess_type)
		        return false;

		    var check_callback;
		    if (!ignored_chess_check) {
		        var self = this;
		        check_callback = function(uid) {
		            return (self.uid2xyz(uid) != null);
		        }
		    }
		    return window.RexC2PickUIDs.call(this, uids, chess_type, check_callback);
		}


		PickAllInsts() 
		{
		    var uid, inst, objtype, sol;
		    cleanTable(name2type);
		    var has_inst = false;
		    var items = this.GetAllChess();
		    for (uid in items) {
		        inst = this.uid2inst(uid);
		        if (inst == null)
		            continue;
		        objtype = inst.GetObjectClass();
		        sol = objtype.GetCurrentSol();;
		        if (!(objtype._name in name2type)) {
		            sol._SetSelectAll(false);
		            sol._instances.length = 0;
		            name2type[objtype._name] = objtype;
		        }
		        sol._instances.push(inst);
		        has_inst = true;
		    }
		    var name;
		    for (name in name2type)
		        name2type[name].ApplySolToContainer();
		    cleanTable(name2type);
		    return has_inst;
		}

		PickChess(chess_type) 
		{
		    if (!chess_type)
		        return false;

		    _uids.length = 0;
		    var u;
		    var items = this.GetAllChess();
		    for (u in items) {
		        _uids.push(parseInt(u));
		    }
		    var has_inst = this.PickUIDs(_uids, chess_type);
		    _uids.length = 0;
		    return has_inst;
		}

		PickChessAtLXY(chess_type, x, y) 
		{
		    if (!chess_type)
		        return false;

		    var zHash = this.xy2zHash(x, y);
		    if (!zHash)
		        return false;

		    _uids.length = 0;
		    var z;
		    for (z in zHash) {
		        _uids.push(zHash[z]);
		    }
		    var has_inst = this.PickUIDs(_uids, chess_type);
		    _uids.length = 0;
		    return has_inst;
		}
		PickChessAtTiles(chess_type, tiles) 
		{
		    if (!chess_type)
		        return false;

		    _uids.length = 0;
		    var tiles_cnt = tiles.length;
		    var t, tile, uid, xyz, zHash, z;
		    for (t = 0; t < tiles_cnt; t++) {
		        tile = tiles[t];
		        uid = (typeof (tile) === "object") ? tile.GetUID() : tile;
		        // Do you want to scan all tiles to pick matched symbol tiles?
		        xyz = this.uid2xyz(uid);
		        if (!xyz)
		            continue;
		        zHash = this.xy2zHash(xyz.x, xyz.y);
		        if (!zHash)
		            continue;
		        for (z in zHash) {
		            _uids.push(zHash[z]);
		        }
		    }
		    var has_inst = this.PickUIDs(_uids, chess_type);
		    _uids.length = 0;
		    return has_inst;
		}

		PointIsInBoard(px, py) 
		{
		    if (this.infinityMode)
		        return true;

		    var layout = this.GetLayout();
		    var lx = layout.PXY2LX(px, py);
		    var ly = layout.PXY2LY(px, py);
		    return this.IsInsideBoard(lx, ly);
		}

		PickChessAtLXYZ(chess_type, x, y, z) 
		{
		    if (!chess_type)
		        return false;

		    _uids.length = 0;
		    var uid = this.xyz2uid(x, y, z);
		    if (uid != null)
		        _uids.push(uid);

		    var has_inst = this.PickUIDs(_uids, chess_type);
		    _uids.length = 0;
		    return has_inst;
		}

		PickChessAtLX(chess_type, x) 
		{
		    if (!chess_type)
		        return false;


		    _uids.length = 0;

		    if (this.infinityMode) {
		        // scan all chess
		        var uid, xyz;
		        var items = this.GetAllChess();
		        for (uid in items) {
		            uid = parseInt(uid);
		            xyz = this.uid2xyz(uid);
		            if (xyz.x === x) {
		                _uids.push(uid);
		            }
		        }
		    } else {
		        // scan a line
		        var y, z, zHash, uid;
		        for (y = 0; y <= this.y_max; y++) {
		            zHash = this.xy2zHash(x, y);
		            if (!zHash)
		                continue;
		            for (z in zHash) {
		                _uids.push(zHash[z]);
		            }
		        }
		    }
		    var has_inst = this.PickUIDs(_uids, chess_type);
		    _uids.length = 0;
		    return has_inst;
		}


		PickChessAtLY(chess_type, y) 
		{
		    if (!chess_type)
		        return false;

		    _uids.length = 0;

		    if (this.infinityMode) {
		        // scan all chess
		        var uid, xyz;
		        var items = this.GetAllChess();
		        for (uid in items) {
		            uid = parseInt(uid);
		            xyz = this.uid2xyz(uid);
		            if (xyz.y === y) {
		                _uids.push(uid);
		            }
		        }
		    } else {
		        // scan a line            
		        var x, z, zHash, uid;
		        for (x = 0; x <= this.x_max; x++) 
		        {
		            zHash = this.xy2zHash(x, y);
		            if (!zHash)
		                continue;
		            for (z in zHash) {
		                _uids.push(zHash[z]);
		            }
		        }
		    }
		    var has_inst = this.PickUIDs(_uids, chess_type);
		    _uids.length = 0;
		    return has_inst;
		}

		PickChessAtLZ(chess_type, z) 
		{
		    if (!chess_type)
		        return false;

		    _uids.length = 0;

		    if (this.infinityMode) {
		        // scan all chess
		        var uid, xyz;
		        var items = this.GetAllChess();
		        for (uid in items) {
		            uid = parseInt(uid);
		            xyz = this.uid2xyz(uid);
		            if (xyz.z === z) {
		                _uids.push(uid);
		            }
		        }
		    } else {
		        // scan a face
		        var x, y, uid;
		        for (y = 0; y <= this.y_max; y++) {
		            for (x = 0; x <= this.x_max; x++) {
		                uid = this.xyz2uid(x, y, z);
		                if (uid == null)
		                    continue;

		                _uids.push(uid);
		            }
		        }
		    }
		    var has_inst = this.PickUIDs(_uids, chess_type);
		    _uids.length = 0;
		    return has_inst;
		}

		PickChessInsideSquare(chess_type, x0_, x1_, y0_, y1_) 
		{
		    if (!chess_type)
		        return false;

		    var x0 = Math.min(x0_, x1_);
		    var x1 = Math.max(x0_, x1_);
		    var y0 = Math.min(y0_, y1_);
		    var y1 = Math.max(y0_, y1_);

		    var x, y, z, zHash, uid;
		    _uids.length = 0;
		    for (y = y0; y <= y1; y++) {
		        for (x = x0; x <= x1; x++) {
		            zHash = this.xy2zHash(x, y);
		            if (!zHash)
		                continue;

		            for (z in zHash) {
		                _uids.push(zHash[z]);
		            }
		        }
		    }
		    var has_inst = this.PickUIDs(_uids, chess_type);
		    _uids.length = 0;
		    return has_inst;
		}

		PickNeighborChess(origin_insts, dir, chess_type, isWrapMode) 
		{
		    if (!chess_type)
		        return false;

		    var layout = this.GetLayout();
		    var dir_cnt = layout.GetDirCount();
		    var origin_uid;
		    var tiles_uid = [],
		        i, cnt, neighbor_uid;
		    var i, cnt = origin_insts.length;
		    for (i = 0; i < cnt; i++) {
		        origin_uid = origin_insts[i].GetUID();
		        if (dir == ALLDIRECTIONS) {
		            var i;
		            for (i = 0; i < dir_cnt; i++) {
		                neighbor_uid = this.dir2uid(origin_uid, i, 0, isWrapMode);
		                if (neighbor_uid != null)
		                    tiles_uid.push(neighbor_uid);
		            }
		        } else if ((dir >= 0) && (dir < dir_cnt)) {
		            neighbor_uid = this.dir2uid(origin_uid, dir, 0, isWrapMode);
		            if (neighbor_uid != null)
		                tiles_uid.push(this.dir2uid(origin_uid, dir, 0, isWrapMode));
		        }
		    }

		    return this.PickChessAtTiles(chess_type, tiles_uid);;
		}

		PickChessAboveTile(chess_type, tile_type) 
		{
		    if (!chess_type || !tile_type)
		        return false;
		    var tiles = tile_type.GetCurrentSol().GetInstances();
		    return this.PickChessAtTiles(chess_type, tiles);
		}

		PickChessAboveTileUID(chess_type, tile_uid) 
		{
		    if (!chess_type)
		        return;

		    // Do you want to scan all tiles to pick matched symbol tiles?
		    var xyz = this.uid2xyz(tile_uid);
		    if (xyz) // single tile
		        return this.PickChessAtLXY(chess_type, xyz.x, xyz.y);
		    else // otherwise, might be tiles list
		    {
		        var uid_list;
		        try {
		            uid_list = JSON.parse(tile_uid);
		        } catch (e) {
		            uid_list = null;
		        }

		        if (uid_list)
		            return this.PickChessAtTiles(chess_type, uid_list);
		        else
		            return false;
		    }
		}

		afterLoad() 
		{
		    if (this.layoutUid === -1)
		        this.layout = null;
		    else {
		        this.layout = this._runtime.GetInstanceByUID(this.layoutUid);
		        assert2(this.layout, "Board: Failed to find layout object by UID");
		    }

		    this.layoutUid = -1;
		}

	};
}