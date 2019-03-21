"use strict";
var eren_firebase_remote = window["cordova"];
{
	C3.Plugins.eren_firebase_remote.Instance = class firebase_remoteInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this.boolean = false;
			this.string = "";
			this.number = 0;
			this.bytes = null;
			this.error = ""; //silebilirsin belki
			this.stringerror = "";
			this.numbererror = "";
			this.booleanerror = "";
			this.byteserror = "";

			if (properties)		// note properties may be null in some cases
			{
				this.devmode = properties[1];
				if (this.devmode)
					this.update_time = 0;
				else
					this.update_time = (properties[0] * 60);
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
	};
}