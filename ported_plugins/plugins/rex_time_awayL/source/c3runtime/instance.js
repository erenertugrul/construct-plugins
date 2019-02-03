"use strict";

{
	C3.Plugins.Rex_TimeAwayL.Instance = class Rex_TimeAwayLInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			this.cache = {}; // timers cache 
			this.pendingSave = {}; // keys
			this.waitingSave = {};
			this.pendingRemove = {};
			this.currentKey = null;
			this.exp_Time = 0;
			this.exp_ErrorMessage = "";
		}
			
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{

		}
		
		LoadFromJson(o)
		{
		}
		GetTimer(key, onCompleted) {
			if (this.cache.hasOwnProperty(key)) {
				onCompleted(null, this.cache[key]);
				return;
			} else {
				var self = this;
				var callback = function (err, value) {
					if (err) {
						if (self.cache.hasOwnProperty(key))
							delete self.cache[key];
					} else if (value == null) {
						if (self.cache.hasOwnProperty(key))
							delete self.cache[key];
					} else {
						self.cache[key] = value;
					}

					onCompleted(err, value);
				}
				localforage["getItem"](key, callback);
			}
		}
	};
}