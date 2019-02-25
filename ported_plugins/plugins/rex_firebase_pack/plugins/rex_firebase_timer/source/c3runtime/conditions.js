"use strict";

{
	C3.Plugins.Rex_Firebase_Timer.Cnds =
	{
		OnStartTimerComplete()
		{
		    return true;
		}, 
		OnStartTimerError()
		{
		    return true;
		}, 
		OnGetTimerComplete()
		{
		    return true;
		}, 
		OnGetTimerError()
		{
		    return true;
		},	
		OnRemoveTimerComplete()
		{
		    return true;
		}, 
		OnRemoveTimerError()
		{
		    return true;
		},	
	    
		IsTimeOut()
		{
	        if (!this.exp_LastTimer)
	            return false;
	            
	        var t = get_deltaTime(this.exp_LastTimer);
		    return (t/1000) > this.exp_LastTimer["time-out"];
		},	
		
		IsValid()
		{
	        return (this.exp_LastTimer != null);
		}    
	};
}