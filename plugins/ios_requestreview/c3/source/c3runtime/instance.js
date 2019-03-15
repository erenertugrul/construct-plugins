"use strict";
var gizscan = window["cordova"]
{
	C3.Plugins.eren_requestreview.Instance = class eren_requestreviewInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this.result = "";
			this.cordova = window["cordova"];

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