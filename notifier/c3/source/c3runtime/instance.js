"use strict";
var _type = ["","info","success","warning","danger"]
var _notifier = window["notifier"];
{
	C3.Plugins.erenertugrul_notifier.Instance = class NotifierInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this._notificationId = null;

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

