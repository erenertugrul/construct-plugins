"use strict";

{
	C3.Plugins.Rex_Firebase_ItemTable.Acts =
	{
	
	    SetDomainRef(domain_ref, sub_domain_ref)
		{
			this.rootpath = domain_ref + "/" + sub_domain_ref + "/"; 
			this.clean_load_items();
		},
		      
	    SetValue(key_, value_)
		{
			this.save_item[key_] = dout(value_);
		},
		
	    SetBooleanValue(key_, is_true)
		{
			this.save_item[key_] = (is_true == 1);
		},

	    RemoveKey(key_)
		{
			this.save_item[key_] = null;
		},  	
		
	    Save(itemID, set_mode, tag_)
		{	 
		    this.Save(itemID, this.save_item, set_mode, tag_);
	        this.save_item = {};
		},	
		
	    Push(tag_)
		{	 
		    this.Save("", this.save_item, 1, tag_);
	        this.save_item = {};        
		},	
		
	    Remove(itemID, tag_)
		{
		    this.Remove(itemID, tag_);
		},
		
	    GenerateKey()
		{
		    var ref = this.get_ref()["push"]();
	        this.exp_LastGeneratedKey = get_key(ref);
		},	
		
	    SetPosValue(x, y)
		{
			this.save_item["pos"] = {"x":x, "y":y};
		},	    
		
	    SetServerTimestampValue(key_)
		{
			this.save_item[key_] = serverTimeStamp();
		},
		
	    AddLoadRequestItemID(itemID)
		{
		    if (itemID == "")
		        return;
		        
			this.load_request_itemIDs[itemID] = true;
		},
				
	    LoadItems(tag_)
		{
		    this.clean_load_items();

	        var self = this;
		    // wait done
	        var wait_events = 0;    
		    var isDone_handler = function()
		    {
		        wait_events -= 1;
		        if (wait_events == 0)
		        {                
		            // all jobs done
	                self.trig_tag = tag_;	                    
	                var trig = C3.Plugins.Rex_Firebase_ItemTable.Cnds.OnLoadComplete;     
					self.Trigger(trig); 	   
					self.trig_tag = null;	  
		        }
		    };
		    // wait done
		    
	        // read handler	    
		    var on_read = function (snapshot)
		    {
		        var itemID = get_key(snapshot);
		        var content = snapshot["val"]();
		        self.load_items[itemID] = content;
		        isDone_handler();
		    };		    
		    	    
	        // read itemIDs
	        var itemID, item_ref;
			for(itemID in this.load_request_itemIDs)
			{
			    wait_events += 1;
			    item_ref = this.get_ref(itemID)["once"]("value", on_read);
			    delete this.load_request_itemIDs[itemID];
			}		
		},	

	    LoadAllItems(tag_)
		{
		    clean_table(this.load_items);

	        var self = this;
		    // wait done
	        var wait_events = 0;    
		    var isDone_handler = function()
		    {
		        wait_events -= 1;
		        if (wait_events == 0)
		        {	            
		            // all jobs done
	                self.trig_tag = tag_;	                    
	                var trig = C3.Plugins.Rex_Firebase_ItemTable.Cnds.OnLoadComplete;     
					self.Trigger(trig); 	   
					self.trig_tag = null;	  
		        }
		    };
		    // wait done
	        
	        // read handler	
	        var read_item = function(childSnapshot)
	        {
	            var key = get_key(childSnapshot);
	            var childData = childSnapshot["val"]();
	            self.load_items[key] = childData;
	        };   
		    var on_read = function (snapshot)
		    {            
	            snapshot["forEach"](read_item);
	            isDone_handler();
		    };		    
		    	    
	        // read all
	        wait_events += 1;
	        this.get_ref()["once"]("value", on_read);	
		},
	  
	    CancelOnDisconnected()
		{
		    this.CancelOnDisconnected();
		},	
	    
	    RemoveOnDisconnected(itemID)
		{
		    if (itemID == "")
		        return;
	        
	        var ref = this.get_ref(itemID);
	        ref["onDisconnect"]()["remove"]();
		    this.disconnectRemove_absRefs[ref["toString"]()] = true;
		},
	    
	    CleanAll()
		{
	        var self=this;
	        var onComplete = function(error)
	        {
		        var trig = (!error)? C3.Plugins.Rex_Firebase_ItemTable.Cnds.OnCleanAllComplete:
		                                    C3.Plugins.Rex_Firebase_ItemTable.Cnds.OnCleanAllError;
		        self.Trigger(trig);  
	        };
		    var ref = this.get_ref();	
	        ref["remove"](onComplete);
		}   
	};
}