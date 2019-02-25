"use strict";

{
	C3.Plugins.Rex_Firebase_CurTime.Cnds =
	{
	    IsUpdating() {
	        return (this.lastServerTimestamp != null);
	    },

	    OnStart() {
	        return true;
	    }
	};
}