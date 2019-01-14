"use strict";

{
	C3.Plugins.SimpleQRScanner.Instance = class SimpleQRScannerInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this.result = "";

			if (properties)		// note properties may be null in some cases
			{
				this.scanTitle = properties[0];
				this.scanDesc = properties[1];
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