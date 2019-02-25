"use strict";

{
	C3.Plugins.Rex_Firebase_ItemTable.Exps =
	{
	    CurItemID()
		{
			return (this.exp_CurItemID);
		},
	    
		LoadResultToJSON()
		{
			return (JSON.stringify(this.load_items));
		},	
		
	    CurKey()
		{
			return (this.exp_CurKey);
		},	
		
	    CurValue()
		{
		    var v = this.exp_CurValue;
		    v = din(v);
			return(v);
		},	
			
	    At(itemID, key_, default_value)
		{
		    var v;
	        if (!this.load_items.hasOwnProperty(itemID))
	            v = null;
	        else
	            v = this.load_items[itemID][key_];
	        
	        v = din(v, default_value);
			return(v);
		},	
		
		LastItemID()
		{
			return (this.exp_LastItemID);
		},
		
	    CurItemContent(key_, default_value)
		{
		    var v;
	        if (key_ == null)
	            v = din(this.exp_CurItemContent);
	        else
	            v = din(this.exp_CurItemContent[key_], default_value);
	 
			return(v);
		},
		
		ItemsCount()
		{
	        if (this.load_items_cnt === null)
	        {
	            this.load_items_cnt = 0;
	            for (var k in this.load_items)
	                this.load_items_cnt += 1;
	        }
			ret.set_int(this.load_items_cnt);
		},
	    
		GenerateKey()
		{
		    var ref = this.get_ref()["push"]();
	        this.exp_LastGeneratedKey = get_key(ref);
			return (this.exp_LastGeneratedKey);
		},	
	    
		LastGeneratedKey()
		{
		    return (this.exp_LastGeneratedKey);
		},
	    
	    Ref(itemID_, key_)
		{
	        var path = this.rootpath + getFullKey("", itemID_, key_);  
			return (path);
		} 
	};
}