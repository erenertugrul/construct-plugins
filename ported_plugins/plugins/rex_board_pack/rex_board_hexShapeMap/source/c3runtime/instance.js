"use strict";

{
	C3.Plugins.Rex_hexShapeMap.Instance = class Rex_hexShapeMapInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			

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