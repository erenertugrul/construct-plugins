"use strict";

{
	C3.Plugins.Rex_Firebase.Exps =
	{
		Domain()
		{
			return (this.rootpath);
		}, 
		
		TransactionIn(default_value)
		{	
			return (window.FirebaseGetValueByKeyPath(this.onTransaction.input, null, default_value));    
		},
		
		LastData(default_value)
		{	
	        var data =(this.snapshot === null)? null: this.snapshot["val"]();
			return (window.FirebaseGetValueByKeyPath(data, null, default_value));        
		},
		
		LastKey(default_value)
		{	
	        var key =(this.snapshot === null)? null: getKey(this.snapshot);
			return (window.FirebaseGetValueByKeyPath(key, null, default_value));               
		},
		
		PrevChildName(default_value)
		{	
			return (window.FirebaseGetValueByKeyPath(this.prevChildName, null, default_value));
		},	

		TransactionResult(default_value)
		{	
			return (window.FirebaseGetValueByKeyPath(this.onTransaction.committedValue, null, default_value));        
		},
		
		LastPushRef()
		{
			return (this.lastPushRef);
		},  
	    
	  	GenerateKey()
		{
		    var ref = this.getRef()["push"]();
	        this.exp_LastGeneratedKey = getKey(ref);
			return (this.exp_LastGeneratedKey);
		},	
	    
		LastGeneratedKey()
		{
		    return (this.exp_LastGeneratedKey);
		},
	    
		ServerTimeOffset()
		{
		    return (this.exp_ServerTimeOffset);
		},	
	    
		EstimatedTime()
		{
		    return (new Date().getTime() + this.exp_ServerTimeOffset);
		},    

		LastErrorCode()
		{
	        var code;
		    if (this.error)
	            code = this.error["code"];
			return (code || "");
		}, 
		
		LastErrorMessage()
		{
	        var s;
		    if (this.error)
	            s = this.error["serverResponse"];
			return (s || "");
		}	
	};
}