"use strict";

{
	C3.Plugins.Rex_Firebase_Timer.Acts =
	{
	    SetDomainRef(domain_ref, sub_domain_ref)
		{
			this.rootpath = domain_ref + "/" + sub_domain_ref + "/";
		},
		
	    StartTimer (ownerID, timer_name, interval)
		{  
		    var ref = this.get_ref()["child"](ownerID)["child"](timer_name);
		    
		    var self = this;
		    //2. read timer back	    
		    var on_read = function (snapshot)
		    {
		        self.exp_LastOwnerID = ownerID;
		        self.exp_LastTimerName = timer_name;
		        
	            self.exp_LastTimer = snapshot["val"]();
		        self.Trigger(C3.Plugins.Rex_Firebase_Timer.Cnds.OnStartTimerComplete); 
		    };	   
		    var read_timer = function()
		    {
		        ref["once"]("value", on_read);
		    };
	        //2. read timer back	
	        
	        //1. start timer
		    var onComplete = function(error) 
		    {
	            if (error)
	                self.Trigger(C3.Plugins.Rex_Firebase_Timer.Cnds.OnStartTimerError); 
	            else
	                read_timer();	        
	        };
	        	    		
	        this.start_timer(ref, interval, onComplete);
	        //1. start timer        
		},
		
	    GetTimer(ownerID, timer_name, interval)
		{
	        var startIfNotExists = (interval != null);
	        var isNewTimer = false;
		    var ref = this.get_ref()["child"](ownerID)["child"](timer_name);
		    var self = this;
		    
		    //3. read timer back	    
		    var on_read = function (snapshot)
		    {
		        self.exp_LastOwnerID = ownerID;
		        self.exp_LastTimerName = timer_name;
		        
	            self.exp_LastTimer = snapshot["val"]();
	            
	            if (isNewTimer)
		            self.Trigger(C3.Plugins.Rex_Firebase_Timer.Cnds.OnStartTimerComplete);
	            
		        self.Trigger(C3.Plugins.Rex_Firebase_Timer.Cnds.OnGetTimerComplete); 
		    };	   
		    var read_timer = function()
		    {
		        ref["once"]("value", on_read);
		    };
	        //3. read timer back	    	    
		    
	        //2. update timer / start timer	    
		    var on_update = function(error) 
		    {
		        if (error)
		        {
		            self.exp_LastOwnerID = ownerID;
		            self.exp_LastTimerName = timer_name;	            
		            self.Trigger(C3.Plugins.Rex_Firebase_Timer.Cnds.OnGetTimerError); 
		            return;	            
		        }
		        
		        read_timer();
	        };        
	        var update_timer = function()
	        {
			    var t = {"current": serverTimeStamp()};
			    ref["update"](t, on_update);
	        };        
	        var start_timer = function()
	        {
	            isNewTimer = true;
	            self.start_timer(ref, interval, on_update);
	        };
	        //2. update timer 
	        
	        //1. check if timer is existed
		    var on_exist_check = function (snapshot)
		    {
		        if (snapshot["val"]())
		            update_timer();	   
		        else if (startIfNotExists)
		            start_timer();     
	            else
	                on_read(snapshot);
		    };
	        ref["once"]("value", on_exist_check);
	        //1. check if timer is existed
		},	
		
	    RemoveTimer(ownerID, timer_name)
		{
		    var ref = this.get_ref()["child"](ownerID)["child"](timer_name);
		    
		    var self = this;
		    var onComplete = function(error) 
		    {
		        self.exp_LastOwnerID = ownerID;
		        self.exp_LastTimerName = timer_name;	        
		        var trig = (error)? C3.Plugins.Rex_Firebase_Timer.Cnds.OnRemoveTimerError:
		                            C3.Plugins.Rex_Firebase_Timer.Cnds.OnRemoveTimerComplete;
		        self.Trigger(trig); 
	        };

			ref["remove"](onComplete)
		},	
		
	    StartTimerWhenDisconnect(ownerID, timer_name, interval)
		{
		    var ref = this.get_ref()["child"](ownerID)["child"](timer_name);	    
	        ref["onDisconnect"]()["set"](newTimerDate(interval));
		},	

	    DeleteTimerWhenDisconnect(ownerID, timer_name, interval)
		{
		    var ref = this.get_ref()["child"](ownerID)["child"](timer_name);
	        ref["onDisconnect"]()["remove"]();
		}   
	};
}