"use strict";

{
	C3.Plugins.Rex_Firebase_SaveSlot.Exps =
	{
		CurSlotName()
		{
			return (this.exp_CurSlotName);
		},
		
		CurHeaderValue(key, default_value)
		{        
			return( window.FirebaseGetValueByKeyPath(this.exp_CurHeader, key, default_value) );
		},	
		
		BodyValue(key, default_value)
		{ 
			return( window.FirebaseGetValueByKeyPath(this.load_body, key, default_value) );        
		},

		HeadersToJSON()
		{
			return (JSON.stringify(this.load_headers || {}));
		},	
		
		BodyToJSON()
		{
			return (JSON.stringify(this.load_body || {}));
		},	
		
		HeaderValue(slot_name, key, default_value)
		{	
	        var val = this.load_headers;
	        if (slot_name)
	            val = val[slot_name];
	        
			return( window.FirebaseGetValueByKeyPath(val, key, default_value) );  
		},		
	    
		CurHeaderValue(key, default_value)
		{
			return( window.FirebaseGetValueByKeyPath(this.exp_CurHeader, key, default_value) );
		},	
	    
		CurKey()
		{
			return(this.exp_CurKey);
		},		  
	    
		CurValue(subKey, default_value)
		{
			return( window.FirebaseGetValueByKeyPath(this.exp_CurValue, subKey, default_value) );        
		},		
	    
		LastSlotName()
		{
			return( this.exp_LastSlotName || "" );        
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