"use strict";
	function getErrorString(err) {
		if (!err)
			return "unknown error";
		else if (typeof err === "string")
			return err;
		else if (typeof err.message === "string")
			return err.message;
		else if (typeof err.name === "string")
			return err.name;
		else if (typeof err.data === "string")
			return err.data;
		else
			return "unknown error";
	};
		var startTimer = function (timer, curTimestamp) {
		if (!timer)
			timer = {};

		if (!curTimestamp)
			curTimestamp = (new Date()).getTime();

		timer["state"] = 1;
		timer["start"] = curTimestamp;
		timer["acc"] = 0;
		return timer;
	};
	var getElapsedTime = function (timer, curTimestamp) {
		if (!timer)
			return 0;

		if (!curTimestamp)
			curTimestamp = (new Date()).getTime();

		var deltaTime = timer["acc"];
		if (timer["state"] === 1)
			deltaTime += (curTimestamp - timer["start"]);

		return deltaTime;
	};
	var pauseTimer = function (timer) {
		if ((!timer) || (timer["state"] === 0))
			return;

		timer["state"] = 0;

		var curTime = (new Date()).getTime();
		timer["acc"] += (curTime - timer["start"]);
	};
	var resumeTimer = function (timer) {
		if ((!timer) || (timer["state"] === 1))
			return;

		timer["state"] = 1;
		timer["start"] = (new Date()).getTime();
	};
{
	C3.Plugins.Rex_TimeAwayL.Acts =
	{
	StartTimer(key) 
	{
		this.cache[key] = startTimer(this.cache[key]);

		var self = this;
		var onWriteTimer = function (err, valueSet) {
			self.currentKey = key;
			if (err) {
				self.exp_ErrorMessage = getErrorString(err);
				self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnError);
			} else {
				self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnStartTimer);
			}
		};
		localforage["setItem"](key, this.cache[key], onWriteTimer);
	},
	RemoveTimer(key) 
	{
		if (this.cache.hasOwnProperty(key))
			delete this.cache[key];

		var self = this;
		var callback = function (err) {
			self.currentKey = key;
			if (err) {
				self.exp_ErrorMessage = getErrorString(err);
				self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnError);
			} else {
				self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnRemoveTimer);
			}
		};
		localforage["removeItem"](key, callback);
	},
	PauseTimer(key) 
	{
		var self = this;
		var onGetTimer = function (err, timer) {
			if (err) {
				self.currentKey = key;
				self.exp_ErrorMessage = getErrorString(err);
				self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnError);
			} else {
				if (timer == null)
					return;

				pauseTimer(self.cache[key]);

				var onWriteTimer = function (err, valueSet) {
					self.currentKey = key;
					if (err) {
						self.exp_ErrorMessage = getErrorString(err);
						self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnError);
					} else {
						self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnPauseTimer);
					}
				};
				localforage["setItem"](key, self.cache[key], onWriteTimer);
			}
		}
		this.GetTimer(key, onGetTimer);
	},
	ResumeTimer(key) 
	{
		var self = this;
		var onGetTimer = function (err, timer) {
			if (err) {
				self.currentKey = key;
				self.exp_ErrorMessage = getErrorString(err);
				self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnError, self);
			} else {
				if (timer == null)
					return;

				resumeTimer(self.cache[key]);

				var onWriteTimer = function (err, valueSet) {
					self.currentKey = key;
					if (err) {
						self.exp_ErrorMessage = getErrorString(err);
						self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnError);
					} else {
						self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnResumeTimer);
					}
				};
				localforage["setItem"](key, self.cache[key], onWriteTimer);
			}
		}
		this.GetTimer(key, onGetTimer);
	},
	GetORStartTimer(key) 
	{
		var self = this;
		var onGetTimer = function (err, timer) {
			if (err) {
				self.currentKey = key;
				self.exp_ErrorMessage = getErrorString(err);
				self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnError);
			}

			// start timer
			else if (timer == null) {
				self.cache[key] = startTimer(self.cache[key]);
				var onWriteTimer = function (err, valueSet) {
					self.currentKey = key;
					if (err) {
						self.exp_ErrorMessage = getErrorString(err);
						self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnError);
					} else {
						self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnGetTimer);
					}
				};
				localforage["setItem"](key, self.cache[key], onWriteTimer);
			}

			// get timer
			else {
				self.currentKey = key;

				self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnGetTimer);
			}
		}
		this.GetTimer(key, onGetTimer);
	},
	GetTimer(key) 
	{
		var self = this;
		var onGetTimer = function (err, timer) {
			self.currentKey = key;
			if (err) {
				self.exp_ErrorMessage = getErrorString(err);
				self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnError);
			} else {
				self.Trigger(C3.Plugins.Rex_TimeAwayL.Cnds.OnGetTimer);
			}
		}
		this.GetTimer(key, onGetTimer);
	}
	};
}


