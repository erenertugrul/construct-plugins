"use strict";

{
	C3.Plugins.Rex_Firebase_CurTime.Exps =
	{
	   Timestamp() {
	        return (Math.floor(this.getCurTimestamp()));
	    },

	   LastPredictedError() {
	        return (this.lastPredictErr);
	    }
	};
}