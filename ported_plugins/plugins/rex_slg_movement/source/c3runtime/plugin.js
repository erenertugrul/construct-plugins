"use strict";
    var GLOBOL_NODES = {};
    var prop_BLOCKING = -1;
    var prop_INFINITY = -1;
    var _tileNode = {
        uid: -1,
        x: -1,
        y: -1
    };
    var getUID = function (objs) {
        var uid;
        if (objs == null)
            uid = null;
        else if (typeof (objs) === "object") {
            var inst = objs.GetFirstPicked();
            uid = (inst != null) ? inst.GetUID() : null;
        } else
            uid = objs;

        return uid;
    };
    var _shuffle = function (arr, randomGen) {
        if (randomGen == null)
            randomGen = Math;

        var i = arr.length,
            j, temp;
        if (i == 0) return;
        while (--i) {
            j = Math.floor(randomGen.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    };
    // ----
    // javascript-astar 0.3.0
    // http://github.com/bgrins/javascript-astar
    // Freely distributable under the MIT License.
    // Implements the astar search algorithm in javascript using a Binary Heap.
    // Includes Binary Heap (with modifications) from Marijn Haverbeke.
    // http://eloquentjavascript.net/appendix2.html    
    // ----
    var CMD_PATH = 0;
    var CMD_PATH_NEAREST = 1;
    var CMD_AREA = 16;
    var ObjCacheKlass = function () {
        this.lines = [];
    };
    var ObjCacheKlassProto = ObjCacheKlass.prototype;
    ObjCacheKlassProto.allocLine = function () {
        return (this.lines.length > 0) ? this.lines.pop() : null;
    };
    ObjCacheKlassProto.freeLine = function (l) {
        this.lines.push(l);
    };
    var nodeCache = new ObjCacheKlass();

    var GLOBOL_NODES_ORDER_INDEX = -1;


    // sorting by created order
    var SORT_BY_ORDER = function (nodeA, nodeB) {
        var indexA = nodeA.orderIndex;
        var indexB = nodeB.orderIndex;
        if (indexA > indexB)
            return 1;
        else if (indexA < indexB)
            return (-1);
        else // (indexA == indexB)
            return 0;
    }

    var nodeKlass = function (plugin, uid) {
        this.parent = [];
        this.init(plugin, uid);
    };
    var nodeKlassProto = nodeKlass.prototype;
    nodeKlassProto.init = function (plugin, uid) {
        this.orderIndex = GLOBOL_NODES_ORDER_INDEX; // for sorting by created order
        var _xyz = plugin.uid2xyz(uid);
        this.plugin = plugin;
        this.uid = uid;
        this.x = _xyz.x;
        this.y = _xyz.y;
        this.px = null;
        this.py = null;
        this.cost = null;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.closerH = 0;
        this.visited = false;
        this.closed = false;
        this.parent.length = 0;
    };
    nodeKlassProto.heuristic = function (endNode, pathMode, baseNode) {
        if (pathMode === null)
            return 0;

        var h;
        var dist = this.plugin.lxy2dist(endNode.x, endNode.y, this.x, this.y) * this.plugin.weightHeuristic;

        if ((pathMode === 1) && baseNode) {
            var da = endNode.angleTo(baseNode) - this.angleTo(baseNode);
            h = dist + quickAbs(da);
        } else if (pathMode === 2) {
            h = dist + this.plugin.Random();
        } else {
            h = dist;
        }

        return h;
    };
    nodeKlassProto.getNeighborNodes = function () {
        var neighborsLXY = this.plugin.getNeighborsLXY(this.x, this.y);
        var _n, _uid;
        var neighborNodes = [];
        var i, cnt = neighborsLXY.length;
        for (i = 0; i < cnt; i++) {
            _n = neighborsLXY[i];
            _uid = this.plugin.xyz2uid(_n.x, _n.y, 0);
            if (_uid != null) {
                neighborNodes.push(this.plugin.getAStartNode(_uid));
            }
        }

        return neighborNodes;
    };
    nodeKlassProto.getCost = function (previousNode) {
        var cost;
        if (this.plugin.cacheCostMode) {
            if (this.cost == null) {
                this.cost = this.plugin.getCostFromEvent(this, previousNode);
            }
            cost = this.cost;
        } else {
            cost = this.plugin.getCostFromEvent(this, previousNode);
        }
        return cost;
    };
    var isWall = function (cost) {
        return (cost == prop_BLOCKING);
    };
    nodeKlassProto.path2Root = function (endNode) {
        var isAStartMode = (this.plugin.pathMode == 3) || (this.plugin.pathMode == 5) || (this.plugin.pathMode == 6);
        var isShortestRandomMode = (this.plugin.pathMode == 0);
        var isShortestDiagonalMode = (this.plugin.pathMode == 1);
        var isShortestStraightMode = (this.plugin.pathMode == 2);
        var isShortestLineMode = (this.plugin.pathMode == 4);

        var parentIndex, currentDir = null,
            parentDir, i, cnt;

        if (isShortestLineMode) {
            var startNode = this;
            var ta = endNode.angleTo(startNode);
        }

        var curr = this,
            path = [];
        while (curr.parent.length > 0) {
            path.push(curr.uid);
            cnt = curr.parent.length;

            // get parent
            if (isAStartMode)
                curr = GLOBOL_NODES[curr.parent[0].toString()];

            else if (isShortestRandomMode) {
                parentIndex = (cnt === 1) ? 0 : this.plugin.RandomInt(0, cnt);
                curr = GLOBOL_NODES[curr.parent[parentIndex].toString()];
            } else if (isShortestDiagonalMode) {
                for (i = 0; i < cnt; i++) {
                    parentDir = this.plugin.UID2DIR(curr.uid, curr.parent[i]);
                    if ((parentDir != currentDir) ||
                        (i == (cnt - 1))) // the last one
                    {
                        parentIndex = i;
                        currentDir = parentDir;
                        break;
                    }
                }
                curr = GLOBOL_NODES[curr.parent[parentIndex].toString()];
            } else if (isShortestStraightMode) {
                for (i = 0; i < cnt; i++) {
                    parentDir = this.plugin.UID2DIR(curr.uid, curr.parent[i]);
                    if ((parentDir == currentDir) ||
                        (i == (cnt - 1))) // the last one
                    {
                        parentIndex = i;
                        currentDir = parentDir;
                        break;
                    }
                }
                curr = GLOBOL_NODES[curr.parent[parentIndex].toString()];
            } else if (isShortestLineMode) {
                if (cnt == 1) {
                    curr = GLOBOL_NODES[curr.parent[0].toString()];
                    startNode = curr; // turn in the course
                    ta = endNode.angleTo(startNode);
                } else {
                    var n = GLOBOL_NODES[curr.parent[0].toString()],
                        n_;
                    var da = quickAbs(endNode.angleTo(n) - ta),
                        da_;
                    for (i = 1; i < cnt; i++) {
                        n_ = GLOBOL_NODES[curr.parent[i].toString()];
                        da_ = quickAbs(endNode.angleTo(n_) - ta);
                        if (da_ < da) {
                            n = n_;
                            da = da_;
                        }
                    }
                    curr = n;
                }

            }

        }
        return path.reverse();
    };
    nodeKlassProto.angleTo = function (endNode) {
        if (this.px == null)
            this.px = this.plugin.lxy2px(this.x, this.y);
        if (this.py == null)
            this.py = this.plugin.lxy2py(this.x, this.y);

        if (endNode.px == null)
            endNode.px = this.plugin.lxy2px(endNode.x, endNode.y);
        if (endNode.py == null)
            endNode.py = this.plugin.lxy2py(endNode.x, endNode.y);

        return C3.angleTo(this.px, this.py, endNode.px, endNode.py);
    };

    var node2uid = function (node) {
        return (node != null) ? node.uid : (-1);
    };

    var node2lx = function (node) {
        return (node != null) ? node.x : (-1);
    };

    var node2ly = function (node) {
        return (node != null) ? node.y : (-1);
    };

    var node2pathcost = function (node) {
        return (node != null) ? node.g : (-1);
    };

    var openHeap;
    var BinaryHeapKlass = function (scoreFunction) {
        this.content = [];
        this.scoreFunction = scoreFunction;
    }
    var BinaryHeapKlassProto = BinaryHeapKlass.prototype;
    BinaryHeapKlassProto.clean = function () {
        this.content.length = 0;
    };
    BinaryHeapKlassProto.push = function (element) {
        // Add the new element to the end of the array.
        this.content.push(element);

        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    };
    BinaryHeapKlassProto.pop = function () {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    };
    BinaryHeapKlassProto.remove = function (node) {
        var i = this.content.indexOf(node);

        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();

        if (i !== this.content.length - 1) {
            this.content[i] = end;

            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
            } else {
                this.bubbleUp(i);
            }
        }
    };
    BinaryHeapKlassProto.size = function () {
        return this.content.length;
    };
    BinaryHeapKlassProto.rescoreElement = function (node) {
        this.sinkDown(this.content.indexOf(node));
    };
    BinaryHeapKlassProto.sinkDown = function (n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n];

        // When at 0, an element can not sink any further.
        while (n > 0) {

            // Compute the parent element's index, and fetch it.
            var parentN = ((n + 1) >> 1) - 1,
                parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    };
    BinaryHeapKlassProto.bubbleUp = function (n) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);

        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) << 1,
                child1N = child2N - 1;
            // This is used to store the new position of the element, if any.
            var swap = null,
                child1Score;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore) {
                    swap = child1N;
                }
            }

            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    };
    openHeap = new BinaryHeapKlass(function (node) {
        return node.f;
    });
    // a star

    var cleanTable = function (o) {
        var k;
        for (k in o)
            delete o[k];
    };

    function quickAbs(x) {
        return x < 0 ? -x : x;
    };


{
	C3.Plugins.Rex_SLGMovement = class Rex_SLGMovementPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}