"use strict";

{
	C3.Plugins.Rex_SLGMovement.Instance = class Rex_SLGMovementInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties


		    this.board = null;
		    this.boardUid = -1; // for loading         
		    this.group = null;
		    this.groupUid = -1; // for loading        
		    this.randomGen = null;
		    this.randomGenUid = -1; // for loading
		    this.costFnName = null;
		    this.filterFnName = null;
		    this.costValue = 0;
		    this.filterUIDList = [];
		    this.isCostFnMode = null;
		    this.neighborsLXY = [];
		    this.uid2cost = {};

		    this.exp_ChessUID = -1;
		    this.exp_StartTileUID = -1;
		    this.exp_StartX = -1;
		    this.exp_StartY = -1;
		    this.exp_NearestTileUID = -1;
		    this.exp_CurTile = null;
		    this.exp_PreTile = null;
		    this.exp_EndTileUID = -1;
		    this.exp_EndX = -1;
		    this.exp_EndY = -1;
			
			if (properties)		// note properties may be null in some cases
			{
				this.pathMode = properties[0];
			    this.cacheCostMode = (properties[1] === 1);
			    this.shuffleNeighborsMode = (properties[2] === 1);
			    this.weightHeuristic = properties[3];
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				 "pm": this.pathMode,
	            "boarduid": (this.board != null) ? this.board.uid : (-1),
	            "groupuid": (this.group != null) ? this.group.uid : (-1),
	            "randomuid": (this.randomGen != null) ? this.randomGen.uid : (-1),
	            "chessuid": this.exp_ChessUID,
	            "nearesttileuid": this.exp_NearestTileUID,
	            "uid2cost": this.uid2cost,
	            "start": [this.exp_StartTileUID, this.exp_StartX, this.exp_StartY],
	            "end": [this.exp_EndTileUID, this.exp_EndX, this.exp_EndY],
			};
		}
		
		LoadFromJson(o)
		{
	        this.pathMode = o["pm"];
	        this.boardUid = o["boarduid"];
	        this.groupUid = o["groupuid"];
	        this.randomGenUid = o["randomuid"];
	        this.exp_ChessUID = o["chessuid"];
	        this.exp_NearestTileUID = o["nearesttileuid"];
	        this.uid2cost = o["uid2cost"];
	        this.exp_StartTileUID = o["start"][0];
	        this.exp_StartX = o["start"][1];
	        this.exp_StartY = o["start"][2];
	        this.exp_EndTileUID = o["end"][0];
	        this.exp_EndX = o["end"][1];
	        this.exp_EndY = o["end"][2];
		}

	    GetBoard () 
	    {
	        if (this.board != null)
	            return this.board;

	        var plugins = this._runtime.GetAllObjectClasses();
	        var name, inst;
	        for (name in plugins) {
	            inst = plugins[name]._instances[0];

	            if (inst && C3.Plugins.Rex_SLGBoard && (inst._sdkInst instanceof C3.Plugins.Rex_SLGBoard.Instance)) {
	                this.board = inst._sdkInst;
	                return this.board;
	            }
	        }
	        return null;
	    }

	    GetInstGroup () 
	    {
	        if (this.group != null)
	            return this.group;

	        var plugins = this._runtime.GetAllObjectClasses();
	        var name, inst;
	        for (name in plugins) {
	            inst = plugins[name]._instances[0];

	            if (inst && C3.Plugins.Rex_gInstGroup && (inst._sdkInst instanceof C3.Plugins.Rex_gInstGroup.Instance)) {
	                this.group = inst._sdkInst;
	                return this.group;
	            }
	        }
	        return null;
	    }

	    IsInsideBoard (x, y, z) 
	    {
	        return this.GetBoard().IsInsideBoard(x, y, z);
	    }


	    xyz2uid (x, y, z) 
	    {
	        return this.GetBoard().xyz2uid(x, y, z);
	    }

	    uid2xyz (uid) 
	    {
	        return this.GetBoard().uid2xyz(uid);
	    }

	    lz2uid (uid, lz) 
	    {
	        return this.GetBoard().lz2uid(uid, lz);
	    }

	    lxy2dist (lx0, ly0, lx1, ly1) 
	    {
	        return this.GetBoard().GetLayout().LXYZ2Dist(lx1, ly1, 0, lx0, ly0, 0, true);
	    }
	    lxy2px (lx, ly) 
	    {
	        return this.GetBoard().GetLayout().LXYZ2PX(lx, ly, 0);
	    }

	    lxy2py (lx, ly) 
	    {
	        return this.GetBoard().GetLayout().LXYZ2PY(lx, ly, 0);
	    }


	    getCostFromEvent (currentNode, previousNode) 
	    {
	        var cost;
	        if (this.isCostFnMode) {
	            this.exp_CurTile = currentNode;
	            this.exp_PreTile = previousNode;
	            this.costValue = prop_BLOCKING;
	            this.Trigger(C3.Plugins.Rex_SLGMovement.Cnds.OnCostFn);
	            this.exp_CurTile = null;
	            this.exp_PreTile = null;
	            cost = this.costValue;
	        } else
	            cost = this.costFnName;
	        return cost;
	    }

	    resetNeighborsLXY (dirCount) 
	    {
	        if (this.neighborsLXY.length > dirCount) {
	            this.neighborsLXY.length = dirCount;
	        } else if (this.neighborsLXY.length < dirCount) {
	            for (var i = this.neighborsLXY.length; i < dirCount; i++) {
	                this.neighborsLXY.push({
	                    x: 0,
	                    y: 0
	                });
	            }
	        }
	    }

	    getNeighborsLXY (_x, _y) 
	    {
	        var board = this.GetBoard();
	        this.resetNeighborsLXY(board.GetLayout().GetDirCount());
	        var dir;
	        var neighborsCnt = this.neighborsLXY.length;
	        for (dir = 0; dir < neighborsCnt; dir++) {
	            this.neighborsLXY[dir].x = board.GetNeighborLX(_x, _y, dir);
	            this.neighborsLXY[dir].y = board.GetNeighborLY(_x, _y, dir);
	        }

	        if (this.shuffleNeighborsMode) {
	            _shuffle(this.neighborsLXY, this.randomGen);
	        }
	        return this.neighborsLXY;
	    }
	    getAStartNode(uid) 
	    {
	        // create node and put it into GLOBOL_NODES
	        GLOBOL_NODES_ORDER_INDEX += 1;
	        if (GLOBOL_NODES[uid] == null) {
	            var node = nodeCache.allocLine();
	            if (node == null)
	                node = new nodeKlass(this, uid);
	            else
	                node.init(this, uid);
	            GLOBOL_NODES[uid] = node;
	        }
	        return GLOBOL_NODES[uid];
	    }
	    getAStartClosedNodes(nodes) 
	    {
	        var closedNodes = [];
	        var uid, node;
	        for (uid in nodes) {
	            node = nodes[uid];
	            if (node.closed) // get closed node
	                closedNodes.push(node);
	        }
	        closedNodes.sort(SORT_BY_ORDER); // sorting by created order
	        var i, cnt = closedNodes.length;
	        for (i = 0; i < cnt; i++) {
	            closedNodes[i] = closedNodes[i].uid;
	        }
	        return closedNodes;
	    }
	    releaseAStartNodes() 
	    {
	        // release all nodes into node cache
	        var uid;
	        for (uid in GLOBOL_NODES) {
	            nodeCache.freeLine(GLOBOL_NODES[uid]);
	            delete GLOBOL_NODES[uid];
	        }
	        GLOBOL_NODES_ORDER_INDEX = -1;
	    }


	    RandomInt (a, b) 
	    {
	        return Math.floor(this.Random() * (b - a) + a);
	    }

	    Random () 
	    {
	        return (this.randomGen == null) ?
	            Math.random() : this.randomGen.random();
	    }

	    UID2DIR (t0_uid, t1_uid) 
	    {
	        var t0_xyz = this.uid2xyz(t0_uid);
	        var t1_xyz = this.uid2xyz(t1_uid);
	        var dir = this.GetBoard().GetLayout().XYZ2Dir(t0_xyz, t1_xyz);
	        return dir;
	    }

	    setupCostFunction (cost) 
	    {
	        this.costFnName = cost;
	        this.isCostFnMode = (typeof cost == "string");
	    }

	    getTileUID (chessUID) 
	    {
	        var chess_xyz = this.uid2xyz(chessUID);
	        if (chess_xyz == null)
	            return null;
	        var tileUID = this.xyz2uid(chess_xyz.x, chess_xyz.y, 0);
	        return tileUID;
	    }

	    requestInit () 
	    {
	        cleanTable(this.uid2cost);
	        this.exp_NearestTileUID = -1;
	    }

	    getStartUID (chessUID) 
	    {
	        var startTileUID = this.getTileUID(chessUID);
	        if (startTileUID != null) {
	            this.exp_StartTileUID = startTileUID;
	            var xyz = this.uid2xyz(startTileUID);
	            this.exp_StartX = xyz.x;
	            this.exp_StartY = xyz.y;
	        } else {
	            this.exp_StartTileUID = -1;
	            this.exp_StartX = -1;
	            this.exp_StartY = -1;
	        }

	        return startTileUID;
	    }

	    getMoveableArea (chessUID, movingPoints, cost) 
	    {
	        var startTileUID = this.getStartUID(chessUID);
	        if (startTileUID == null)
	            return [];

	        var nodes = this.AStartSearch(startTileUID, null, movingPoints, cost, CMD_AREA);
	        if (nodes == null)
	            return [];

	        var areaTilesUIDList = this.getAStartClosedNodes(nodes);
	        C3.arrayFindRemove(areaTilesUIDList, startTileUID);
	        this.releaseAStartNodes();
	        return areaTilesUIDList;
	    }

	    getMovingPath(chessUID, endTileUID, movingPoints, cost, isNearest) 
	    {
	        var startTileUID = this.getStartUID(chessUID);
	        if (startTileUID == null)
	            return [];

	        var searchCmd = (isNearest === 1) ? CMD_PATH_NEAREST : CMD_PATH;
	        var nodes = this.AStartSearch(startTileUID, endTileUID, movingPoints, cost, searchCmd);
	        if (nodes == null)
	            return [];

	        if (isNearest === 1)
	            endTileUID = this.exp_NearestTileUID;

	        var startNode = nodes[startTileUID];
	        var pathUIDs = nodes[endTileUID].path2Root(startNode);
	        this.releaseAStartNodes();
	        return pathUIDs;
	    }


	    AStartSearch(startTileUID, endTileUID, movingPoints, cost, searchCmd) 
	    {
	        // path mode: 0=Random, 1=Diagonal, 2=Straight, 3=A*, 4=Line, 5=A* -line, 6=A* -random

	        var IS_PATH_SEARCH = (searchCmd == CMD_PATH) || (searchCmd == CMD_PATH_NEAREST);
	        var IS_AREA_SEARCH = (searchCmd == CMD_AREA);
	        var isAStart = (this.pathMode == 3) || (this.pathMode == 5) || (this.pathMode == 6);
	        var astarHeuristicEnable = IS_PATH_SEARCH && isAStart;
	        var shortestPathEnable = IS_PATH_SEARCH && (!isAStart);
	        var astarHeuristicMode = (!astarHeuristicEnable) ? null :
	            (this.pathMode == 3) ? 0 :
	            (this.pathMode == 5) ? 1 :
	            (this.pathMode == 6) ? 2 :
	            null;


	        this.setupCostFunction(cost);

	        var end = (endTileUID != null) ? this.getAStartNode(endTileUID) : null;
	        //if ((end != null) && (searchCmd == CMD_PATH))
	        //{
	        //    var neighbors = end.getNeighborNodes();
	        //    var il = neighbors.length;
	        //    var all_walls = true;
	        //    for(var i=0; i<il; ++i) 
	        //    {
	        //        if ( !isWall( end.getCost(neighbors[i]) ) )
	        //        {
	        //            all_walls = false;
	        //            break;
	        //        }
	        //    }
	        //    if (all_walls)
	        //        return;
	        //}

	        var start = this.getAStartNode(startTileUID);
	        start.h = start.heuristic(end, astarHeuristicMode);

	        // NEAREST NODE
	        var closestNode = start;
	        // helper function to update closerH                
	        var updateCloserH = function (node, baseNode) {
	            if (astarHeuristicEnable)
	                node.closerH = node.h;
	            else
	                node.closerH = node.closerH || node.heuristic(end, astarHeuristicMode, baseNode);
	        };
	        if (IS_PATH_SEARCH) {
	            updateCloserH(closestNode);
	            this.exp_NearestTileUID = closestNode.uid;
	        }
	        // NEAREST NODE

	        openHeap.push(start);
	        while (openHeap.size() > 0) {
	            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
	            var currentNode = openHeap.pop();

	            // End case -- result has been found, return the traced path.
	            if (astarHeuristicEnable && (currentNode === end)) {
	                break;
	                //return GLOBOL_NODES;
	            }

	            // Normal case -- move currentNode from open to closed, process each of its neighbors.
	            currentNode.closed = true;

	            // Find all neighbors for the current node.
	            var neighbors = currentNode.getNeighborNodes();

	            var il = neighbors.length;
	            for (var i = 0; i < il; ++i) {
	                var neighbor = neighbors[i];
	                var neighborCost = neighbor.getCost(currentNode);
	                if (neighbor.closed || isWall(neighborCost)) {
	                    // Not a valid node to process, skip to next neighbor.
	                    //log("("+neighbor.x+","+neighbor.y+") is closed");
	                    continue;
	                }

	                // The g score is the shortest distance from start to current node.
	                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
	                var gScore = currentNode.g + neighborCost,
	                    beenVisited = neighbor.visited;

	                //log("("+currentNode.x+","+currentNode.y+") -> ("+neighbor.x+","+neighbor.y+")="+neighborCost+" ,acc="+gScore);
	                if ((movingPoints != prop_INFINITY) && (gScore > movingPoints)) {
	                    //log("("+neighbor.x+","+neighbor.y+") out of range");
	                    continue;
	                }

	                if (!beenVisited || gScore < neighbor.g) {

	                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
	                    neighbor.visited = true;
	                    neighbor.parent.length = 0;
	                    neighbor.parent.push(currentNode.uid);
	                    neighbor.h = neighbor.h || neighbor.heuristic(end, astarHeuristicMode, start);
	                    neighbor.g = gScore;
	                    neighbor.f = neighbor.g + neighbor.h;
	                    this.uid2cost[neighbor.uid] = gScore;

	                    // NEAREST NODE
	                    if (IS_PATH_SEARCH) {
	                        updateCloserH(neighbor, start);
	                        var isNeighborMoreCloser = (neighbor.closerH < closestNode.closerH) ||
	                            ((neighbor.closerH === closestNode.closerH) && (neighbor.g < closestNode.g));

	                        if (isNeighborMoreCloser) {
	                            closestNode = neighbor;
	                            this.exp_NearestTileUID = closestNode.uid;
	                        }
	                    }
	                    // NEAREST NODE

	                    if (!beenVisited) {
	                        // Pushing to heap will put it in proper place based on the 'f' value.
	                        openHeap.push(neighbor);
	                        //log("push ("+neighbor.x+","+neighbor.y+") ")
	                    } else {
	                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
	                        openHeap.rescoreElement(neighbor);
	                        //log("reorder ("+neighbor.x+","+neighbor.y+") ")
	                    }
	                } else if (shortestPathEnable && (gScore == neighbor.g)) {
	                    neighbor.parent.push(currentNode.uid);

	                    //if (neighbor.parent.indexOf(currentNode.uid) == -1)                    
	                    //    neighbor.parent.push(currentNode.uid);                    
	                    //else                    
	                    //    debugger;                 

	                    //log("drop ("+neighbor.x+","+neighbor.y+") ")                
	                } else {
	                    //log("drop ("+neighbor.x+","+neighbor.y+") ")       
	                }
	            }

	        }

	        openHeap.clean();
	        return GLOBOL_NODES;
	    }

	};
}