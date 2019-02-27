"use strict";

{
	C3.Behaviors.Rex_bHash.Instance = class Rex_bHashInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			
	        this.exp_CurKey = "";
	        this.exp_CurValue = 0; 	
	        this.exp_Loopindex = 0;
			if (properties)		// note properties may be null in some cases
			{
				var init_data = properties[0];
				this.setIndent(properties[1]);
		        if (init_data != ""){
	            	this.hashtable = JSON.parse(init_data);
		        }
	       		else{
	            	this.hashtable = {};
	       		}
			this.currentEntry = this.hashtable;	
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"d": this.hashtable
			};
		}
		
		LoadFromJson(o)
		{
			this.hashtable = o["d"];
		}
		GetInstance()
		{
			//this.anan = this._inst.GetProject();
		}
		
		cleanAll()
		{
		    var key;
			for (key in this.hashtable)
			    delete this.hashtable[key];
	        this.currentEntry = this.hashtable;
		}    
	        
		getEntry(keys, root, defaultEntry)
		{
	        var entry = root || this.hashtable;
	        if ((keys === "") || (keys.length === 0))
	        {
	            //entry = root;
	        }
	        else
	        {
	            if (typeof (keys) === "string")
	                keys = keys.split(".");
	            
	            var i,  cnt=keys.length, key;
	            for (i=0; i< cnt; i++)
	            {
	                key = keys[i];                
	                if ( (entry[key] == null) || (typeof(entry[key]) !== "object") )                
	                {
	                    var newEntry;
	                    if (i === cnt-1)
	                    {
	                        newEntry = defaultEntry || {};
	                    }
	                    else
	                    {
	                        newEntry = {};
	                    }
	                    
	                    entry[key] = newEntry;
	                }
	                
	                entry = entry[key];            
	            }           
	        }
	        
	        return entry;
		}  

		setCurrentEntry(keys, root)
		{
	        this.currentEntry = this.getEntry(keys, root);
	    }    
	    
		setValue(keys, value, root)
		{        
	        if ((keys === "") || (keys.length === 0))
	        {
	            if ((value !== null) && typeof(value) === "object")
	            {
	                if (root == null)
	                    this.hashtable = value;
	                else
	                    root = value;
	            }
	        }
	        else
	        {            
	            if (root == null)
	                root = this.hashtable;    
	    
	            if (typeof (keys) === "string")
	                keys = keys.split(".");
	            
	            var lastKey = keys.pop(); 
	            var entry = this.getEntry(keys, root);
	            entry[lastKey] = value;
	        }
		}     
	    
		getValue(keys, root)
		{           
	        if (root == null)
	            root = this.hashtable;
	        
	        if ((keys == null) || (keys === "") || (keys.length === 0))
	        {
	            return root;
	        }
	        else
	        {
	            if (typeof (keys) === "string")
	                keys = keys.split(".");
	            
	            var i,  cnt=keys.length, key;
	            var entry = root;
	            for (i=0; i< cnt; i++)
	            {
	                key = keys[i];                
	                if (entry.hasOwnProperty(key))
	                    entry = entry[ key ];
	                else
	                    return;              
	            }
	            return entry;                    
	        }
		} 
	    
	    removeKey(keys)
		{  
	        if ((keys === "") || (keys.length === 0))
	        {
	            this.cleanAll();
	        }
	        else
	        {
	            if (typeof (keys) === "string")
	                keys = keys.split(".");
	            
	            var data = this.getValue(keys);		    
	            if (data === undefined)
	                return;
	            
	            var lastKey = keys.pop();
	            var entry = this.getEntry(keys);
	            
	            if (!isArray(entry))
	            {
	                delete entry[lastKey];
	            }        
	            else            
	            {
	                if ((lastKey < 0) || (lastKey >= entry.length))
	                    return;
	                else if (lastKey === (entry.length-1))
	                    entry.pop();
	                else if (lastKey === 0)
	                    entry.shift();
	                else
	                    entry.splice(lastKey, 1);
	            }
	        }
		}     
	    
		setIndent(space)
		{
	        if (isNaN(space))
	            this.space = space;
	        else
	            this.space = parseInt(space);
		}  
		
	};
}