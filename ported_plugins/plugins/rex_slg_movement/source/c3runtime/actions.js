"use strict";

{
	C3.Plugins.Rex_SLGMovement.Acts =
	{
	    Setup(boardObjType, groupObjType) 
	    {
	        var board = boardObjType.GetFirstPicked();
	        if (board.check_name == "BOARD")
	            this.board = board;

	        var group = groupObjType.GetFirstPicked();
	        if (group.check_name == "INSTGROUP")
	            this.group = group;
	    },

	    SetCost(value) 
	    {
	        if ((value < 0) && (value != prop_BLOCKING)) {
	            value = 0;
	        }
	        this.costValue = value;
	    },

	    AppendFilter(filterUID) 
	    {
	        if (this.filterUIDList.indexOf(filterUID) == (-1))
	            this.filterUIDList.push(filterUID);
	    },


	    GetMoveableArea(chessObjType, movingPoints, cost, filterFnName, groupName) 
	    {
	        this.requestInit();

	        var saveToGroup = this.GetInstGroup().GetGroup(groupName);
	        var board = this.GetBoard();

	        saveToGroup.Clean();
	        var chessUID = getUID(chessObjType);
	        var _xyz = this.uid2xyz(chessUID);
	        if (_xyz == null)
	            return;
	        if ((movingPoints != prop_INFINITY) && (movingPoints <= 0))
	            return;

	        this.exp_ChessUID = chessUID;
	        var tileUIDs = this.getMoveableArea(chessUID, movingPoints, cost);

	        // no filter applied
	        if (filterFnName == "") {
	            saveToGroup.SetByUIDList(tileUIDs);
	        } else {
	            // filter applied
	            var i, cnt = tileUIDs.length,
	                uid, _xyz;
	            this.filterFnName = filterFnName;
	            this.filterUIDList.length = 0;

	            this.exp_CurTile = _tileNode;
	            for (i = 0; i < cnt; i++) {
	                uid = tileUIDs[i];
	                if (!isNaN(uid))
	                    uid = parseInt(uid);

	                this.exp_CurTile.uid = uid;
	                _xyz = this.uid2xyz(uid);
	                this.exp_CurTile.x = _xyz.x;
	                this.exp_CurTile.y = _xyz.y;
	                this.Trigger(C3.Plugins.Rex_SLGMovement.Cnds.OnFilterFn);
	            }
	            saveToGroup.SetByUIDList(this.filterUIDList);
	        }
	    },

	    GetMovingPath(chessObjType, tileObjType, movingPoints, cost, groupName, isNearest) 
	    {
	        this.requestInit();

	       	var saveToGroup = this.GetInstGroup().GetGroup(groupName);
	        var board = this.GetBoard();
	        saveToGroup.Clean();
	        var chessUID = getUID(chessObjType);
	        var tileUID = getUID(tileObjType);

	        
	        if ((chessUID == null) || (tileUID == null))
	            return;
	        if ((movingPoints != prop_INFINITY) && (movingPoints <= 0))
	            return;
	        if (this.uid2xyz(chessUID) == null)
	            return;
	        tileUID = this.lz2uid(tileUID, 0);
	        if (tileUID == null)
	            return;
			
	        this.exp_ChessUID = chessUID;
	        var pathTilesUIDList = this.getMovingPath(chessUID, tileUID, movingPoints, cost, isNearest);
	        if (pathTilesUIDList.length > 0) {
	            saveToGroup.SetByUIDList(pathTilesUIDList);

	            this.exp_EndTileUID = pathTilesUIDList[pathTilesUIDList.length - 1];
	            var xyz = this.uid2xyz(this.exp_EndTileUID);
	            this.exp_EndX = xyz.x;
	            this.exp_EndY = xyz.y;
	        } else {
	            this.exp_EndTileUID = -1;
	            this.exp_EndX = -1;
	            this.exp_EndY = -1;
	        }
	    },

	    SetPathMode(m) 
	    {
	        this.pathMode = m;
	    },

	    SetRandomGenerator(randomGen_objs) 
	    {
	        var randomGen = randomGen_objs.GetFirstPicked();
	        if (randomGen.check_name == "RANDOM")
	            this.randomGen = randomGen;
	    }
	};
}