"use strict";

{
	C3.Plugins.Rex_Date.Instance = class Rex_DateInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			this.timers = {};
		}
			
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"tims": this.timers
			};
		}
		
		LoadFromJson(o)
		{
			this.timers = o["tims"];
		}
	};
}