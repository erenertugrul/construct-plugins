"use strict";

{
	C3.Behaviors.Rex_ShakeMod.Instance = class Rex_ShakeModInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			this.inst = this._inst;
			this.enabled = (properties[0] !== 0);
			var mode = properties[1];
	        this.effectMode = (mode === 0);
	        this.behaviorMode = (mode === 1);
	        this.duration = properties[2];
	        this.magnitude = properties[3];
	        this.magMode = properties[4];

	        this.isShaking = false; 
	        this.OX = null;
	        this.OY = null;
	        this.remaining = 0;
	        
	        this.is_my_call = false;
	        this._StartTicking();
	        this._StartTicking2();
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
	            "e": this.enable,
				"dur": this.duration,
				"mag": this.magnitude,
				"magMode": this.magMode,
	            
	            "isShake": this.isShaking,
	            "ox": this.OX,
	            "oy": this.OY,
	            "rem": this.remaining,
			};
		}

		LoadFromJson(o)
		{
			this.enable = o["e"];
	        this.duration = o["dur"]
			this.magnitude = o["mag"];
	        this.magMode = o["magMode"];
	        
	        this.isShaking = o["isShake"];
	        this.OX = o["ox"];
	        this.OY = o["oy"];
	        this.remaining = o["rem"];
		}
		GetDebuggerProperties() 
		{
		    return [
			    {
			        title: "$" + this.GetBehaviorType().GetName(),
			        properties: 
			        [
				        {
				            name: "Shaking",
				            value: this.isShaking
				        },
				        {
				            name: "Duration",
				            value: this.duration
				        },
				        {
				            name: "Magnitude",
				            value: this.magnitude
				        },
				        {
				            name: "Rememder",
				            value: (this.remaining > 0)? this.remaining : 0
				        },
				        {
				            name: "Origin",
				            value: this.OX + " , " + this.OY
				        },
				        {
				            name: "Enabled",
				            value: this.enabled
				        }
			        ]
			    }
		    ]
		}
		Tick()
		{
			const dt = this._runtime.GetDt(this._inst);
			const wi = this._inst.GetWorldInfo();
			
	        if (this.effectMode)          // Effect
	        {
	            this.BackToOrigin();
	        }
	        else if (this.behaviorMode)  // Behavior
	        {
	            this.BackToOrigin(true);
	            this.Shake();
	        }
		}
		Tick2()
		{
	        if (this.effectMode)
	        {
	            this.Shake();
	        }
	        else if (this.behaviorMode)
	        {
	            
	        }
			// ... code to run every tick for this behavior ...
		}
		Shake()
		{
		    if ( (!this.enabled) || (!this.isShaking) ) 
		        return;
		    
			var dt = this._runtime.GetDt(this._inst);
		    if (dt == 0)
		        return;
		    
		    // save origin to current position
		    this.OX = this.inst.GetWorldInfo().GetX();
		    this.OY = this.inst.GetWorldInfo().GetY();
			var isEnded = this.ShakePos(dt);   

		    if (isEnded)        
		    {
				this.OX = null;
				this.OY = null;			
		        this.isShaking = false;
		        this.is_my_call = true;
		        this.Trigger(C3.Behaviors.Rex_ShakeMod.Cnds.OnShackingEnd, this.inst); 
		        this.is_my_call = false;
		    }
		}   
		ShakePos(dt)
		{		
		    var isEnded = (this.remaining <= dt);
		    
		    var offx, offy;
		    if (isEnded)
		    {
		        offx = 0;
		        offy = 0;                       
		    }
		    else
		    {
		        var mag = this.magnitude * Math.min(this._runtime.GetTimeScale(), 1);
		        if (this.magMode === 1)  // decay
		        {
		            mag *= this.remaining/this.duration;
		        }
		        var a = Math.random() * Math.PI * 2;
		        offx = Math.cos(a) * mag;
		        offy = Math.sin(a) * mag;
		    }

		    // add offset to origin
		    var nx = this.OX + offx;
		    var ny = this.OY + offy; 
		    if ((nx !== this.inst.x) || (ny !== this.inst.y))
		    {
			    this.inst.GetWorldInfo().SetX(nx);
			    this.inst.GetWorldInfo().SetY(ny);
			    this.inst.GetWorldInfo().SetBboxChanged();
		    }
		    
		    this.remaining -= dt;
		    return isEnded;
		}   
		BackToOrigin(noUpdateBBox)
		{
		    if ( (!this.enabled) || (!this.isShaking) ) 
		        return;        
		    
		    if (this.OX === null)
		        return;
		    
		    if ((this.OX === this.inst.GetWorldInfo().GetX()) && (this.OY === this.inst.GetWorldInfo().GetY()))
		        return;
		    
		    // go back to origin point
		    this.inst.GetWorldInfo().SetX(this.OX);
		    this.inst.GetWorldInfo().SetY(this.OY);
		    this.OX = null;
		    this.OY = null;                
		    
		    if (!noUpdateBBox)
		        this.inst.GetWorldInfo().SetBboxChanged();   
		}   
	};
}