"use strict";

{
	C3.Plugins.scormc2.Instance = class scormc2Instance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this.isScormInitialised = false;
    		this.isOnError = false;
			
			if (properties)		// note properties may be null in some cases
			{
			
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