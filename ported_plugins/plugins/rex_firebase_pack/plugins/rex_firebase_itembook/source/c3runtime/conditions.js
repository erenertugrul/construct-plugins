"use strict";

{
	C3.Plugins.Rex_Firebase_ItemBook.Cnds =
	{

	    AddTableNode(name_)
	    {
	        if (this.writeTableID !== null)
	        {
	            alert("ItemBook: nested table is not allowed.");
	            return;
	        }
	        this.writeTableID = name_;
	        this.repeatEvents();
	        this.writeTableID = null;
	        return false;
	    },  

	    AddItemNode(name_)
	    {
	        if (this.writeTableID === null)
	        {
	            alert("ItemBook: itemID should be put in a table.");
	            return;
	        }        
	        if (this.writeItemID !== null)
	        {
	            alert("ItemBook: nested itemID is not allowed.");
	            return;
	        }          
	        
	        this.writeItemID = name_;
	        this.repeatEvents();
	        this.writeItemID = null;
	        return false;
	    },      
	    
	    TreeOnDisconnectedRemove()
	    {
	        var k = getFullKey("", this.writeTableID, this.writeItemID);  
	        var ref = this.get_ref(k);
	        ref["onDisconnect"]()["remove"]();     
	        return true;
	    },     
	    
	    TreeOnDisconnectedCancel()
	    {
	        var k = getFullKey("", this.writeTableID, this.writeItemID);  
	        var ref = this.get_ref(k);
	        ref["onDisconnect"]()["cancel"]();     
	        return true;
	    },       
	    
	    OnUpdateComplete()
	    {
	        return true;
	    }, 
	    OnUpdateError()
	    {
	        return true;
	    },
	    
	    OnRequestComplete(tag_)
	    {
	        return C3.equalsNoCase(tag_, this.trigTag);
	    }, 

	    ForEachItemID(tableID_, sortMode_)
	    {
	        var table = this.readTables[tableID_];
	        if (table == null)
	           return false;

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
	    },  
	    
	    ForEachKey(tableID_, itemID)
	    {
	        var table = this.readTables[tableID_];
	        if (table == null)
	           return false;

	        var item_props = table[itemID];
	        if (item_props == null)
	            return false;
	            
	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event); 
	        
	        var k, o=item_props;
	        for(k in o)
	        {
	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PushCopySol(solmod);            
	            
	            this.exp_CurKey = k;
	            this.exp_CurValue = o[k];
	            current_event.Retrigger(current_frame,h);	            
	            if (solModifierAfterCnds)           
	                this._runtime.GetEventSheetManager().PopSol(solmod);
	                                 
	        }
	        p.Pop();
	        return false;
	    },  

	    TableIsEmpty(tableID_)
	    {
	        var table = this.readTables[tableID_];
	        if (table == null)
	           return true;
	       
	         for (var k in table)
	         {
	             return false;
	         }
	         
	         return true;
	    }
	};
}