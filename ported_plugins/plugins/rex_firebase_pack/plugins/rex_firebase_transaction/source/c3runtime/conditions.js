"use strict";

{
	C3.Plugins.Rex_Firebase_Transaction.Cnds =
	{
		OnTransaction(cb)
		{
		    return true;
		},    
	    
		ValueInIsNull()
		{
		    return (this.valueIn === null);
		}, 

		IsAborted()
		{
		    return (!this.isCommitted);
		},     
	    
		OnComplete()
		{
		    return true;
		}, 	

		OnError()
		{
		    return true;
		},       
	    
		ValueOutIsNull()
		{
		    return (this.valueOut === null);
		} 	
	};
}