"use strict";

{
	C3.Plugins.imgur_upload.Instance = class imgur_uploadInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			// Initialise object properties
			this.client_id = 0;
			if (properties)		// note properties may be null in some cases
			{
				this.client_id = properties[0];
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