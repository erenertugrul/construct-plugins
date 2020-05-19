"use strict";

{
	C3.Plugins.jsPDF.Instance = class jsPDFInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this.jsPDF = globalThis['jsPDF'];
			this.doc = new this.jsPDF();
			
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