"use strict";

{
	C3.Plugins.Rex_Firebase_SyncQueue.Instance = class Rex_Firebase_SyncQueueInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
		    this.tokenCtrl = null;     
		    this.has_input_handler = false;
		    this.exp_LastIn = null;   
		    this.on_get_indata = null;  
			
			if (properties)		// note properties may be null in some cases
			{
 				this.rootpath = properties[0] + "/" + properties[1] + "/"; 
			}
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
	    OnGetToken()
	    {
	        // listen in-channel   
	        var self = this;     
	        var on_get_indata = function(snapshot)
	        {
	            var d = snapshot["val"]();
	            if (d == null)
	                return;            
	            self.OnGetInputData(d);
	        };
	        this.on_get_indata = on_get_indata;
	        this.get_ref("in")["on"]("child_added", on_get_indata);
	    }  
	    OnReleaseToken()
	    {
	        // remove in-channel listening        
	        if (!this.on_get_indata)
	            return;            
	        this.get_ref("in")["off"]("child_added", this.on_get_indata);
	        this.on_get_indata = null;
	    }  	
	    
	    // token owner only
	    OnGetInputData(d)
	    {
	        // process in-data to out-data
	        this.exp_LastIn = din(d);
		    this.has_input_handler = false;
		    this.runtime.trigger(cr.plugins_.Rex_Firebase_SyncQueue.prototype.cnds.OnGetInputData, this);	    	   
		    // process in-data to out-data

	        // push out-data
	        if (!this.has_input_handler)
	        {
	            this.get_ref("out")["push"](d);
	        }

	        // remove from in-channel   
	        var k = snapshot["key"]();
	        this.get_ref("in")["child"](k)["remove"]();        
	    }    
	};
}