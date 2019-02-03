"use strict";
	    var startTimer = function(timer, curTimestamp)
   	 	{        
	        if (!timer)
	            timer = {};
	        
	        if (!curTimestamp)
	            curTimestamp = (new Date()).getTime();
	        
	        timer["state"] = 1;        
	        timer["start"] = curTimestamp;
	        timer["acc"] = 0; 
	        return timer;
		    };
		    var getElapsedTime = function(timer)
		    {
		        if (!timer)
		            return 0;
		        
		        var deltaTime = timer["acc"];
		        if (timer["state"] === 1)
		        {
		            var curTime = (new Date()).getTime();
		            deltaTime += (curTime - timer["start"]);
		        }
		        return deltaTime;
	    };
	    var pauseTimer = function(timer)
	    {
	        if ((!timer) || (timer["state"] === 0))
	            return;

	        timer["state"] = 0;
	        
	        var curTime = (new Date()).getTime();
	        timer["acc"] += (curTime - timer["start"]);
	    };
	    var resumeTimer = function(timer)
	    {
	        if ((!timer) || (timer["state"] === 1))
	            return;

	        timer["state"] = 1;
	        timer["start"] = (new Date()).getTime();        
	    }; 
		var getDate = function (timestamp)
		{
			return (timestamp != null)? new Date(timestamp): new Date();
		};
{
	C3.Plugins.Rex_Date.Acts =
	{
		StartTimer(name)
			{
		        this.timers[name] = startTimer(this.timers[name]);
			},
		    
		PauseTimer(name)
			{
		        pauseTimer(this.timers[name]);
			},	
		    
		ResumeTimer(name)
			{
		        resumeTimer(this.timers[name]);
			}	  
	};
}