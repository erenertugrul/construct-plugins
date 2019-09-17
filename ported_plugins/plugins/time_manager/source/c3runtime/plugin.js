"use strict";
class TimeManager
{
	constructor(LabelStr, StartTime, EndTime, TimeLimit, ExtraStartTime)
	{

	    this.TimeManagerLabelName = LabelStr;
	    this.TimeManagerStartTime = StartTime;
	    this.TimeManagerEndTime = EndTime;
	    this.TimeManagerExtraStartTime = ExtraStartTime;

	    this.CountDown = false;
	    this.CountUp = false;
	    this.IsActive = true;
	    this.IsStopped = false;

	    this.TimeResult = 0.0;
	    this.TimeLimit = TimeLimit;

	    this.PauseStartValue = 0.0;
	    this.PauseValue = 0.0;
	    this.PauseTotal = 0.0;

	    this.MinuteBaseValue = 60;
	    this.SecondBaseValue = 60;
	    this.MillisecondBaseValue = 1000;
	}
}
{
	C3.Plugins.CAMFTimeManager = class CAMFTimeManagerPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}