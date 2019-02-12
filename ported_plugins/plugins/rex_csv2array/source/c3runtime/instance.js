"use strict";

{
	C3.Plugins.Rex_CSV2Array.Instance = class Rex_CSV2ArrayInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
		        this.strDelimiter = 0;
		        this.is_eval_mode = 0;
			    this.exp_CurX = 0;
			    this.exp_CurY = 0;
			    this.exp_CurValue = "";
			    this.exp_Width = 0;
			
			if (properties)		// note properties may be null in some cases
			{
       	 		this.strDelimiter = properties[0];
        		this.is_eval_mode = (properties[1] == 1);
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
		value_get(v)
		{
		    if (v == null)
		        v = 0;
		    else if (this.is_eval_mode)
		        v = eval("("+v+")");
	        
	        return v;
		}
	};
}