"use strict";

{
	C3.Plugins.scormc2.Exps =
	{
		//Get the last scorm error message as string
		getLastError()
	  	{
			if (this.isScormInitialised){
				return (pipwerks.SCORM.debug.getInfo(pipwerks.SCORM.debug.getCode()));
			} else {
				return ("Scorm wasn't able to initialise. Probably because the Scorm API was not found.");
			}
		},

		//Get the last scorm error ID as an integer
		getLastErrorID()
	  	{
			return(pipwerks.SCORM.debug.getCode());
		},

		//Get a value from scorm
		//Refer to the scorm documentation for the possible values for ID
		getLMSValue(pID) 
	  	{
			return (pipwerks.SCORM.get(pID));
		}
	};
}