"use strict";
var gKeys = [];
{
	C3.Plugins.Rex_Hash.Exps =
	{
		Hash(keys, default_value)
		{   
	        keys = keys.split(".");
	        var val = din(this.getValue(keys), default_value,this.space);
			return (val);
		},
	    At(keys, default_value)
	    {
	        keys = keys.split(".");
	        var val = din(this.getValue(keys), default_value,this.space);
			return (val);
	    },
	    
		AtKeys(key)
		{
	        gKeys.length = 0; 
	        var i, cnt=arguments.length, k;
	        for (i=0; i<cnt; i++) // i 'yi 0 yap.
	        {
	            k = arguments[i];
	            if ((typeof (k) === "string") && (k.indexOf(".") !== -1))           
	                gKeys.push.apply(gKeys, k.split("."));            
	            else            
	                gKeys.push(k);            
	        }
	                   
	        var val = din(this.getValue(gKeys), null, this.space); 
	        gKeys.length = 0; 
			return (val);
		},    
	    
		Entry(key)
		{
	        var val = din(this.currentEntry[key], null, this.space);      
			return (val);
		},

		HashTableToString()
		{
	        var json_string = JSON.stringify(this.hashtable,null,this.space);
			return (json_string);
		},  
		
		CurKey()
		{
			return (this.exp_CurKey);
		},  
	    
		CurValue(subKeys, default_value)
		{
	        var val = this.getValue(subKeys, this.exp_CurValue);        
	        val = din(val, default_value, this.space);
			return (val);
		},
	    
		ItemCnt(keys)
		{ 
	        var cnt = getItemsCount(this.getValue(keys));
			return (cnt);
		},	
	    
		Keys2ItemCnt(key)
		{
	        var keys = (arguments.length > 2)?
	                         Array.prototype.slice.call(arguments,1):
	                         [key];   
	        var cnt = getItemsCount(this.getValue(keys));
			return (cnt);
		},		
	    
		ToString()
		{
		    var table;
		    if (arguments.length == 1)  // no parameter
			    table = this.hashtable;
			else
			{
			    var i, cnt=arguments.length;
				table = {};
				for(i=1; i<cnt; i=i+2)
				    table[arguments[i]]=arguments[i+1];
		    }
			return (JSON.stringify(table,null,this.space));
		},		
	    
		AsJSON()
	    {
	        var json_string = JSON.stringify(this.hashtable,null,this.space);
			return (json_string);
	    },
	    
		RandomKeyAt(keys, default_value)
		{
	        var val;
	        var o = this.getValue(keys);
	        if (typeof(o) === "object")
	        {
	            var isArr = isArray(o);
	            if (!isArr)            
	                o = Object.keys(o);

	            var cnt = o.length;
	            if (cnt > 0)     
	            {    
	                val = Math.floor(Math.random()*cnt);       
	                if (!isArr)
	                    val = o[val];
	            }
	        }
	        
	        val = din(val, default_value, this.space);
			return (val);
		},	    
	    
		Loopindex()
		{
			return (this.exp_Loopindex);
		},
	    
		Pop(keys, idx)
		{
	        var arr = this.getEntry(keys);        
	        var val;        
	        if (arr == null)
	            val = 0;
	        else if ((idx == null) || (idx === (arr.length-1)))
	            val = arr.pop()
	        else
	            val = arr.splice(idx, 1);
	        
			return ( din(val, null, this.space) );
		}   
    
	};
}