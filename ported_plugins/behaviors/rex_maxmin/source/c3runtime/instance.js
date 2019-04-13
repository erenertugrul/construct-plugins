"use strict";

{
	C3.Behaviors.Rex_maxmin.Instance = class Rex_maxminInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			
		    this.is_my_call = false;
	    
	    	this.value = null;
			
			if (properties)
			{
			    this.max = properties[1];	 
			    this.min = properties[2];
			    this.set_value( properties[0], true );
			}
		 	this.pre_value = this.value;
			// Opt-in to getting calls to Tick()
			//this._StartTicking();
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"v":this.value,
		        "max": this.max,
		        "min": this.min,
			};
		}

		LoadFromJson(o)
		{
		    this.value = o["v"];
		    this.max = o["max"];
		    this.min = o["min"];
		}
		set_value(v, no_checking)
		{
		    this.pre_value = this.value;
		    this.value = C3.clamp(v, this.min, this.max);
		    
		    if (no_checking)
		        return;
		        
		    if (this.pre_value != this.value)
		    {
		        this.is_my_call = true;
		        this.Trigger(C3.Behaviors.Rex_maxmin.Cnds.OnValueChanging);
		        this.is_my_call = false;
		    }
		}
		/*
		Tick()
		{
			const dt = this._runtime.GetDt(this._inst);
			const wi = this._inst.GetWorldInfo();
			
			// ... code to run every tick for this behavior ...
		}
		*/
	};
}