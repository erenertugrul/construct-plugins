"use strict";

{
	C3.Plugins.TR_ClockParser.Exps =
	{
		Minimal(seconds_)
		{
		    seconds_ = parseInt(seconds_, 10);
		    var hours   = Math.floor(seconds_ / 3600);
		    var minutes = Math.floor((seconds_ - (hours * 3600)) / 60);
		    var seconds = seconds_ - (hours * 3600) - (minutes * 60);

		    var clockString = "";

		    if(hours > 0)
		    {
		        clockString += (hours < 10 ? "0" + hours : hours) + ":";
		    }

		    if(hours > 0 || minutes > 0)
		    {
		        clockString += (minutes < 10 ? "0" + minutes : minutes) + ":";
		    }

		    clockString += (seconds < 10 ? "0" + seconds : seconds);

		    return(clockString);
		},


		MMSS(seconds_)
		{
		    seconds_ = parseInt(seconds_, 10);
		    var minutes = Math.floor(seconds_ / 60);
		    var seconds = seconds_ - minutes * 60;

		    if (minutes < 10) { minutes = "0"  +minutes; }
		    if (seconds < 10) { seconds = "0" + seconds; }

		    return(minutes + ':' + seconds);
		},

		HHMMSS(seconds_)
		{
		    seconds_ = parseInt(seconds_, 10);
		    var hours   = Math.floor(seconds_ / 3600);
		    var minutes = Math.floor((seconds_ - (hours * 3600)) / 60);
		    var seconds = seconds_ - (hours * 3600) - (minutes * 60);

		    if (hours   < 10) { hours   = "0" + hours; }
		    if (minutes < 10) { minutes = "0"  +minutes; }
		    if (seconds < 10) { seconds = "0" + seconds; }

		    return(hours + ':' + minutes + ':' + seconds);
		},

		ToSeconds(clockString_)
		{
		    var a = clockString_.split(':');

		    var hours = +(a.length === 3 ? a[0] : 0);
		    var minutes = +(a.length === 3 ? a[1] : (a.length === 2 ? a[0] : 0));
		    var seconds = +(a.length === 3 ? a[2] : (a.length === 2 ? a[1] : (a.length === 1 ? a[0] : 0)));

		    seconds = hours * 3600 + minutes * 60 + seconds;
		    
		    return(seconds);
		}
	};
}