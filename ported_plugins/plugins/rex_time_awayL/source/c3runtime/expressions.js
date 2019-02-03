"use strict";

{
	C3.Plugins.Rex_TimeAwayL.Exps =
	{
		ErrorMessage() 
		{
			return this.exp_ErrorMessage;
		},
		ElapsedTime(timer_name) 
		{
			if (!timer_name)
				timer_name = this.currentKey;
			return getElapsedTime(this.cache[timer_name]) / 1000;
		}
	};
}