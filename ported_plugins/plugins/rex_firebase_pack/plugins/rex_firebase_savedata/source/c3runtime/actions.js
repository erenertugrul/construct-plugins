"use strict";
var re_ALLDOT = new RegExp(/\./, 'g');  
{
	C3.Plugins.Rex_Firebase_SaveSlot.Acts =
	{
	    SetOwner(id)
		{
	        this.ownerID = id;
	        this.exp_LastSlotName = null;
	        this.load_body = null;
	        this.load_headers = null;
		},
		
	      
	    SetValue(k, v, is_body)
		{
	        var table = (is_body==1)? this.save_body:this.save_header;
	        k = k.replace(re_ALLDOT, "/");
			table[k] = v;
		},
		
	    Save(slot_name)
		{
			var self = this;				
		    var on_complete = function(error) 
		    {
	            self.error = error;
				var trig = (!error)? C3.Plugins.Rex_Firebase_SaveSlot.Cnds.OnSave:
					                 C3.Plugins.Rex_Firebase_SaveSlot.Cnds.OnSaveError;
				self.Trigger(trig); 					   
	        };
			
	        if (is_empty(this.save_header))
			    this.save_header["is-used"] = true;
				
	        var k;
	        for (k in this.save_header)
	            this.save_item[ get_path(slot_name, false, k) ] = this.save_header[k];
	            
	        for (k in this.save_body)
	            this.save_item[ get_path(slot_name, true, k) ] = this.save_body[k];            
		    
		    var ref = this.get_ref(this.ownerID);	
	        ref["update"](this.save_item, on_complete);		
			
	        this.updateCacheData(slot_name, this.save_header, this.save_body);
	        this.save_header = {};
	        this.save_body = {};
	        this.save_item = {};
		},
	    	
	    SetBooleanValue(k, b, is_body)
		{
	        var table = (is_body==1)? this.save_body:this.save_header;
			table[k] = (b==1);
		},
	    
	    SetJSON(k, v, is_body)
		{
	        var table = (is_body==1)? this.save_body:this.save_header;
			table[k] = JSON.parse(v);
		},	
	    	
	    RemoveKey(k, is_body)
		{
	        var table = (is_body==1)? this.save_body:this.save_header;
			table[k] = null;
		},	    
	    	
	    SetBooleanValue(k, b, is_body)
		{
	        var table = (is_body==1)? this.save_body:this.save_header;
			table[k] = (b==1);
		},
		
	    GetAllHeaders()
		{
		    var ref = this.get_ref(this.ownerID)["child"]("headers");
			
			var self = this;
	        var on_read = function(snapshot)
	        {   
	            self.error = null;
	            self.load_headers = snapshot.val();
	            self.Trigger(C3.Plugins.Rex_Firebase_SaveSlot.Cnds.OnGetAllHeaders, self); 
	        };
	        var on_read_failure = function(error)
	        {
	            self.error = error;
	            self.Trigger(C3.Plugins.Rex_Firebase_SaveSlot.Cnds.OnGetAllHeadersError, self);                         
	        };        
				
			ref["once"]("value", on_read, on_read_failure);
		},
		
	    GetSlotBody(slot_name)
		{
		    var ref = this.get_ref(this.ownerID)["child"]("bodies")["child"](slot_name);
			
			var self = this;
	        var on_read = function (snapshot)
	        {   
	            self.exp_LastSlotName = slot_name;
	            self.load_body = snapshot.val();
	            self.error = null;            
				var trig = (self.load_body!=null)? C3.Plugins.Rex_Firebase_SaveSlot.Cnds.OnGetBody:
					                               C3.Plugins.Rex_Firebase_SaveSlot.Cnds.OnGetUnusedBody;
	            self.Trigger(trig, self); 
	        };
	        var on_read_failure = function(error)
	        {
	            self.error = error;
	            self.exp_LastSlotName = slot_name;
	            self.load_body = null;
	            self.Trigger(C3.Plugins.Rex_Firebase_SaveSlot.Cnds.OnGetBodyError, self);               
	        };              
				
			ref["once"]("value", on_read, on_read_failure);
		},

	    CleanSlot(slot_name)
		{		
			var self = this;		
		    var on_complete = function(error) 
		    {
	            self.error = error;
				var trig = (!error)? C3.Plugins.Rex_Firebase_SaveSlot.Cnds.OnClean:
					                 C3.Plugins.Rex_Firebase_SaveSlot.Cnds.OnCleanError;
				self.Trigger(trig, self); 					   
	        };
	        
		    var ref = this.get_ref(this.ownerID);	
	        var save_item = {};
	        slot_name = (slot_name)? ("/"+slot_name) : "";
	        save_item["headers" + slot_name] = null;
	        save_item["bodies" + slot_name] = null;     
	        ref["update"](save_item, on_complete);        
		}
	};
}