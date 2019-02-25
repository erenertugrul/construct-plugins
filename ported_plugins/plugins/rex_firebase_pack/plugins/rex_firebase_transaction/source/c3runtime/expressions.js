"use strict";

{
	C3.Plugins.Rex_Firebase_Transaction.Exps =
	{
		ValueIn(key_, default_value)
		{	
	        var val = getValue(key_, this.valueIn);
			return (din(val, default_value));
		},
		
		ValueOut(key_, default_value)
		{	
	        var val = getValue(key_, this.valueOut);
			return (din(val, default_value));        
		} 
	};
}