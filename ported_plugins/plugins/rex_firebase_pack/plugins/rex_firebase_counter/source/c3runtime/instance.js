"use strict";

{
	C3.Plugins.Rex_Firebase_Counter.Instance = class Rex_Firebase_CounterInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			if (properties)		// note properties may be null in some cases
			{
	 		    this.rootpath = properties[0] + "/" + properties[1] + "/"; 	    
			    this.set_init(properties[2], properties[3]);
			}

		    
		    this.exp_LastTransactionIn = null;
	        this.exp_LastValue = this.init_value;
	        this.exp_MyLastWroteValue = null;
	        this.exp_MyLastAddedValue = 0;
	        
	        // custom add
	        this.onCustomAdd_cb = "";
	        
	        
	        this.query = null;
	        this.read_value_handler = null;

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
		OnDestroyed()
		{
			this.stop_update();
		}
	    set_init (init_value, upper_bound)
		{
		    this.init_value = init_value;
		    if ((upper_bound == "") || (upper_bound == '""'))
		        upper_bound = null;
		    else if (typeof (upper_bound) == "string")
		        upper_bound = parseFloat(upper_bound);
		    
		    this.upper_bound = upper_bound;      
		    this.set_range(this.init_value, this.upper_bound);
		}		

		set_range(v0, v1)
		{
		    if ((v0 == null) || (v1 == null))
		    {
		        this.counter_max = null;
		        this.counter_min = null; 	        
		    }
		    else
		    {
		        this.counter_max = Math.max(v0, v1);
		        this.counter_min = Math.min(v0, v1); 
		    }
	    }
	    
		has_bound()
		{
		    return (this.upper_bound != null);
	    }
    	get_ref(k)
		{
	        if (k == null)
		        k = "";
		    var path;
		    if (isFullPath(k))
		        path = k;
		    else
		        path = this.rootpath + k + "/";
	            
	        // 2.x
	        if (!isFirebase3x())
	        {
	            return new window["Firebase"](path);
	        }  
	        
	        // 3.x
	        else
	        {
	            var fnName = (isFullPath(path))? "refFromURL":"ref";
	            return window["Firebase"]["database"]()[fnName](path);
	        }
	        
		}
	    
	  
	    // 2.x , 3.x  

		clamp_result(current_value, wrote_value)
		{    
		    // no upper bound
		    if (!this.has_bound())	     	            
		        return wrote_value;	        

		    // has upper bound
	        // current value is equal to upper bound
		    else if (this.upper_bound == current_value)
		        return null;   // Abort the transaction
		            
		    else
		    {
		        if (this.upper_bound > this.init_value)
		        {
		            if (wrote_value <= this.upper_bound)
		                return wrote_value;
		            else if (wrote_value > this.upper_bound)
		                return this.upper_bound;
		            else
		                return null;   // Abort the transaction
		        }
		        else // (this.upper_bound < this.init_value)
		        {
		            if (wrote_value >= this.upper_bound)
		                return wrote_value;
		            else if (wrote_value < this.upper_bound)
		                return this.upper_bound;	        
		            else
		                return null;   // Abort the transaction            
		        }
		    }
	    }
	            
		on_transaction_complete(error, committed, snapshot) 
	    {
	        if (error)
	        {
	            this.Trigger(C3.Plugins.Rex_Firebase_Counter.Cnds.OnMyWritingError);            
	        }
	        else if (!committed)
	        {
	            this.Trigger(C3.Plugins.Rex_Firebase_Counter.Cnds.OnMyWritingAbort);
	        }
	        else
	        {
	            this.exp_MyLastWroteValue = snapshot["val"]();
	            this.exp_MyLastAddedValue = this.exp_MyLastWroteValue - this.exp_LastTransactionIn;
	            this.Trigger(C3.Plugins.Rex_Firebase_Counter.Cnds.OnMyWriting);
	        }
	    }
	    
	    start_update ()
		{	    
		    this.stop_update();
		    
		    var self = this;
		    var on_read = function (snapshot)
		    {
		        var counter_value = snapshot["val"]();
		        if (counter_value == null)
		            counter_value = self.init_value;
		            
		        self.exp_LastValue = counter_value;
		        self.Trigger(C3.Plugins.Rex_Firebase_Counter.Cnds.OnUpdate); 
		    };
		    
		    var query = this.get_ref();
		    query["on"]("value", on_read);
		    
		    this.query = query;
		    this.read_value_handler = on_read;	    
		}
	 
	    stop_update()
		{
		    if (this.query)
		    {
		        this.query["off"]("value", this.read_value_handler);
		        this.read_value_handler = null;
		        //this.get_ref()["off"]();
		        this.query = null;
		    }	    
		}  

	};
}