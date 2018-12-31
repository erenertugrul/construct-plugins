"use strict";

{
	C3.Plugins.Rex_Date.Exps =
	{
		Year(timestamp)
			{
				return getDate(timestamp).getFullYear();
			},
			
		Month(timestamp)
			{
			    return getDate(timestamp).getMonth()+1;
			},
			
		Date(timestamp)
			{
			    return getDate(timestamp).getDate();
			},
			
		Day(timestamp)
			{
			    return getDate(timestamp).getDay();
			},	
			
		Hours(timestamp)
			{
			    return getDate(timestamp).getHours();
			},	

		Minutes(timestamp)
			{
			    return getDate(timestamp).getMinutes();
			},	
			
		Seconds(timestamp)
			{
			    return getDate(timestamp).getSeconds();
			},	

		Milliseconds(timestamp)
			{
			    return getDate(timestamp).getMilliseconds();
			},	
			
		Timer(name)
			{
				return getElapsedTime(this.timers[name])/1000;
			},	

		CurTicks()
			{
			    var today = new Date();
		        return today.getTime();
			},	

		UnixTimestamp(year, month, day, hours, minutes, seconds, milliseconds)
			{
		        var d;
		        if (year == null)
		        {
		            d = new Date();
		        }
		        else
		        {
		            month = month || 1;
		            day = day || 1;
		            hours = hours || 0;
		            minutes = minutes || 0;
		            seconds = seconds || 0;
		            milliseconds = milliseconds || 0;
		            d = new Date(year, month-1, day, hours, minutes, seconds, milliseconds); 
		        }
		        return d.getTime();
			},

		Date2UnixTimestamp(year, month, day, hours, minutes, seconds, milliseconds)
			{        
		        year = year || 2000;
		        month = month || 1;
		        day = day || 1;
		        hours = hours || 0;
		        minutes = minutes || 0;
		        seconds = seconds || 0;
		        milliseconds = milliseconds || 0;
		        var timestamp = new Date(year, month-1, day, hours, minutes, seconds, milliseconds); // build Date object
		        return timestamp.getTime();
			},
			
		LocalExpression(timestamp, locales)
			{
			    return getDate(timestamp).toLocaleString(locales);
			}
	};
}