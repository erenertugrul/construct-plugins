"use strict";

{
	C3.Behaviors.rex_anglelock.Instance = class rex_anglelockInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			
			this.inst = this._inst;
			
			if (properties)
			{
			    this.activated = (properties[0]==1);
	    		
				this.locked_angle = to_clamped_radians(properties[1]);
			}
			this.target_angle = this.inst.GetWorldInfo().GetAngle();
			
			// Opt-in to getting calls to Tick()
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
				"en": this.activated,
		         "ta": this.target_angle, 
		         "la": this.locked_angle 
			};
		}

		LoadFromJson(o)
		{
		    this.activated = o["en"];
		    this.target_angle = o["ta"];
			this.locked_angle = o["la"];
		}
		

		Tick()
		{
		    if (!this.activated)
		        return;
		        
		    this.inst.GetWorldInfo().SetAngle(this.target_angle);
		}
		
		Tick2()
		{
		    if (!this.activated)
		        return;
		        	    
		    this.target_angle = this.inst.GetWorldInfo().GetAngle();       // store current angle  
		    if (this.inst.GetWorldInfo().GetAngle() != this.locked_angle)
		    {
		        this.inst.GetWorldInfo().SetAngle(this.locked_angle);   // lock angle for display
		        this.inst.GetWorldInfo().SetBboxChanged();
		    }
		}
	
	};
}