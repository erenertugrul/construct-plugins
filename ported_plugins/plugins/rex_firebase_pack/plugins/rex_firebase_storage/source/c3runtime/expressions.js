"use strict";

{
	C3.Plugins.Rex_Firebase_Storage.Exps =
	{
		LastDownloadURL()
		{
			return (this.exp_LastDownloadURL);
		},	
	    
		Progress()
		{
	        var p;        
		    if (this.snapshot)
	            p = this.snapshot["bytesTransferred"] / this.snapshot["totalBytes"];
		    
			return (p || 0);
		},	
	    
		TransferredBytes()
		{
	        var b;        
		    if (this.snapshot)
	            b = this.snapshot["bytesTransferred"];
		    
			return (b || 0);
		},		
	    
		TotalBytes()
		{
	        var b;        
		    if (this.snapshot)
	            b = this.snapshot["totalBytes"];
		    
			return (b || 0);
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
		},	  
		
		LastMetadata(ret, k, default_value)
		{
			return(getItemValue(this.exp_LastMetadata, k, default_value) );
		}	
	};
}