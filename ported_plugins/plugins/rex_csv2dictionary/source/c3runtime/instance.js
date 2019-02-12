"use strict";

{
	C3.Plugins.Rex_CSV2Dictionary.Instance = class Rex_CSV2DictionaryInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
	        this.strDelimiter = "";
	        this.is_eval_mode = "";
		    this.exp_CurKey = "";
		    this.exp_CurValue = "";
		
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
				"delimiter": this.strDelimiter 
			};
		}
		
		LoadFromJson(o)
		{
			this.strDelimiter = o["delimiter"];
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