"use strict";

{
	C3.Plugins.scormc2.Acts =
	{
	//Launch scorm init
	initialiseLMS() 
	{
		var result = pipwerks.SCORM.init();
		if (result) {
		  this.isScormInitialised = true;
		} else {
		  this.isScormInitialised = false;
		  this.isOnError = true;
		}
	},

	//Send a value to scorm
	//For the possible ID, refer to scorm documentation
	setLMSValue(pID, pValue) 
	{
		if (this.isScormInitialised) {
		  this.isOnError = !pipwerks.SCORM.set(pID, pValue);
		}
	},

	//Commit all the values sent since the last commit
	doLMSCommit() 
	{
		if (this.isScormInitialised) {
		  this.isOnError = !pipwerks.SCORM.save();
		}
	},

	//Close the connexion with the LMS
	doTerminate()
	{
		if (this.isScormInitialised) {
			this.isOnError = !pipwerks.SCORM.quit();
		}
	}
	};
}