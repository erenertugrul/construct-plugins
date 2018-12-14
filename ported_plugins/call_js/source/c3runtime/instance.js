"use strict";

{
	C3.Plugins.cjs.Instance = class cjsInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			var nameOfExternalScript = ""
			
			if (properties)		// note properties may be null in some cases
			{
				nameOfExternalScript = properties[0];
			}
			var url = this._runtime.GetAssetManager().GetProjectFileUrl(nameOfExternalScript);
			this.returnValue= "";
			var myScriptTag=document.createElement('script');
			myScriptTag.setAttribute("type","text/javascript");
			myScriptTag.setAttribute("src", url);
			
			if (typeof myScriptTag != "undefined")
				document.getElementsByTagName("head")[0].appendChild(myScriptTag);
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