"use strict";

{
	C3.Plugins.Rex_Firebase_ItemBook.Exps =
	{

	  	GenerateKey()
		{
		    var ref = this.get_ref()["push"]();
	        this.exp_LastGeneratedKey = ref["key"];
			return(this.exp_LastGeneratedKey);
		},	
	    
		LastGeneratedKey()
		{
		    return(this.exp_LastGeneratedKey);
		},
	    
	    At(tableID, itemID, key, default_value)
		{
	        var item = this.readTables;
	        if (tableID)
	        {
	            item = item[tableID];
	            if (item && itemID)
	                item = item[itemID];        
	        }
			return(window.FirebaseGetValueByKeyPath(item, key, default_value) );
		},	    
	    
		LastTableID()
		{
			return(this.exp_LastTableID);
		},
		LastItemID()
		{
			return(this.exp_LastItemID);
		},    

	    CurItemID()
		{
			return(this.exp_CurItemID);
		},

	    CurKey()
		{
			return(this.exp_CurKey);
		},	
		
	    CurValue(subKey, default_value)
		{
			return(window.FirebaseGetValueByKeyPath(this.exp_CurValue, subKey, default_value ) );
		},	
	    	
	    CurItemContent(k, default_value)
		{
			return(window.FirebaseGetValueByKeyPath(this.exp_CurItemContent, k, default_value ) );
		},    
	        
	    AsItemList(tableID_, itemID_)
		{
	        var itemList = [];
	        var table, item;
	        if (tableID_ == null)
	        {
	            // convert all tables into item list            
	            for (var tableID in this.readTables)
	            {
	                table = this.readTables[tableID];
	                for (var itemID in table)
	                {
	                    item = table[itemID];
	                    itemList.push(this.ConvertItem(item, tableID, itemID));
	                }
	            }
	        }
	        else if (itemID_ == null)
	        {
	            // convert a table into item list     
	            table = this.readTables[tableID_];
	            if (table)
	            {
	                for (var itemID in table)
	                {
	                    item = table[itemID];
	                    itemList.push(this.ConvertItem(item, tableID_, itemID));
	                }
	            }            
	        }
	        else
	        {
	            // convert an item into item list 
	            table = this.readTables[tableID_];
	            if (table)
	            {
	                item = table[itemID_];
	                if (item)
	                    itemList.push(this.ConvertItem(item, tableID_, itemID_));
	            }
	            
	        }
	        var json_ = JSON.stringify(itemList);
	        
	        var i, cnt=itemList.length;
	        for(i=0; i<cnt; i++)
	        {
	            this.RevertItem(itemList[i]);
	        }
	        
			return(json_);
		},	 
	    
	    ItemCount(tableID_)
		{
	        var cnt=0;
	        if (tableID_ != null)
	        {
	            var table = this.readTables[tableID_];
	            if (table)
	            {
	                for (var itemID in table)                
	                    cnt++                
	            }
	        }
	        else
	        {
	            var table;
	            for(var tableID in this.readTables)
	            {
	                table = this.readTables[tableID];
	                for (var itemID in table)                
	                    cnt++        
	            }
	        }
			return (cnt);
		},    
	    
	    Ref(tableID_, itemID_, key_)
		{
	        var path = this.rootpath + getFullKey("", tableID_, itemID_, key_);  
			return(path);
		},


	    RandomBase32(dig)
		{
	        var o = "";
	        for (var i=0;i<dig;i++)
	            o += num2base32[ Math.floor( Math.random()*32 ) ];
	        
	        this.exp_LastRandomBase32 = o;
		    return( o );
		},	   
	    LastRandomBase32()
		{
		    return( this.exp_LastRandomBase32 );
		}	  

    
	};
}