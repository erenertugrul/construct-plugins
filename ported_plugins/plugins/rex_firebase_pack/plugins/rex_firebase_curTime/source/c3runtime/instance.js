"use strict";

{
	C3.Plugins.Rex_Firebase_CurTime.Instance = class Rex_Firebase_CurTimeInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties

	        this.timestamp_ref = null;
	        this.lastServerTimestamp = null;
	        this.lastLocalTimestamp = null;
	        this.lastPredictErr = 0;
			
			if (properties)		// note properties may be null in some cases
			{
 	        	this.rootpath = properties[0] + "/" + properties[1] + "/";
	        	this.updatingPeriod = properties[2];  // seconds
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				// data to be saved for savegames
			};
		}
		
		LoadFromJson(o)
		{
			// load state for savegames
		}
	    get_ref(k) {
	        if (k == null)
	            k = "";
	        var path;
	        if (isFullPath(k))
	            path = k;
	        else
	            path = this.rootpath + k + "/";

	        // 2.x
	        if (!isFirebase3x()) {
	            return new window["Firebase"](path);
	        }

	        // 3.x
	        else {
	            var fnName = (isFullPath(path)) ? "refFromURL" : "ref";
	            return window["Firebase"]["database"]()[fnName](path);
	        }

	    }
	    UpdatingTimestamp(onComplete) {
	        var self = this;
	        var onRead = function (snapshot) {
	            var ts = snapshot["val"]();
	            if (ts != null) {
	                ts = get_timestamp(ts);
	                var isFirstUpdating = (self.lastServerTimestamp === null);
	                if (!isFirstUpdating) {
	                    var predictTS = self.getCurTimestamp();
	                    self.lastPredictErr = (ts - predictTS) / 1000;
	                }
	                else {
	                    self.lastPredictErr = 0;
	                }
	                self.lastServerTimestamp = ts;

	                if (onComplete)
	                    onComplete(self.lastServerTimestamp);
	                else if (isFirstUpdating)
	                    self.Trigger(C3.Plugins.Rex_Firebase_CurTime.Cnds.OnStart);
	            }
	            else  // run again
	                setTimeout(function () {
	                    self.UpdatingTimestamp();
	                }, 0);
	        };
	        var onWrite = function (error) {
	            if (!error)
	                self.timestamp_ref["once"]("value", onRead);
	            else  // run again
	                setTimeout(function () {
	                    self.UpdatingTimestamp();
	                }, 0);
	        };
	        this.timestamp_ref["set"](serverTimeStamp(), onWrite);
	    }

	    getCurTimestamp() {
	        var ts;
	        if (this.lastServerTimestamp == null) {
	            ts = 0;  // invalid
	        }
	        if (this.lastLocalTimestamp == null) {
	            ts = this.lastServerTimestamp;
	        }
	        else {
	            var curLocalTS = (new Date()).getTime();
	            var dt = curLocalTS - this.lastLocalTimestamp;
	            ts = this.lastServerTimestamp + dt;
	        }
	        return ts;
	    }

	};
}