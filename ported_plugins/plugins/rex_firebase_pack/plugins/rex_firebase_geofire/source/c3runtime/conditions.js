"use strict";

{
	C3.Plugins.Rex_Firebase_Geofire.Cnds =
	{
	    OnUpdateComplete()
	    {
	        return true;
	    }, 
	    OnUpdateError()
	    {
	        return true;
	    },    
	    
	    OnGetItemComplete()
	    {
	        return true;
	    }, 
	    OnGetItemError()
	    {
	        return true;
	    },      
	    IsItemNotFound()
	    {
	        return (this.exp_LastLocation == null);
	    },      
	    OnItemEntered()
	    {
	        return true;
	    }, 
	    OnItemExisted()
	    {
	        return true;
	    },        
	    OnItemMoved()
	    {
	        return true;
	    },            
	    OnReady()
	    {
	        return true;
	    },

	    ForEachItemID(sortMode_)
	    {
	        var table = this.current_items;
	        var itemIDList = Object.keys(table);

	        var self = this;        
	        var sortFn = function (valA, valB)
	        {
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
	        };

	        itemIDList.sort(sortFn);
	        return this.ForEachItemID(itemIDList, table);
	    }   
	};
}