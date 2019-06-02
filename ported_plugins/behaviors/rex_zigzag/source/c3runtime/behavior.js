"use strict";

    var transferCmd = function (name, param) {
        switch (name) {
            case "F":
                name = "M"; // move
                break;
            case "B":
                name = "M"; // move
                param = -param;
                break;
            case "R":
                name = "R"; // rotate
                break;
            case "L":
                name = "R"; // rotate
                param = -param;
                break;
            case "W":
                break;
            default:
                return null; // no matched command
                break;
        }
        return ({
            "cmd": name,
            "param": param
        });
    };

    var parseSpeed = function (speedString) {
        var newSpeedValue = (speedString != "") ?
            eval("(" + speedString + ")") : null;
        return newSpeedValue;
    };

    var parsingRresult = [null, null];
    var parseCmd1 = function (cmd) // split cmd string and speed setting
    {
        var startIndex = cmd.indexOf("[");
        var retCmd;
        var speedString;
        if (startIndex != (-1)) {
            speedString = cmd.slice(startIndex);
            retCmd = cmd.slice(0, startIndex);
        } else {
            speedString = "";
            retCmd = cmd;
        }

        parsingRresult[0] = retCmd;
        parsingRresult[1] = speedString;
        return parsingRresult;
    };

    var parseCmdString = function (cmdString) {
        var ret_cmds = [];
        var cmds = cmdString.split(/;|\n/);
        var i;
        var cmd_length = cmds.length;
        var cmd, cmd_slices, cmd_name, cmd_param, cmd_parsed;
        var tmp;
        for (i = 0; i < cmd_length; i++) {
            tmp = parseCmd1(cmds[i]);
            cmd = tmp[0];
            cmd = cmd.replace(/(^\s*)|(\s*$)/g, "");
            cmd = cmd.replace(/(\s+)/g, " ");
            cmd_slices = cmd.split(" ");
            if (cmd_slices.length == 2) {
                cmd_name = cmd_slices[0].toUpperCase();
                cmd_param = parseFloat(cmd_slices[1]);
                cmd_parsed = transferCmd(cmd_name, cmd_param);
                if (cmd_parsed) {
                    cmd_parsed["speed"] = parseSpeed(tmp[1]);
                    ret_cmds.push(cmd_parsed);
                } else {
                    continue;
                }
            } else {
                continue;
            }
        }
        return ret_cmds;
    };
    function do_cmp(x, cmp, y)
    {
      if (typeof x === "undefined" || typeof y === "undefined")
        return false;
      switch (cmp)
      {
        case 0:     // equal
          return x === y;
        case 1:     // not equal
          return x !== y;
        case 2:     // less
          return x < y;
        case 3:     // less/equal
          return x <= y;
        case 4:     // greater
          return x > y;
        case 5:     // greater/equal
          return x >= y;
        default:
          return false;
      }
    }
    var index2NameMap = ["F", "B", "R", "L", "W"];
    var isValidCmd = function (currentCmd, _cmd) {
        if (currentCmd == null)
            return false;

        var ret;
        switch (_cmd) {
            case 0: //"F"
                ret = ((currentCmd["cmd"] == "M") && (currentCmd["param"] >= 0));
                break;
            case 1: //"B"
                ret = ((currentCmd["cmd"] == "M") && (currentCmd["param"] < 0));
                break;
            case 2: //"R"
                ret = ((currentCmd["cmd"] == "R") && (currentCmd["param"] >= 0));
                break;
            case 3: //"L"
                ret = ((currentCmd["cmd"] == "R") && (currentCmd["param"] < 0));
                break;
            case 4: //"W"
                ret = (currentCmd["cmd"] == "W");
                break;
            default: // any
                ret = true;
        }
        return ret;
    }
	function clamp_angle_degrees(a)
	{
			a %= 360;       // now in (-360, 360) range
			if (a < 0)
				a += 360;   // now in [0, 360) range
			return a;
	}
	function to_clamped_degrees(x)
	{
			return clamp_angle_degrees(C3.toDegrees(x));
	}
	function to_clamped_radians(x)
	{
		return C3.clampAngle(C3.toRadians(x));
	}
	    // command queue
    var CmdQueue = function (repeatCount) {
        this.Init(repeatCount);
    };
    var CmdQueueProto = CmdQueue.prototype;

    CmdQueueProto.Init = function (repeatCount) {
        this.CleanAll();
        this.repeatCount = repeatCount;
        this.repeatCountSave = repeatCount;
    };

    CmdQueueProto.CleanAll = function () {
        this.queueIndex = 0;
        this.currentCmdQueueIndex = -1;
        this.queue = [];
    };

    CmdQueueProto.Reset = function () {
        this.repeatCount = this.repeatCountSave;
        this.queueIndex = 0;
        this.currentCmdQueueIndex = -1;
    };

    CmdQueueProto.Push = function (item) {
        this.queue.push(item);
    };

    CmdQueueProto.PushList = function (items) {
        this.queue.push.apply(this.queue, items);
    };

    CmdQueueProto.GetCmd = function () {
        var cmd;
        cmd = this.queue[this.queueIndex];
        this.currentCmdQueueIndex = this.queueIndex;
        var index = this.queueIndex + 1;
        if (index >= this.queue.length) {
            if (this.repeatCount != 1) // repeat
            {
                this.queueIndex = 0;
                this.repeatCount -= 1;
            } else {
                this.queueIndex = (-1); // finish
            }
        } else
            this.queueIndex = index;
        return cmd;
    };

    CmdQueueProto.saveToJSON = function () {
        return {
            "i": this.queueIndex,
            "cci": this.currentCmdQueueIndex,
            "q": this.queue,
            "rptsv": this.repeatCountSave,
            "rpt": this.repeatCount
        };
    };

    CmdQueueProto.loadFromJSON = function (o) {
        this.queueIndex = o["i"];
        this.currentCmdQueueIndex = o["cci"];
        this.queue = o["q"];
        this.repeatCountSave = o["rptsv"];
        this.repeatCount = o["rpt"];
    };

    // move
    var CmdMoveKlass = function (inst,
        maxSpeed, acc, dec,
        preciseMode, continuedMode) {
        this.Init(inst,
            maxSpeed, acc, dec,
            preciseMode, continuedMode);
    };
    var CmdMoveKlassProto = CmdMoveKlass.prototype;

    CmdMoveKlassProto.Init = function (inst,
        maxSpeed, acc, dec,
        preciseMode, continuedMode) {
        this.inst = inst;
        this.move = {
            "max": maxSpeed,
            "acc": acc,
            "dec": dec
        };
        this.isDone = true;
        this.preciseMode = preciseMode;
        this.continuedMode = continuedMode;
        this.currentSpeed = 0;
    };

    CmdMoveKlassProto.CmdInit = function (positionData, distance,
        newSpeedValue) {
        this.target = positionData;
        this.dir = (distance >= 0);
        this.remainDistance = Math.abs(distance);
        this.isDone = false;
        var angle = positionData["a"];
        positionData["x"] += (distance * Math.cos(angle));
        positionData["y"] += (distance * Math.sin(angle));

        if (newSpeedValue)
            speedReset.apply(this, newSpeedValue);
        setCurrentSpeed.call(this, null);
    };

    CmdMoveKlassProto.Tick = function (dt) {
        var remainDt;
        var distance = getMoveDistance.call(this, dt);
        this.remainDistance -= distance;

        // is hit to target at next tick?
        if ((this.remainDistance <= 0) || (this.currentSpeed <= 0)) {
            this.isDone = true;
            if (this.preciseMode) // precise mode
            {
                this.inst.GetWorldInfo().SetX(this.target["x"]);
                this.inst.GetWorldInfo().SetY(this.target["y"]);
            } else // non-precise mode
            {
                var angle = this.target["a"];
                distance += this.remainDistance;
                if (!this.dir) {
                    distance = -distance;
                }
                this.inst.GetWorldInfo().SetX(this.inst.GetWorldInfo().GetX()+(distance * Math.cos(angle)));
                this.inst.GetWorldInfo().SetY(this.inst.GetWorldInfo().GetY()+(distance * Math.sin(angle)));
                this.target["x"] = this.inst.GetWorldInfo().GetX();
                this.target["y"] = this.inst.GetWorldInfo().GetY();
            }
            remainDt = (this.continuedMode) ? getRemaindDt.call(this) : 0;
        } else {
            var angle = this.target["a"];
            if (!this.dir) {
                distance = -distance;
            }
            this.inst.GetWorldInfo().SetX(this.inst.GetWorldInfo().GetX()+(distance * Math.cos(angle)));
            this.inst.GetWorldInfo().SetY(this.inst.GetWorldInfo().GetY()+(distance * Math.sin(angle)));
            remainDt = 0;
        }

        this.inst.GetWorldInfo().SetBboxChanged();
        return remainDt;
    };

    CmdMoveKlassProto.saveToJSON = function () {
        return {
            "v": this.move,
            "id": this.isDone,
            "pm": this.preciseMode,
            "cspd": this.currentSpeed,
            //"t": this.target,
            "dir": this.dir,
            "rd": this.remainDistance,
        };
    };

    CmdMoveKlassProto.loadFromJSON = function (o) {
        this.move = o["v"];
        this.isDone = o["id"];
        this.preciseMode = o["pm"];
        this.currentSpeed = o["cspd"];
        //this.target = o["t"];
        this.dir = o["dir"];
        this.remainDistance = o["rd"];
    };

    // rotate
    var CmdRotateKlass = function (inst,
        rotatable,
        maxSpeed, acc, dec,
        preciseMode, continuedMode) {
        this.Init(inst,
            rotatable,
            maxSpeed, acc, dec,
            preciseMode, continuedMode);
    };
    var CmdRotateKlassProto = CmdRotateKlass.prototype;

    CmdRotateKlassProto.Init = function (inst,
        rotatable,
        maxSpeed, acc, dec,
        preciseMode, continuedMode) {
        this.inst = inst;
        this.rotatable = rotatable;
        this.move = {
            "max": maxSpeed,
            "acc": acc,
            "dec": dec
        };
        this.isDone = true;
        this.isZeroDtMode = ((maxSpeed >= 36000) && (acc == 0) && (dec == 0));
        this.preciseMode = preciseMode;
        this.continuedMode = continuedMode;
        this.currentAngleDeg = (rotatable) ? to_clamped_degrees(inst.GetWorldInfo().GetAngle()) : 0;
        this.currentSpeed = 0;
    };

    CmdRotateKlassProto.CmdInit = function (positionData, distance,
        newSpeedValue) {
        this.target = positionData;
        this.currentAngleDeg = to_clamped_degrees(positionData["a"]);
        this.targetAngleDeg = this.currentAngleDeg + distance;
        this.dir = (distance >= 0);
        var angle = to_clamped_radians(this.targetAngleDeg);
        this.remainDistance = Math.abs(distance);
        this.isDone = false;
        positionData["a"] = angle;

        if (newSpeedValue)
            speedReset.apply(this, newSpeedValue);
        setCurrentSpeed.call(this, null);
    };

    CmdRotateKlassProto.Tick = function (dt) {
        var remainDt;
        var targetAngleRad;
        if (this.isZeroDtMode) {
            remainDt = dt;
            this.isDone = true;
            targetAngleRad = this.target["a"];
            this.currentAngleDeg = this.targetAngleDeg;
        } else {
            var distance = getMoveDistance.call(this, dt);
            this.remainDistance -= distance;

            // is hit to target at next tick?
            if ((this.remainDistance <= 0) || (this.currentSpeed <= 0)) {
                this.isDone = true;
                if (this.preciseMode) // precise mode
                {
                    targetAngleRad = this.target["a"];
                    this.currentAngleDeg = this.targetAngleDeg;
                } else // non-precise mode
                {
                    distance += this.remainDistance;
                    this.currentAngleDeg += ((this.dir) ? distance : (-distance));
                    targetAngleRad = to_clamped_radians(this.currentAngleDeg);
                    this.target["a"] = targetAngleRad;
                }
                remainDt = (this.continuedMode == 1) ? getRemaindDt.call(this) : 0;
            } else {
                this.currentAngleDeg += ((this.dir) ? distance : (-distance));
                targetAngleRad = to_clamped_radians(this.currentAngleDeg);
                remainDt = 0;
            }
        }

        if (this.rotatable) {
            this.inst.GetWorldInfo().SetAngle(targetAngleRad);
            this.inst.GetWorldInfo().SetBboxChanged();
        }
        return remainDt;
    };

    CmdRotateKlassProto.saveToJSON = function () {
        return {
            "ra": this.rotatable,
            "v": this.move,
            "id": this.isDone,
            "izm": this.isZeroDtMode,
            "pm": this.preciseMode,
            "cad": this.currentAngleDeg,
            "cspd": this.currentSpeed,
            //"t": this.target,
            "tad": this.targetAngleDeg,
            "dir": this.dir,
            "rd": this.remainDistance,
        };
    };

    CmdRotateKlassProto.loadFromJSON = function (o) {
        this.rotatable = o["ra"];
        this.move = o["v"];
        this.isDone = o["id"];
        this.isZeroDtMode = o["izm"];
        this.preciseMode = o["pm"];
        this.currentAngleDeg = o["cad"];
        this.currentSpeed = o["cspd"];
        //this.target = o["t"];
        this.targetAngleDeg = o["tad"];
        this.dir = o["dir"];
        this.remainDistance = o["rd"];
    };

    var setCurrentSpeed = function (speed) {
        var move = this.move;
        if (speed != null) {
            this.currentSpeed = (speed > move["max"]) ?
                move["max"] : speed;
        } else if (move["acc"] > 0) {
            this.currentSpeed = 0;
        } else {
            this.currentSpeed = move["max"];
        }
    };

    var getMoveDistance = function (dt) {
        var move = this.move;
        // assign speed
        var isSlowDown = false;
        if (move["dec"] != 0) {
            // is time to deceleration?
            var _distance = (this.currentSpeed * this.currentSpeed) / (2 * move["dec"]); // (v*v)/(2*a)
            isSlowDown = (_distance >= this.remainDistance);
        }
        var acc = (isSlowDown) ? (-move["dec"]) : move["acc"];
        if (acc != 0) {
            setCurrentSpeed.call(this, this.currentSpeed + (acc * dt));
        }

        // Apply movement to the object     
        var distance = this.currentSpeed * dt;
        return distance;
    };

    var getRemaindDt = function () {
        var remainDt;
        if ((this.move["acc"] > 0) || (this.move["dec"] > 0)) {
            setCurrentSpeed.call(this, 0); // stop in point
            remainDt = 0;
        } else {
            remainDt = (-this.remainDistance) / this.currentSpeed;
        }
        return remainDt;
    };


    var speedReset = function (max, acc, dec) {
        if (max != null)
            this.move["max"] = max;
        if (acc != null)
            this.move["acc"] = acc;
        if (dec != null)
            this.move["dec"] = dec;
    };

    // wait
    var CmdWaitKlass = function (continuedMode) {
        this.Init(continuedMode);
    };
    var CmdWaitKlassProto = CmdWaitKlass.prototype;

    CmdWaitKlassProto.Init = function (continuedMode) {
        this.isDone = true;
        this.continuedMode = continuedMode;
    };

    CmdWaitKlassProto.CmdInit = function (positionData, distance) {
        this.remainDistance = distance;
        this.isDone = false;
        this.target = positionData;
    };

    CmdWaitKlassProto.Tick = function (dt) {
        this.remainDistance -= dt;
        var remainDt;
        if (this.remainDistance <= 0) {
            remainDt = (this.continuedMode) ? (-this.remainDistance) : 0;
            this.isDone = true;
        } else {
            remainDt = 0;
        }
        return remainDt;
    };

    CmdWaitKlassProto.saveToJSON = function () {
        return {
            "id": this.isDone,
            "rd": this.remainDistance,
        };
    };

    CmdWaitKlassProto.loadFromJSON = function (o) {
        this.isDone = o["id"];
        this.remainDistance = o["rd"];
    };
{
	C3.Behaviors.Rex_Zigzag = class Rex_Zigzag extends C3.SDKBehaviorBase
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