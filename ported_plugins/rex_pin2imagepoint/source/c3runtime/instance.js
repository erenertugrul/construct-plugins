"use strict";
{
	C3.Behaviors.Rex_pin2imgpt.Instance = class Rex_pin2imgptInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			this.pinObject = null;
			this.pinObjectUid = -1;		// for loading
			this.imgpt = null;
			this.myStartAngle = 0;
			this.theirStartAngle = 0;
			this.lastKnownAngle = 0;		
			this.mode = null;
			this.inst = this._inst;
			
			var self = this;
			this._StartTicking2();
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
			"uid": this.pinObject ? this.pinObject.GetUID() : -1,
			"imgpt": this.imgpt,
			"msa": this.myStartAngle,
			"tsa": this.theirStartAngle,
			"lka": this.lastKnownAngle,			
			"m": this.mode
			};
		}

		LoadFromJson(o)
		{
			this.pinObjectUid = o["uid"];		// wait until afterLoad to look up		
			this.imgpt = o["imgpt"];
			this.myStartAngle = o["msa"];
			this.theirStartAngle = o["tsa"];
			this.lastKnownAngle = o["lka"];		
			this.mode = o["m"];
		}
		_OnAfterLoad()
		{
			// Look up the pinned object UID now getObjectByUID is available
			if (this.pinObjectUid === -1){
				this.pinObject = null;
				this._StopTicking2();	
			}
			else
			{
				this.pinObject = this._runtime.GetInstanceByUID(this.pinObjectUid);

				assert2(this.pinObject, "Failed to find pin object by UID");
			}
			
			this.pinObjectUid = -1;	
		}
		_OnInstanceDestroyed()
		{
			this.pinObject = null;
			this._StopTicking2();
		}

		Tick2()
		{
			if (!this.pinObject)
				return;
			var newx = this.pinObject.GetImagePoint(this.imgpt)[0];
			var newy = this.pinObject.GetImagePoint(this.imgpt)[1];				
			if (this.inst.GetWorldInfo().GetX() !== newx || this.inst.GetWorldInfo().GetY() !== newy)
			{
				this.inst.GetWorldInfo().SetX(newx);
				this.inst.GetWorldInfo().SetY(newy);
				this.inst.GetWorldInfo().SetBboxChanged();
			}
			
			if (this.mode == 1)
			{
			    // Instance angle has changed by events/something else
			    if (this.lastKnownAngle !== this.inst.GetWorldInfo().GetAngle())
			    {
				    this.myStartAngle = C3.clampAngle(this.myStartAngle + (this.inst.GetWorldInfo().GetAngle() - this.lastKnownAngle));
				}
						    
			    var newangle = C3.clampAngle(this.myStartAngle + (this.pinObject.GetWorldInfo().GetAngle() - this.theirStartAngle));
			    this.lastKnownAngle = newangle;
	    	}				
			if ((this.mode == 1) && (this.inst.GetWorldInfo().GetAngle() !== newangle))
			{
				this.inst.GetWorldInfo().SetAngle(newangle) ;
				this.inst.GetWorldInfo().SetBboxChanged();
			}		
		}
		GetDebuggerProperties() {
			return [
			{
				title: "$" + this.GetBehaviorType().GetName(),
				properties: [
				{
					name: "is-pinned",
					value: !!this.pinObject
				}, 
				{
					name: "pinned-uid",
					value: this.pinObject ? this.pinObject.GetUID() : 0
				}
				]
			}]
		}
	};
}
