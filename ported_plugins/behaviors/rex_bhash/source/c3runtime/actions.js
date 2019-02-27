"use strict";
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
	var getFullKey = function (currentKey, key)
	{
        if (currentKey !== "")
            key = currentKey + "." + key;
        
	    return key;
	};

{
	C3.Behaviors.Rex_bHash.Acts =
	{
		SetValueByKeyString(key, val)
		{   
	        if (key === "")
	            return;
	        
	        this.setValue(key, val);
		},
	     
		SetCurHashEntey(key)
		{        
	        this.setCurrentEntry(key);
	    },

		SetValueInCurHashEntey(key, val)
		{        
	        if (key === "")
	            return;
	        
	        this.setValue(key, val, this.currentEntry);
		},    

		CleanAll()
		{        
	        this.cleanAll();      
		},  

	    StringToHashTable(JSON_string)
		{  
		    if (JSON_string != "")
		        this.hashtable = JSON.parse(JSON_string);
		    else
		        this.cleanAll();
		},  
	    
	    RemoveByKeyString(key)
		{  
	        this.removeKey(key);
		},  
	    
	    PickKeysToArray(key, arrayObjs)
		{   
		    if (!arrayObjs)
		        return;
		        
	        var arrayObj = arrayObjs.GetFirstPicked().GetSdkInstance();
	        //assert2(arrayObj.arr, "[Hash] Action:Pick keys need an array type of parameter.");
	        //C3.Plugins.Arr.Acts.SetSize.apply(arrayObj, [0,1,1]);
	        arrayObj.SetSize(0,1,1);
	        var entry = this.getEntry(key);
			for (var key in entry)
	            C3.Plugins.Arr.Acts.Push.call(arrayObj, 0, key, 0); 
		},    
		

	    MergeTwoHashTable(hashtable_objs, conflict_handler_mode)
		{  
		    if (!hashtable_objs)
		        return;
		        	    
	        var hashB = hashtable_objs.GetFirstPicked();
	        if (hashB == null)
	            return;
	        //assert2(hashB.hashtable, "[Hash] Merge : need an hash type of parameter."); 
	        
			var untraversalTables = [], node;
			var curHash, currentKey, keyB, valueB, keyA, valueA, fullKey;
			
			// Clean all then deep copy from hash table B
			if (conflict_handler_mode === 2)
			{
			    this.cleanAll(); 
			    conflict_handler_mode = 0;
			}
			
	        switch (conflict_handler_mode)
	        {
	        case 0: // Overwrite from hash B
	            untraversalTables.push({table:hashB.GetSdkInstance().hashtable, key:""});
				while (untraversalTables.length !== 0)
				{
				    node = untraversalTables.shift();
				    curHash = node.table;
				    currentKey = node.key;
				    for (keyB in curHash)
					{
					    valueB = curHash[keyB];
	                    fullKey = getFullKey(currentKey, keyB);
	                    valueA = this.getValue(fullKey);
	                    // number, string, boolean, null
					    if ((valueB === null) || typeof(valueB) !== "object")
						{
	                        this.setValue(fullKey, valueB);
						}
						else
						{
	                        // valueB is an array but valueA is not an array
	                        if (isArray(valueB) && !isArray(valueA))
	                            this.setValue(fullKey, []);

						    untraversalTables.push({table:valueB, key:fullKey});
						}
					}
				}
	            break;
	            
	        case 1:  // Merge new keys from hash table B
	            untraversalTables.push({table:hashB.GetSdkInstance().hashtable, key:""}); 
				while (untraversalTables.length !== 0)
				{
				    node = untraversalTables.shift();
				    curHash = node.table;
				    currentKey = node.key;
				    for (keyB in curHash)
					{
					    valueB = curHash[keyB];
	                    fullKey = getFullKey(currentKey, keyB);
	                    valueA = this.getValue(fullKey);
	                    if (valueA !== undefined)
	                        continue;
	                    
					    if ((valueB == null) || typeof(valueB) !== "object")
						{
						    this.setValue(fullKey, valueB);
						}
	                    else
						{             
	                        // valueB is an array
	                        if ( isArray(valueB) )
	                            this.setValue(fullKey, []);
	                        
						    untraversalTables.push({table:valueB,  key:fullKey});
						}
					}
				}
	            break;			
				
	        }
		}, 	 
	    
		SetJSONByKeyString(key, val)
		{        
	        val = JSON.parse(val);
	        this.setValue(key, val);
		},    
	        
		AddToValueByKeyString(keys, val)
		{   
	        if (keys === "")
	            return;
	        
	        keys = keys.split(".");
	        var curValue = this.getValue(keys) || 0;
	        this.setValue(keys, curValue + val);
		},    

	    Shuffle(entryKey)
		{   
	        var arr = this.getValue(entryKey);
	        if (!isArray(arr))
	            return;
	        
	        _shuffle(arr);
	        
		}, 

	    Sort(entryKey, sortKey, sortMode_)
		{   
	        var arr = this.getValue(entryKey);
	        if (!isArray(arr))
	            return;
	        
	        if (sortKey === "")
	            sortKey = null;
	        else
	            sortKey = sortKey.split(".");
	        
	        var self = this;        
	        var sortFn = function (itemA, itemB)
	        {
	            var valA = (sortKey)? self.getValue(sortKey, itemA): itemA;
	            var valB = (sortKey)? self.getValue(sortKey, itemB): itemB;
	            var m = sortMode_;
	            
	            if (sortMode_ >= 2)  // logical descending, logical ascending
	            {
	                valA = parseFloat(valA);
	                valB = parseFloat(valB);
	                m -= 2;
	            }

	            switch (m)
	            {
	            case 0:  // descending
	                if (valA === valB) return 0;
	                else if (valA < valB) return 1;
	                else return -1;
	                break;
	                
	            case 1:  // ascending
	                if (valA === valB) return 0;
	                else if (valA > valB) return 1;
	                else return -1;
	                break;
	                
	            }
	        }
	        arr.sort(sortFn);
		},
	    
		PushJSON(keys, val)
		{        
	        val = JSON.parse(val);
	        C3.Plugins.Rex_Hash.Acts.PushValue.call(this, keys, val);
		},    

		PushValue(keys, val)
		{
	        var arr = this.getEntry(keys, null, []);    
	        if (!isArray(arr))
	            return;
	        
	        arr.push(val);
		},     
	  
		InsertJSON(keys, val, idx)
		{        
	        val = JSON.parse(val);
	        C3.Plugins.Rex_Hash.Acts.InsertValue.call(this, keys, val, idx);
		},    
	    
		InsertValue(keys, val, idx)
		{
	        var arr = this.getEntry(keys, null, []);  
	        if (!isArray(arr))
	            return;
	        
	        arr.splice(idx, 0, val);
		},       
	    
		SetIndent(space)
		{
	        this.setIndent(space);
		}    
	};
}