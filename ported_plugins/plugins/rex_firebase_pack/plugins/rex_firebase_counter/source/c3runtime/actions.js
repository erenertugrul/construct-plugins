"use strict";

{
	C3.Plugins.Rex_Firebase_Counter.Acts =
	{
	    SetDomainRef(domain_ref, sub_domain_ref)
		{
			this.rootpath = domain_ref + "/" + sub_domain_ref + "/";
		},
		
	    StartUpdate()
		{	    
		    this.start_update();   
		},
	 
	    StopUpdate()
		{
		    this.stop_update();    
		},	 
	 
	    SetInit(init_value, upper_bound)
		{
		    this.set_init(init_value, upper_bound);
		},	 	

	    Add(value_)
		{
		    var is_numbe = typeof(value_) == "number";
		    var self = this;        
	    
		    var get_value = function(value_, current_value)
		    {
		        if (is_numbe)
		            return value_;
		            
		        return (parseFloat(value_)/100 * current_value);	
	        };   
	    
		    var on_complete = function(error, committed, snapshot) 
		    {
		        self.on_transaction_complete(error, committed, snapshot) ;
	        };
	        	    
		    var on_add = function (current_value)
		    {	        
		        if (current_value == null)
		            current_value = self.init_value;
		        
		        self.exp_LastTransactionIn = current_value;                       
		        var added_value = get_value(value_, current_value);
		        var wrote_value = current_value + added_value;    
		        var result = self.clamp_result(current_value, wrote_value);	       
	            if (result == null)
	                return;          // Abort the transaction
	            else
	                return result;         
		    };
		    this.get_ref()["transaction"](on_add, on_complete);
		},
		
	    ForceSet(value_)
		{
		    this.get_ref()["set"](value_);
		},		
	    
	    CustomAddByFn(cb)
		{
		    var self = this;        
	        
		    var on_complete = function(error, committed, snapshot) 
		    {
		        self.on_transaction_complete(error, committed, snapshot) ;
	        };
	        
	        var get_value = function (current_value)
	        {
		        self.exp_LastTransactionIn = current_value;
	            self.transactionOut = null;
	            self.onCustomAdd_cb = cb;
	            self.Trigger(C3.Plugins.Rex_Firebase_Counter.Cnds.OnAddFn);
	            return self.transactionOut;
	        };
	        	    
		    var on_add = function (current_value)
		    {	        
		        if (current_value == null)
		            current_value = self.init_value;
		        
		        var added_value = get_value(current_value);
	            if (added_value == null)
	                return;   // Abort the transaction
	                
		        var wrote_value = current_value + added_value;    
		        var result = self.clamp_result(current_value, wrote_value);	       
	            if (result == null)
	                return;          // Abort the transaction
	            else
	                return result;       
		    };
		    this.get_ref()["transaction"](on_add, on_complete);
		},  
		
	    CustomAddAdd(value_)
		{
		    this.transactionOut = value_;        
		},
		
	    CustomAddAbort()
		{
		    this.transactionOut = null;        
		}    
	    
    
	};
}