"use strict";

{
	C3.Plugins.Rex_Firebase_Timer.Exps =
	{
		LastUserID()
		{
			return (this.exp_LastOwnerID);
		}, 	
		LastTimerName()
		{
			return (this.exp_LastTimerName);
		},	
		LastStartTimestamp()
		{
	        var t;
	        if (this.exp_LastTimer)        
	            t = get_timestamp(this.exp_LastTimer["start"]);
	 
			return(t || 0);
		}, 	
		LastCurrentTimestamp()
		{
	        var t;
	        if (this.exp_LastTimer)        
	            t = get_timestamp(this.exp_LastTimer["current"]);

			return(t || 0);
		}, 	    
		LastElapsedTime()
		{
	        var t;
	        if (this.exp_LastTimer)        
	            t = get_deltaTime(this.exp_LastTimer)/1000;
	    
			return(t || 0);
		},
		LastTimeoutInterval()
		{
	        var t;
	        if (this.exp_LastTimer)        
	            t = this.exp_LastTimer["time-out"];
	  
			return(t || 0);
		},
		LastRemainInterval()
		{ 
	        var t;
	        if (this.exp_LastTimer)        
	            t = this.exp_LastTimer["time-out"] - get_deltaTime(this.exp_LastTimer)/1000;

			return(t || 0);
		},	
		
		LastOwnerID()
		{
			return (this.exp_LastOwnerID);
		}		
	};
}