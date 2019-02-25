"use strict";

{
	C3.Plugins.Rex_Firebase_Transaction.Acts =
	{
	    Transaction(k)
		{ 
	        var initValue, skipFirst=true;
	        var self = this;  
	        var ref = this.get_ref(k);
		    var _onComplete = function(error, committed, snapshot) 
		    {
	            self.isCommitted = committed;
	            self.valueOut = snapshot["val"]();
	            
		        var trig = (error)? C3.Plugins.Rex_Firebase_Transaction.Cnds.OnError:
		                            C3.Plugins.Rex_Firebase_Transaction.Cnds.OnComplete;
		        self.Trigger(trig); 
	        };
	        
	        var _onTransaction = function(current_value)
	        {            
	            if (skipFirst)
	            {
	                skipFirst = false;
	                if ((current_value == null) && (initValue != null))
	                    return current_value;
	            }
	            
	            self.abort = true;    
	            self.valueIn = current_value;            
	            self.Trigger(C3.Plugins.Rex_Firebase_Transaction.Cnds.OnTransaction); 
	            
	            if (self.abort)
	                return current_value;
	            else
	                return self.valueWrite;
	        };
	        
	        var run_transaction = function()
	        {
	            ref["transaction"](_onTransaction, _onComplete);
	        }
	        
	        var read_initValue = function()
	        {
	            var on_read = function (snapshot)
	            {
	                initValue = snapshot["val"]();
	                run_transaction();
	            }
	            ref["once"]("value", on_read);
	        }
	        
	        read_initValue();
		},

	    ReturnValue (v)
		{
	        this.abort = false;            
		    this.valueWrite = v;
		}, 
		
	    ReturnJSON(v)
		{
	        this.abort = false;               
	        if (typeof(v)==="number" || (v == ""))
	            return;
		    this.valueWrite = JSON.parse(v);
		}, 	    
	    
	    ReturnNull()
		{
	        this.abort = false;               
		    this.valueWrite = null;
		},    
		
	    ReturnBoolean(b)
		{
	        this.abort = false;               
		    this.valueWrite = (b===1);
		},     
		
	    ReturnKeyValue(k, v)
		{
	        this.abort = false;
	        if (typeof(this.valueWrite) !== "object")
	            this.valueWrite = {};
	        
	        setValue(k, v, this.valueWrite);
		},     
		
	    ReturnKeyBoolean(k, b)
		{
	        this.abort = false;
	        if (typeof(this.valueWrite) !== "object")
	            this.valueWrite = {};
	        
	        setValue(k, (b===1), this.valueWrite);
		},     
	    Abort()
		{
	        this.abort = true;
		    this.valueWrite = null;        
		}  
	};
}