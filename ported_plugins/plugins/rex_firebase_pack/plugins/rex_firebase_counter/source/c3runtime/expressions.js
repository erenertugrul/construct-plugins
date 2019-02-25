"use strict";

{
	C3.Plugins.Rex_Firebase_Counter.Exps =
	{
		LastValue()
		{
			return (this.exp_LastValue);
		}, 	
		
		LastWroteValue()
		{
			return (this.exp_MyLastWroteValue || 0);
		}, 	
		
		LastAddedValue()
		{
			return (this.exp_MyLastAddedValue);
		}, 
		
		CustomAddIn()
		{
			return (this.exp_LastTransactionIn);
		} 
	};
}