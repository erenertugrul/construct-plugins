"use strict";
var _get_uid = function(objs)
{
    var uid;
    if (objs == null)
        uid = null;
    else if (typeof(objs) === "object")
    {
        var inst = objs.GetFirstPicked();
        uid = (inst!=null)? inst.GetUID():null;
    }
    else
        uid = objs;
        
    return uid;
};
var do_cmp = function (x, cmp, y)
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
};

{
	C3.Behaviors.Rex_chess.Instance = class Rex_chessInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			
			this.board = null;
			this.inst = this._inst;
			const b = this._runtime.Dispatcher();
        	this._disposables = new C3.CompositeDisposable(C3.Disposable.From(b, "afterload", () => this._OnAfterLoad()));
		}
		_OnAfterLoad()
		{
			this.board = null;
        }
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				// data to store for savegames
			};
		}

		LoadFromJson(o)
		{
			// load state for savegames
		}
		
		/*
		Tick()
		{
			const dt = this._runtime.GetDt(this._inst);
			const wi = this._inst.GetWorldInfo();
			
			// ... code to run every tick for this behavior ...
		}
		*/
		GetBoard()
		{
		    var _xyz;
		    if (this.board != null)
		    {
		        _xyz = this.board.GetSdkInstance().uid2xyz(this.inst.GetUID());
		        if (_xyz != null)
		            return this.board;  // find out xyz on board
		        else  // chess no longer at board
		            this.board = null;
		    }
		        
		    var plugins = this._runtime.GetAllObjectClasses();
		    var name, obj;
		    for (name in plugins)
		    {
		        obj = plugins[name]._instances[0];
		        if ((obj != null) && (obj.GetSdkInstance().check_name == "BOARD"))
		        {
		            _xyz = obj.GetSdkInstance().uid2xyz(this.inst.GetUID())
		            if (_xyz != null)
		            { 
		                this.board = obj;					
		                return this.board;
		            }
		        }
		    }
		    return null;	
		}
	};
}