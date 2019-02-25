"use strict";
var COMPARSION_TYPE = ["equalTo", "startAt", "endAt", "startAt", "endAt"];
var _shuffle = function (arr, random_gen)
{
    var i = arr.length, j, temp, random_value;
    if ( i == 0 ) return;
    while ( --i ) 
    {
        random_value = (random_gen == null)?
                       Math.random(): random_gen.random();
        j = Math.floor( random_value * (i+1) );
        temp = arr[i]; 
        arr[i] = arr[j]; 
        arr[j] = temp;
    }
};  
var LIMITTYPE = ["limitToFirst", "limitToLast"];
{
	C3.Plugins.Rex_Firebase_ItemFilter.Acts =
	{

	    SetDomainRef(domain_ref, sub_domain_ref)
		{
			this.rootpath = domain_ref + "/" + sub_domain_ref + "/";
		},
			
	    SetValue(key_, value_)
		{
			this.prepared_item[key_] = value_;
		},
		
	    SetBooleanValue(key_, is_true)
		{
			this.prepared_item[key_] = (is_true === 1);
		},
		
	    Save(itemID, tag_)
		{	
		    this.save_item(itemID, this.prepared_item, tag_);
	        this.prepared_item = {};
		},
		
	    Remove(itemID, tag_)
		{
		    this.remove_item(itemID, tag_);
		},

	    RemoveKey(key_)
		{
			this.prepared_item[key_] = null;
		},
		
	    GetRandomItems(pick_count, tag_)
		{	    
	        this.request_itemIDs = {};
		    
		    var self = this;
		    var on_read_itemIDs = function (snapshot)
	        {
	            var arr_itemIDs = [];
	            var itemIDs = snapshot.val();
	            if (itemIDs == null)
	            {
	                // pick none
	            }
	            else
	            {
	                retrieve_itemIDs(itemIDs, arr_itemIDs);
	                var cnt = arr_itemIDs.length;
	                
	                if (cnt <= pick_count)
	                {
	                    var i;
	                    for (i=0; i<cnt; i++)
	                        self.request_itemIDs[arr_itemIDs[i]] = true; 
	                }
	                else if ((pick_count/cnt) < 0.5)
	                {
	                    // random number picking
	                    var i, rv, try_pick, itemID;
	                    for (i=0; i<pick_count; i++)
	                    {
	                        try_pick = true;
	                        while (try_pick)
	                        {
	                            rv = Math.floor(Math.random() * cnt);
	                            itemID = arr_itemIDs[rv];
	                            if (!self.request_itemIDs.hasOwnProperty(itemID))
	                            {
	                                self.request_itemIDs[itemID] = true;
	                                try_pick = false;
	                            }
	                        }
	                    }
	                }
	                else
	                {
	                    // shuffle index array picking
	                    _shuffle(arr_itemIDs);
	                    arr_itemIDs.length = pick_count;
	                    var i;
	                    for (i=0; i<pick_count; i++)
	                        self.request_itemIDs[arr_itemIDs[i]] = true; 
	                }
	            } // pick random 

	            self.trig_tag = tag_;		            
			    self.Trigger(C3.Plugins.Rex_Firebase_ItemFilter.Cnds.OnRequestComplete); 	   
				self.trig_tag = null;     
	        };
		

			this.get_ref("itemIDs")["once"]("value", on_read_itemIDs);
		},	
		

	    GetItemsByCondition(condition_expression, tag_)
		{  
	        var filter = new FilterKlass(this);
	        var self=this;
	        var on_complete = function(result)
	        {
	            self.request_itemIDs = {};
	            for (var k in result)
	                self.request_itemIDs[k] = true;
	            self.trig_tag = tag_;		            
			    self.Trigger(C3.Plugins.Rex_Firebase_ItemFilter.Cnds.OnRequestComplete); 	   
				self.trig_tag = null;
	        }

	        filter.DoRequest(condition_expression, on_complete);
		},
		
		
	    GetItemsBySingleConditionInRange(key_, start, end, limit_type, limit_count, tag_)
		{  
		    this.request_itemIDs = {};
		    
		    var self = this;
	        var read_item = function(childSnapshot)
	        {
	            var k = get_key(childSnapshot);
	            var v = childSnapshot["val"]();
	            self.request_itemIDs[k] = v;
	        };     
	        var on_read_itemIDs = function (snapshot)
	        {
	            snapshot["forEach"](read_item);
	            
	            self.trig_tag = tag_;		            
			    self.Trigger(C3.Plugins.Rex_Firebase_ItemFilter.Cnds.OnRequestComplete); 	   
				self.trig_tag = null;
	        };	    
	        	    
		    var query = this.get_ref("filters")["child"](key_);
	        query = query["orderByValue"]();
		    query = query["startAt"](start)["endAt"](end);
		    query = query[LIMITTYPE[limit_type]](limit_count);
		    query["once"]("value", on_read_itemIDs);
		},	
		
		
	    GetItemsBySingleCondition(key_, comparsion_type, value_, limit_type, limit_count, tag_)
		{  
		    var is_exclusive = (comparsion_type == 3) || (comparsion_type == 4);
		    var current_item_count=0, last_key = "";
		    
		    this.request_itemIDs = {};
		    
		    var self = this;
	        var read_item = function(childSnapshot)
	        {
	            var k = get_key(childSnapshot);               
	            var v = childSnapshot["val"]();
	            
	            self.request_itemIDs[k] = v;
	            current_item_count += 1;
	        };     
	        var on_read_itemIDs = function (snapshot)
	        {
	            snapshot["forEach"](read_item);
	            
	            self.trig_tag = tag_;		            
			    self.Trigger(C3.Plugins.Rex_Firebase_ItemFilter.Cnds.OnRequestComplete); 	   
				self.trig_tag = null;
	        };	    
	        	    
		    var query = this.get_ref("filters")["child"](key_);	  
	        query = query["orderByValue"]();        
		    query = query[COMPARSION_TYPE[comparsion_type]](value_);	    
		    query = query[LIMITTYPE[limit_type]](limit_count);
		    query["once"]("value", on_read_itemIDs);
		}
	};
}