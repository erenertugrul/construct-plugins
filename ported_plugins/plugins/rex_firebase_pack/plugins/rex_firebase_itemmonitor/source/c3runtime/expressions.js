"use strict";

{
	C3.Plugins.Rex_Firebase_ItemMonitor.Exps =
	{
	    LastItemID()
		{
			return (this.exp_LastItemID);
		},
	    LastItemContent(key_, default_value)
		{
	        var val = getValueByKeyPath(this.exp_LastItemContent, key_);
	        val = din(val, default_value);
			return (val);
		},	
	    At(itemID, key_, default_value)
		{
		    var val, props = this.items[itemID];
		    if (props)	    
		        val = getValueByKeyPath(props, key_);
	        
	        val = din(val, default_value);
			return (val);
		},    
	    
	    // ef_deprecated    
	    LastItemContentPosX()
		{
		    var v = this.exp_LastItemContent;
	        if (v != null)
	        {
	            v = v["pos"];
	            if (v != null)
	                v = v["x"];                   
	        }
	        if ( v == null)
	            v = 0;     
			return (v); 
		},
	    // ef_deprecated     
	    LastItemContentPosY()
		{
		    var v = this.exp_LastItemContent;
	        if (v != null)
	        {
	            v = v["pos"];
	            if (v != null)
	                v = v["y"];                   
	        }
	        if ( v == null)
	            v = 0;     
			return (v); 
		}, 	

	    LastPropertyName()
		{
			return (this.exp_LastPropertyName);
		},
	    LastValue(subKey)
		{
	        var val = getValueByKeyPath(this.exp_LastValue, subKey);
			return (din(val));
		},
	    PrevValue(subKey)
		{
	        var val = getValueByKeyPath(this.exp_PrevValue, subKey);
			return (din(val));
		},	
	    
	    // ef_deprecated     
	    LastValuePosX()
		{
		    var v = this.exp_LastValue;
	        if (v != null)
	            v = v["x"];         
	        if ( v == null)
	            v = 0;     
			return (v);
		},    
	    // ef_deprecated         
	    LastValuePosY()
		{
		    var v = this.exp_LastValue;
	        if (v != null)
	            v = v["y"];   
	        if ( v == null)
	            v = 0;     
			return (v);
		},
	    // ef_deprecated         
	    PrevValuePosX()
		{
		    var v = this.exp_PrevValue;
	        if (v != null)
	            v = v["x"];     
	        if ( v == null)
	            v = 0;     
			return (v);
		},    
	    // ef_deprecated         
	    PrevValuePosY()
		{
		    var v = this.exp_PrevValue;
	        if (v != null)
	            v = v["y"];     
	        if ( v == null)
	            v = 0;     
			return (v);
		},    
	    
	    CurItemID()
		{
			return (this.exp_CurItemID);
		},
	    CurKey()
		{
			return (this.exp_CurKey);
		},	
		
	    CurValue(subKey)
		{
	        var val = getValueByKeyPath(this.exp_CurValue, subKey);
			return (din(val));
		},	
	    CurItemContent(key_, default_value)
		{
	        var val = getValueByKeyPath(this.exp_CurItemContent, key_);
			return (din(val));
		}
	};
}