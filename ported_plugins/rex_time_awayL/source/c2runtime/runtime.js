// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Rex_TimeAwayL = function (runtime) {
	this.runtime = runtime;
};

(function () {

	var pluginProto = cr.plugins_.Rex_TimeAwayL.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function (plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function () {};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function (type) {
		this.type = type;
		this.runtime = type.runtime;
	};

	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function () {
		this.cache = {}; // timers cache    
		/*
		{
		    "state":1=run, 0=paused
		    "start": timstamp, updated when resumed
		    "acc": delta-time, updated when paused
		}
		*/

		this.pendingSave = {}; // keys
		this.waitingSave = {};
		this.pendingRemove = {};

		this.currentKey = null;
		this.exp_Time = 0;
		this.exp_ErrorMessage = "";
	};

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

	instanceProto.GetTimer = function (key, onCompleted) {
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
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds();

	Cnds.prototype.OnError = function (key) {
		return true;
	};

	Cnds.prototype.OnGetTimer = function (key) {
		return (this.currentKey === key);
	};

	Cnds.prototype.OnStartTimer = function (key) {
		return (this.currentKey === key);
	};

	Cnds.prototype.OnRemoveTimer = function (key) {
		return (this.currentKey === key);
	};

	Cnds.prototype.OnPauseTimer = function (key) {
		return (this.currentKey === key);
	};

	Cnds.prototype.OnResumeTimer = function (key) {
		return (this.currentKey === key);
	};

	Cnds.prototype.IsValid = function (key) {
		return this.cache.hasOwnProperty(key);
	};

	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();

	Acts.prototype.StartTimer = function (key) {
		this.cache[key] = startTimer(this.cache[key]);

		var self = this;
		var onWriteTimer = function (err, valueSet) {
			self.currentKey = key;
			if (err) {
				self.exp_ErrorMessage = getErrorString(err);
				self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnError, self);
			} else {
				self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnStartTimer, self);
			}
		};
		localforage["setItem"](key, this.cache[key], onWriteTimer);
	};

	Acts.prototype.RemoveTimer = function (key) {
		if (this.cache.hasOwnProperty(key))
			delete this.cache[key];

		var self = this;
		var callback = function (err) {
			self.currentKey = key;
			if (err) {
				self.exp_ErrorMessage = getErrorString(err);
				self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnError, self);
			} else {
				self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnRemoveTimer, self);
			}
		};
		localforage["removeItem"](key, callback);
	};


	Acts.prototype.PauseTimer = function (key) {
		var self = this;
		var onGetTimer = function (err, timer) {
			if (err) {
				self.currentKey = key;
				self.exp_ErrorMessage = getErrorString(err);
				self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnError, self);
			} else {
				if (timer == null)
					return;

				pauseTimer(self.cache[key]);

				var onWriteTimer = function (err, valueSet) {
					self.currentKey = key;
					if (err) {
						self.exp_ErrorMessage = getErrorString(err);
						self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnError, self);
					} else {
						self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnPauseTimer, self);
					}
				};
				localforage["setItem"](key, self.cache[key], onWriteTimer);
			}
		}
		this.GetTimer(key, onGetTimer);
	};

	Acts.prototype.ResumeTimer = function (key) {
		var self = this;
		var onGetTimer = function (err, timer) {
			if (err) {
				self.currentKey = key;
				self.exp_ErrorMessage = getErrorString(err);
				self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnError, self);
			} else {
				if (timer == null)
					return;

				resumeTimer(self.cache[key]);

				var onWriteTimer = function (err, valueSet) {
					self.currentKey = key;
					if (err) {
						self.exp_ErrorMessage = getErrorString(err);
						self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnError, self);
					} else {
						self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnResumeTimer, self);
					}
				};
				localforage["setItem"](key, self.cache[key], onWriteTimer);
			}
		}
		this.GetTimer(key, onGetTimer);
	};

	Acts.prototype.GetORStartTimer = function (key) {
		var self = this;
		var onGetTimer = function (err, timer) {
			if (err) {
				self.currentKey = key;
				self.exp_ErrorMessage = getErrorString(err);
				self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnError, self);
			}

			// start timer
			else if (timer == null) {
				self.cache[key] = startTimer(self.cache[key]);
				var onWriteTimer = function (err, valueSet) {
					self.currentKey = key;
					if (err) {
						self.exp_ErrorMessage = getErrorString(err);
						self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnError, self);
					} else {
						self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnGetTimer, self);
					}
				};
				localforage["setItem"](key, self.cache[key], onWriteTimer);
			}

			// get timer
			else {
				self.currentKey = key;
				self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnGetTimer, self);
			}
		}
		this.GetTimer(key, onGetTimer);
	};

	Acts.prototype.GetTimer = function (key) {
		var self = this;
		var onGetTimer = function (err, timer) {
			self.currentKey = key;
			if (err) {
				self.exp_ErrorMessage = getErrorString(err);
				self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnError, self);
			} else {
				self.runtime.trigger(cr.plugins_.Rex_TimeAwayL.prototype.cnds.OnGetTimer, self);
			}
		}
		this.GetTimer(key, onGetTimer);
	};

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();

	Exps.prototype.ErrorMessage = function (ret) {
		ret.set_string(this.exp_ErrorMessage);
	};

	Exps.prototype.ElapsedTime = function (ret, timer_name) {
		if (!timer_name)
			timer_name = this.currentKey;

		ret.set_float(getElapsedTime(this.cache[timer_name]) / 1000);
	};

}());