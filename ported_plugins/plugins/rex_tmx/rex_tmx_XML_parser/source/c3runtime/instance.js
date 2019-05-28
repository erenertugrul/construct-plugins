"use strict";

{
	C3.Plugins.Rex_tmx_XML_parser.Instance = class Rex_tmx_XML_parserInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			/*this._testProperty = 0;
			
			if (properties)		// note properties may be null in some cases
			{
				this._testProperty = properties[0];
			}*/
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
		TMXObjGet(tmx_content)
		{
			var isIE = false;
	        var tmx_obj = new C3.Plugins.Rex_tmx_XML_parser.TMXKlass(tmx_content);
	        return tmx_obj;
		}
	};
}