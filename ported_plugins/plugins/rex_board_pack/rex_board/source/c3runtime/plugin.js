"use strict";
	var __empty_cells = [];
    var _uids = []; // private global object
    var ALLDIRECTIONS = (-1);
    var cleanTable = function (o) {
    	for (var k in o)
        	delete o[k];
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
    var GXYZA = {
	    x: 0,
	    y: 0,
	    z: 0
	};
	var GXYZB = {
	    x: 0,
	    y: 0,
	    z: 0
	};
	var name2type = {}; // private global object
{
	C3.Plugins.Rex_SLGBoard = class Rex_SLGBoardPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
			(function () {
			    // class of board
			    if (globalThis.RexC2BoardKlass != null)
			        return;

			    var BoardKlass = function () {
			        this.xyz2uid = {};
			        this.uid2xyz = {};
			        this.x_max = null;
			        this.y_max = null;
			        this.x_min = null;
			        this.y_min = null;
			    };
			    var BoardKlassProto = BoardKlass.prototype;

			    BoardKlassProto.Reset = function (ignore_recycle) {
			        this.xyz2uid = {};
			        globalThis.RexC2BoardLXYZCache.freeLinesInDict(this.uid2xyz);

			        this.x_max = null;
			        this.y_max = null;
			        this.x_min = null;
			        this.y_min = null;
			    };

			    BoardKlassProto.GetAllChess = function () {
			        return this.uid2xyz;
			    };

			    BoardKlassProto.AddCell = function (uid, x, y, z) {
			        if (arguments.length == 2) {
			            var xyz = x;
			            x = xyz.x;
			            y = xyz.y;
			            z = xyz.z;
			        }

			        // xyz
			        if (!this.xyz2uid.hasOwnProperty(x))
			            this.xyz2uid[x] = {};
			        var tmpx = this.xyz2uid[x];
			        if (!tmpx.hasOwnProperty(y))
			            tmpx[y] = {};
			        var tmpy = tmpx[y];
			        tmpy[z] = uid;

			        // uid
			        this.uid2xyz[uid] = globalThis.RexC2BoardLXYZCache.allocLine(x, y, z);

			        this.x_max = null;
			        this.y_max = null;
			        this.x_min = null;
			        this.y_min = null;
			    };

			    BoardKlassProto.GetCell = function (x, y, z) {
			        // (x,y,z) -> uid
			        // (x,y) -> zHash = {z:uid}
			        var tmp = this.xyz2uid[x];
			        if (tmp != null) {
			            tmp = tmp[y];
			            if (z == null)
			                return tmp;
			            else if (tmp != null)
			                return tmp[z];
			        }
			        return null;
			    };

			    BoardKlassProto.RemoveCell = function (x, y, z) {
			        var uid, xyz;
			        // board.RemoveCell(uid)        
			        if (arguments.length === 1) {
			            uid = x;
			            xyz = this.uid2xyz[uid];
			            if (!xyz)
			                return;
			            x = xyz.x, y = xyz.y, z = xyz.z;
			        }
			        // board.RemoveCell(x,y,z)               
			        else if (arguments.length === 3) {
			            uid = this.GetCell(x, y, z);
			            if (uid == null)
			                return;

			            xyz = this.uid2xyz[uid];
			        } else
			            return;

			        // xyz
			        if (!this.xyz2uid.hasOwnProperty(x))
			            return;
			        var tmpx = this.xyz2uid[x];
			        if (!tmpx.hasOwnProperty(y))
			            return;
			        var tmpy = tmpx[y];
			        if (!tmpy.hasOwnProperty(z))
			            return;

			        delete tmpy[z];
			        if (isEmptyTable(tmpy))
			            delete tmpx[y];
			        if (isEmptyTable(tmpx))
			            delete this.xyz2uid[x];

			        // uid
			        delete this.uid2xyz[uid];
			        globalThis.RexC2BoardLXYZCache.freeLine(xyz);

			        this.x_max = null;
			        this.y_max = null;
			        this.x_min = null;
			        this.y_min = null;
			    };

			    var isEmptyTable = function (o) {
			        for (var k in o)
			            return false;

			        return true;
			    };

			    BoardKlassProto.ResetCells = function (uid2xyz) {
			        this.Reset();
			        var uid, xyz;
			        for (uid in uid2xyz) {
			            xyz = uid2xyz[uid];
			            this.AddCell(parseInt(uid), xyz.x, xyz.y, xyz.z);
			        }
			    };

			    BoardKlassProto.GetMaxX = function () {
			        if (this.x_max === null) {
			            var uid, xyz;
			            for (uid in this.uid2xyz) {
			                xyz = this.uid2xyz[uid];
			                if ((this.x_max === null) || (this.x_max < xyz.x))
			                    this.x_max = xyz.x;
			            }
			        }

			        return this.x_max;
			    };

			    BoardKlassProto.GetMaxY = function () {
			        if (this.y_max === null) {
			            var uid, xyz;
			            for (uid in this.uid2xyz) {
			                xyz = this.uid2xyz[uid];
			                if ((this.y_max === null) || (this.y_max < xyz.y))
			                    this.y_max = xyz.y;
			            }
			        }

			        return this.y_max;
			    };

			    BoardKlassProto.GetMinX = function () {
			        if (this.x_min === null) {
			            var uid, xyz;
			            for (uid in this.uid2xyz) {
			                xyz = this.uid2xyz[uid];
			                if ((this.x_min === null) || (this.x_min > xyz.x))
			                    this.x_min = xyz.x;
			            }
			        }

			        return this.x_min;
			    };

			    BoardKlassProto.GetMinY = function () {
			        if (this.y_min === null) {
			            var uid, xyz;
			            for (uid in this.uid2xyz) {
			                xyz = this.uid2xyz[uid];
			                if ((this.y_min === null) || (this.y_min > xyz.y))
			                    this.y_min = xyz.y;
			            }
			        }

			        return this.y_min;
			    };


			    BoardKlassProto.saveToJSON = function () {
			        // wrap: copy from this.items
			        var uid, uid2xyz = {},
			            xyz;
			        for (uid in this.uid2xyz) {
			            uid2xyz[uid] = {};
			            xyz = this.uid2xyz[uid];
			            uid2xyz[uid]["x"] = xyz.x;
			            uid2xyz[uid]["y"] = xyz.y;
			            uid2xyz[uid]["z"] = xyz.z;
			        }
			        return {
			            "xyz2uid": this.xyz2uid,
			            "uid2xyz": uid2xyz
			        };
			    };

			    BoardKlassProto.loadFromJSON = function (o) {
			        this.xyz2uid = o["xyz2uid"];

			        globalThis.RexC2BoardLXYZCache.freeLinesInDict(this.uid2xyz);
			        var uid, uid2xyz = o["uid2xyz"],
			            xyz;
			        for (uid in uid2xyz) {
			            xyz = uid2xyz[uid];
			            this.uid2xyz[uid] = globalThis.RexC2BoardLXYZCache.allocLine(xyz["x"], xyz["y"], xyz["z"]);
			        }
			    };

			    globalThis.RexC2BoardKlass = BoardKlass;

			}());

			(function () {
			    // general CreateObject function which call a callback before "OnCreated" triggered
			    if (globalThis.RexC2CreateObject != null)
			        return;

			    // copy from system action: CreateObject
			    var CreateObject = function (obj, layer, x, y, callback, ignore_picking) {
			        if (!layer || !obj)
			            return;
			        const g = this._runtime.GetEventSheetManager();
			        var inst = this._runtime.CreateInstance(obj, layer, x, y);

			        if (inst == null)
			            return;

			         g.BlockFlushingInstances(!0);

			        // call callback before "OnCreated" triggered
			        if (callback)
			            callback(inst);
			        // call callback before "OnCreated" triggered

			        var i, len, s;
			        inst._TriggerOnCreated();

			        if (inst._isInContainer) {
			            for (i = 0, len = inst._siblings.length; i < len; i++) {
			                s = inst._siblings[i];
			                inst._TriggerOnCreated();
			            }
			        }

			        g.BlockFlushingInstances(!1);

			        if (ignore_picking !== true) {
			            // Pick just this instance
			            var sol = obj.GetCurrentSol();
			            sol._SetSelectAll(false);
			            sol._instances.length = 1;
			            sol._instances[0] = inst;

			            // Siblings aren't in instance lists yet, pick them manually
			            if (inst._isInContainer) {
			                for (i = 0, len = inst._siblings.length; i < len; i++) {
			                    s = inst._siblings[i];
			                    sol = s.GetObjectClass().GetCurrentSol(); //dikkat buraya
			                    sol._SetSelectAll(false);
			                    sol._instances.length = 1;
			                    sol._instances[0] = s;
			                }
			            }
			        }

			        // add solModifiers
			        //var current_event = this.runtime.getCurrentEventStack().current_event;
			        //current_event.addSolModifier(obj);
			        // add solModifiers

			        return inst;
			    };

			    globalThis.RexC2CreateObject = CreateObject;
			}());

			(function () {
			    // general pick instances function
			    if (globalThis.RexC2PickUIDs != null)
			        return;

			    var _uidmap = {};
			    var PickUIDs = function (uids, objtype, checkCb) {
			        var sol = objtype.GetCurrentSol();
			        sol._instances.length = 0;
			        sol._SetSelectAll(false);
			        var isFamily = objtype._isFamily;
			        var members, memberCnt, i;
			        if (isFamily) {
			            members = objtype._familyMembers;;
			            memberCnt = members.length;
			        }
			        var i, j, uid_cnt = uids.length;
			        for (i = 0; i < uid_cnt; i++) {
			            var uid = uids[i];
			            if (uid == null)
			                continue;

			            if (_uidmap.hasOwnProperty(uid))
			                continue;
			            _uidmap[uid] = true;

			            var inst = this._runtime.GetInstanceByUID(uid);
			            if (inst == null)
			                continue;
			            if ((checkCb != null) && (!checkCb(uid)))
			                continue;

			            var typeName = inst.GetObjectClass().GetName();
			            if (isFamily) {
			                for (j = 0; j < memberCnt; j++) {
			                    if (typeName == members[j]._name) {
			                        sol._instances.push(inst);
			                        break;
			                    }
			                }
			            } else {
			                if (typeName == objtype._name) {
			                    sol._instances.push(inst);
			                }
			            }
			        }
			        objtype.ApplySolToContainer();

			        for (var k in _uidmap)
			            delete _uidmap[k];

			        return (sol._instances.length > 0);
			    };

			    globalThis.RexC2PickUIDs = PickUIDs;
			}());

			(function () {
			    // logical XYZ structure recycle
			    if (globalThis.RexC2BoardLXYZCache != null)
			        return;

			    var LXYZCacheKlass = function () {
			        this.lines = [];
			    };
			    var LXYZCacheKlassProto = LXYZCacheKlass.prototype;

			    LXYZCacheKlassProto.allocLine = function (x, y, z) {
			        var l = (this.lines.length > 0) ? this.lines.pop() : {};
			        l.x = x;
			        l.y = y;
			        l.z = z;
			        return l;
			    };
			    LXYZCacheKlassProto.freeLine = function (l) {
			        this.lines.push(l);
			    };
			    LXYZCacheKlassProto.freeLinesInDict = function (d) {
			        var k;
			        for (k in d) {
			            this.lines.push(d[k]);
			            delete d[k];
			        }
			    };
			    LXYZCacheKlassProto.freeLinesInArr = function (arr) {
			        var i, len;
			        for (i = 0, len = arr.length; i < len; i++)
			            this.freeLine(arr[i]);
			        arr.length = 0;
			    };
			    globalThis.RexC2BoardLXYZCache = new LXYZCacheKlass();
			}());
		}
		
		Release()
		{
			super.Release();
		}
	};
}