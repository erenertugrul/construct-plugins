"use strict";

{
	C3.Plugins.Rex_Firebase_ItemFilter.Instance = class Rex_Firebase_ItemFilterInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
		
	        this.prepared_item = {};
	        this.request_itemIDs = {};
	           
	        this.trig_tag = null;            
	        this.exp_CurItemID = "";
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

		get_itemID2Keys_ref(itemID, key_)
		{
		    var ref = this.get_ref("itemID-keys")["child"](itemID);
		    if (!key_)
		        ref = ref["child"](key_);
	        return ref;
		}
		

		get_itemID_ref(itemID)
		{
	        return this.get_ref("itemIDs")["child"](itemID);
		}
		
		create_save_item (itemID, item_)
		{
		    var save_item = {};
	        save_item[ get_itemID_path(itemID) ] = true;
		    var k, v;   
		    for (k in item_)
		    {
		        v = item_[k];
		        save_item[ get_key_path(itemID, k) ] = v;
		        save_item[ get_itemID2Keys_path(itemID, k) ] = (v === null)? null : true;
		    }	    
		    return save_item;
		}
		
		create_remove_item (itemID, keys)
		{
	        var remove_item = {};
	        // remove itemID from list
	        remove_item[ get_itemID_path(itemID) ] = null;
	        // remove itemID-key
	        remove_item[ get_itemID2Keys_path(itemID, k) ] = null;
	                        
		    // remove keys from filters
		    var k;
		    for(k in keys)
		    {
		        remove_item[ get_key_path(itemID, k) ] = null;
	        }
		    return remove_item;
		}
		
	    save_item (itemID, item_, tag_)
		{	
		    var self = this;	    
		    var onComplete_handler = function(error)
		    {
		        if (!tag_)
		            return;
		            
			    var trig = (!error)? C3.Plugins.Rex_Firebase_ItemFilter.Cnds.OnSaveComplete:
			                         C3.Plugins.Rex_Firebase_ItemFilter.Cnds.OnSaveError;
	            self.trig_tag = tag_;	
	            self.exp_CurItemID = itemID;	                         
			    self.Trigger(trig); 	   
			    self.trig_tag = null;
			    self.exp_CurItemID = "";
		    };


		    // multi-location update
		    var write_item = this.create_save_item(itemID, item_);    	     
			this.get_ref()["update"](write_item, onComplete_handler);
		    // multi-location update
		}
		
	    remove_item(itemID, tag_)
		{
		    var self = this;
		    
		    // try remove itemID
		    var on_read_keys = function (snapshot)
	        {
	            var keys = snapshot.val();
	            if (keys == null)  // itemID is not existed
	            {
	                onComplete_handler(true);
	            }
	            else  // itemID is existed, get keys
	            {
	                var items = self.create_remove_item(itemID, keys);
	                self.get_ref()["update"](items, onComplete_handler);
	                
	            }
	        };
		    // try remove itemID	    
		    
		    var onComplete_handler = function(error)
		    {
		        if (!tag_)
		            return;
		            	        
			    var trig = (!error)? C3.Plugins.Rex_Firebase_ItemFilter.Cnds.OnRemoveComplete:
			                         C3.Plugins.Rex_Firebase_ItemFilter.Cnds.OnRemoveError;
	            self.trig_tag = tag_;
	            self.exp_CurItemID = itemID;				                         
			    self.Trigger(trig); 	   
			    self.trig_tag = null;    
			    self.exp_CurItemID = "";   
		    };  
		    	    
		    // read itemID-keys
		    this.get_itemID2Keys_ref(itemID)["once"]("value", on_read_keys);   
		}	
	    
	    get_Equal_codeString(key_, value_)
		{
	        key_ = string_quote(key_);
	        value_ = string_quote(value_);
	        var code_string = 'filter.Query("Equal",'+key_+","+value_+")";
	        return code_string;
		}
	    
	    get_GreaterEqual_codeString(key_, value_)
		{
	        key_ = string_quote(key_);
	        value_ = string_quote(value_);
	        var code_string = 'filter.Query("GreaterEqual",'+key_+","+value_+")";
	        return code_string;
		}
	    
	    get_LessEqual_codeString(key_, value_)
		{
	        key_ = string_quote(key_);
	        value_ = string_quote(value_);
	        var code_string = 'filter.Query("LessEqual",'+key_+","+value_+")";
			return code_string;
		}    
	    
	    get_InRange_codeString(key_, start_, end_)
		{
	        key_ = string_quote(key_);
	        start_ = string_quote(start_);
	        end_ = string_quote(end_);
	        var code_string = 'filter.Query("InRange",'+key_+","+start_+","+end_+")";
			return code_string;
		} 

	       
	    get_OR_codeString()
		{
	        array_copy(ARGS_COPY, arguments);
	        var code_string = 'filter.AddSETOP("OR",'+ARGS_COPY.join(",")+")";
			return code_string;
		}     
	    
	    get_AND_codeString()
		{
	        array_copy(ARGS_COPY, arguments);
	        var code_string = 'filter.AddSETOP("AND",'+ARGS_COPY.join(",")+")";
			return code_string;
		}    
	    
	    get_SUB_codeString()
		{
	        array_copy(ARGS_COPY, arguments);
	        var code_string = 'filter.AddSETOP("SUB",'+ARGS_COPY.join(",")+")";
			return code_string;
		}    
	    
	    get_SUBVALUE_codeString()
		{
	        array_copy(ARGS_COPY, arguments);
	        var code_string = 'filter.AddSETOP("SUB_VALUE",'+ARGS_COPY.join(",")+")";
			return code_string;
		}
		


	};
}