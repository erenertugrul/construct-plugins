"use strict";

{
	C3.Plugins.Rex_Firebase_ItemBook.Instance = class Rex_Firebase_ItemBookInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
	        this.exp_LastGeneratedKey = "";
	        this.exp_LastRandomBase32 = "";             
	        this.writeItems = {};
	        this.writeTableID = null;
	        this.writeItemID = null;

	        this.readTables = {};
	        this.queueMode = false;
	        this.requestQueue = [];
	        this.onRequestComplete = null;  
	        this.addToRequestQueue = null;        
	        this.exp_LastTableID = "";         
	        this.exp_LastItemID = "";
	   
	        this.trigTag = null;
	        
	        
	        this.exp_CurItemID = ""; 
	        this.exp_CurItemContent = null;   
	        this.exp_CurKey = "";  
	        this.exp_CurValue = 0;        
	        
	        this.convertKeyTableID = "tableID";
	        this.convertKeyItemID = "itemID";
			
			if (properties)		// note properties may be null in some cases
			{
 				this.rootpath = properties[0] + "/"; 
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
            "lk": this.exp_LastGeneratedKey,
            "lr": this.exp_LastRandomBase32,
			};
		}
		
		LoadFromJson(o)
		{
   	 		this.exp_LastGeneratedKey = o["lk"];
        	this.exp_LastRandomBase32 = o["lr"]; 
		}
		
		get_ref(k)
		{
	        if (k == null)
		        k = "";
		    var path = this.rootpath + k + "/";
	            
	        return window["Firebase"]["database"]()["ref"](path);
	        
		}      
	    
		repeatEvents()
		{
	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event);  
			
	        if (solModifierAfterCnds)
	            this._runtime.GetEventSheetManager().PushCopySol(solmod);
	        
	        current_event.Retrigger(current_frame,h);
	        
	        if (solModifierAfterCnds)
	            this._runtime.GetEventSheetManager().PopSol(solmod);
	        p.Pop();          
		}    


		setValue(tableID_, itemID_, k_, v_)
		{                
	        // update tables
	        k_ = getFullKey("", tableID_, itemID_, k_);
	        this.writeItems[k_] = v_;         
		}      
	    
	    TreeSetValue(k_, v_)
		{
	        if ((this.writeTableID === null) || (this.writeItemID === null))
	        {
	            alert("ItemBook: key-value must be assigned under table and item.");
	            return;
	        }        
	        this.setValue(this.writeTableID, this.writeItemID, k_, v_);
		}     
	    
	    EnumSetValue(tableID_, itemID_, k_, v_)
		{
	        if ((tableID_ === "") || (itemID_ === ""))
	        {
	            alert("ItemBook: key-value must be assigned under table and item.");
	            return;
	        }        
	        this.setValue(tableID_, itemID_, k_, v_);
		}          

		ForEachItemID(itemIDList, items)
		{
	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event); 
			         
			var i, cnt=itemIDList.length;
			for(i=0; i<cnt; i++)
			{
	            if (solModifierAfterCnds)            
	                this._runtime.GetEventSheetManager().PushCopySol(solmod);           
	            
	            this.exp_CurItemID = itemIDList[i];
	            this.exp_CurItemContent = items[this.exp_CurItemID]; 
	            current_event.Retrigger(current_frame,h);
	            
			    if (solModifierAfterCnds)		    
			        this._runtime.GetEventSheetManager().PopSol(solmod);
	            	   
			}
			p.Pop();
	     		
			return false;
		} 
	        
		ConvertItem(item, tableID_, itemID_)
		{
	        item[this.convertKeyTableID] = tableID_;        
	        item[this.convertKeyItemID] = itemID_;
	        return item;
		}

		RevertItem(item)
		{
	        delete item[this.convertKeyTableID];
	        delete item[this.convertKeyItemID];        
		}    

	};
}