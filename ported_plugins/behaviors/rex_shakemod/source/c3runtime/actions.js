"use strict";

{
	C3.Behaviors.Rex_ShakeMod.Acts =
	{
		SetActivated(e)
		{
			this.enabled = (e === 1);     
		},

		Start()
		{
	        this.isShaking = true;
	        this.remaining = this.duration;  
		},
	    
	 	Stop()
		{
	        this.isShaking = false;
	        this.remaining = 0;
		},   	    
	    
		SetDuration(t)
		{
	        if (this.isShaking)
	        {
	            this.remaining += (t - this.duration);
	        }
	        this.duration = t;
		}, 
	    
		SetMagnitude(m)
		{
	        this.magnitude = m;
		}, 
	    
		SetMagnitudeMode(m)
		{
	        this.magMode = m;
		}
	};
}