"use strict";

{
	C3.Plugins.scormc2.Cnds =
	{
		isScormInitialised()
	  	{
			if (this.isScormInitialised){
				return pipwerks.SCORM.status("get");
			} else {
				return false;
			}
		},

		//Return true if scorm is on error state
		isScormOnError()
	  	{
		return this.isOnError;
		}
	};
}