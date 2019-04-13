"use strict";

{
	C3.Behaviors.Rex_CameraFollower.Instance = class Rex_CameraFollowerInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			
			this.inst = this._inst;
			if (properties)
			{
		        this.isCamera = (properties[0] === 1);
		        this.enabled = properties[1];
		        this.ratioX = properties[2];
		        this.ratioY = properties[3];
			}
			const b = this._runtime.Dispatcher();
			this._disposables = new C3.CompositeDisposable(C3.Disposable.From(b, "instancedestroy", (a) => this._OnInstanceDestroyed(a.instance)), 
			C3.Disposable.From(b, "afterload", () => this._OnAfterLoad()))
			// Opt-in to getting calls to Tick()
			this._StartTicking();
			this._StartTicking2();
	        this.isDone = false;        
	        
	        this.CountCamera();
		}

		Release()
		{
			super.Release();
		}
		_OnAfterLoad()
		{
			 this.CountCamera();
		}
		_OnInstanceDestroyed()
		{
	        if (this.isCamera)    // camera
	            this.behavior.RemoveCamera();
		}
		SaveToJson()
		{
			return {
				"isC": this.isCamera,
	            "en": this.enabled,
	            "rX": this.ratioX,
	            "rY": this.ratioY,
	            "sX": this.GetBehavior().GetPreScrollX(),
	            "sY": this.GetBehavior().GetPreScrollY()
			};
		}

		LoadFromJson(o)
		{
	        this.isCamera = o["isC"];
	        this.enabled = o["en"];
	        this.ratioX = o["rX"];
	        this.ratioY = o["rY"]; 
	                
	        this.GetBehavior().Reset();
	        this.GetBehavior().SetPreScrollXY(o["sX"], o["sY"]);  
		}
		CountCamera()
		{
	        if (this.isCamera)    // camera
	            this.GetBehavior().AddCamera();         
		}
		GetScrollX()
		{
	        return this.inst.GetWorldInfo().GetLayer().GetLayout().GetScrollX();
		}  
	    
		GetScrollY()
		{
	        return this.inst.GetWorldInfo().GetLayer().GetLayout().GetScrollY();
		}
		Tick()
		{
			const dt = this._runtime.GetDt(this._inst);
			const wi = this._inst.GetWorldInfo();
			this.isDone = false;  
			// ... code to run every tick for this behavior ...
		}

		Tick2()
		{
	        if (this.isDone)
            	return;

	        var hasCamera = this.GetBehavior().HasCamera();
	        if ( (!hasCamera) ||
	             (hasCamera && this.isCamera)
	           )
	        {
	            var preScrollX = this.GetBehavior().GetPreScrollX();
	            var preScrollY = this.GetBehavior().GetPreScrollY();            
			    var curScrollX = this.GetScrollX();
	            var curScrollY = this.GetScrollY();
	            var dx = (preScrollX === null)?  0 : curScrollX - preScrollX;
	            var dy = (preScrollY === null)?  0 : curScrollY - preScrollY;
	            if ( !isNaN(dx) || !isNaN(dy))
	            	this.following(dx, dy);
	            
	            this.GetBehavior().SetPreScrollXY(curScrollX, curScrollY);
	        } 
		}
		following(dx, dy)
		{        
	        var is_moving = (dx !== 0) || (dy !== 0);    
	        var all = this.GetBehavior().GetInstances();

	        var i, len=all.length, binst;                 
   
			for (i=0; i<len; i++)
			{
				binst = GetThisBehavior(all[i]);			
				if (!binst)
					continue;
	                                                     
	            if ( is_moving &&
	                 (!binst.GetSdkInstance().isCamera) && 
	                 binst.GetSdkInstance().enabled &&        
	                 ((binst.GetSdkInstance().ratioX !== 0) || (binst.GetSdkInstance().ratioY !== 0))  
	               )
	            { 
          	 		binst._inst.GetWorldInfo().SetX(binst._inst.GetWorldInfo().GetX()+ (dx * binst.GetSdkInstance().ratioX));
	               	binst._inst.GetWorldInfo().SetY(binst._inst.GetWorldInfo().GetY()+ (dy * binst.GetSdkInstance().ratioY));
	               	binst._inst.GetWorldInfo().SetBboxChanged();
	            }
				binst.GetSdkInstance().isDone = true;
			}
	};  
		
	};
}