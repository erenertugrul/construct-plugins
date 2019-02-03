"use strict";

{
	C3.Plugins.Rex_TimeAwayL.Cnds =
	{
		OnError(key) 
		{
			return true;
		},
		OnGetTimer(key) 
		{
			return (this.currentKey === key);
		},
		OnStartTimer(key) 
		{
			return (this.currentKey === key);
		},
		OnRemoveTimer(key) 
		{
			return (this.currentKey === key);
		},
		OnPauseTimer(key) 
		{
			return (this.currentKey === key);
		},
		OnResumeTimer(key) 
		{
			return (this.currentKey === key);
		},
		IsValid(key) 
		{
			return this.cache.hasOwnProperty(key);
		}
	};
}