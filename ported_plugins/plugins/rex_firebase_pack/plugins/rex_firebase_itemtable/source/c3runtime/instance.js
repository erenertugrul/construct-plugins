"use strict";

{
	C3.Plugins.Rex_Firebase_ItemTable.Instance = class Rex_Firebase_ItemTableInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
		
	        this.save_item = {};
	        this.disconnectRemove_absRefs = {};        
	        this.load_request_itemIDs = {};
	        this.load_items = {};   
	        this.load_items_cnt = null;
	        this.trig_tag = null;    
	        this.exp_CurItemID = ""; 
	        this.exp_CurItemContent = null;   
	        this.exp_CurKey = "";  
	        this.exp_CurValue = 0;
	        this.exp_LastItemID = ""; 
	        this.exp_LastGeneratedKey = "";
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
		clean_load_items ()
		{		
	        clean_table( this.load_items );   	    
	        this.load_items_cnt = null;
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
	            {
			            this._runtime.GetEventSheetManager().PushCopySol(solmod);
	            }
	            
	            this.exp_CurItemID = itemIDList[i];
	            this.exp_CurItemContent = items[this.exp_CurItemID]; 
		    	current_event.Retrigger(current_frame,h);
	            
			    if (solModifierAfterCnds)
			    {
		            this._runtime.GetEventSheetManager().PopSol(solmod);
			    }            
			}
			p.Pop();
	     		
			return false;
		}  
		
	    Save(itemID, save_item, set_mode, tag_)
		{	 
		    if (itemID === "")
		    {
		        var ref = this.get_ref()["push"]();
		   	    itemID = get_key(ref);
		    }
		    else
		    {
		        var ref = this.get_ref(itemID);	
		    }
		    
		    var self = this;	
		    var on_save = function (error)
		    {
			    var trig = (!error)? C3.Plugins.Rex_Firebase_ItemTable.Cnds.OnSaveComplete:
			                         C3.Plugins.Rex_Firebase_ItemTable.Cnds.OnSaveError;
	            self.trig_tag = tag_;	
	            self.exp_CurItemID = itemID;	                         
			    self.Trigger(trig); 	   
			    self.trig_tag = null;
			    self.exp_CurItemID = "";
		    };

		    this.exp_LastItemID = itemID;	    
		    var is_empty = is_empty_table(save_item);
		    var save_data = (is_empty)? true: save_item;
		    
		    var op = (set_mode == 1)? "set":"update";	    
		    ref[op](save_data, on_save);
		}
		
	    Remove(itemID, tag_)
		{
		    var self = this;	
		    var on_remove = function (error)
		    {
			    var trig = (!error)? C3.Plugins.Rex_Firebase_ItemTable.Cnds.OnRemoveComplete:
			                         C3.Plugins.Rex_Firebase_ItemTable.Cnds.OnRemoveError;
	            self.trig_tag = tag_;	
	            self.exp_CurItemID = itemID;	                         
			    self.Trigger(trig); 	   
			    self.trig_tag = null;
			    self.exp_CurItemID = "";
		    };  
		    this.get_ref(itemID)["remove"](on_remove);
		}
				
	    At(itemID, key_, default_value)
		{
		    var v;
	        if (!this.load_items.hasOwnProperty(itemID))
	            v = null;
	        else
	            v = this.load_items[itemID][key_];
	        
	        v = din(v, default_value);
			return v;
		}
		
	    CancelOnDisconnected ()
		{
		    for(var r in this.disconnectRemove_absRefs)
		    {
		        this.get_ref(r)["onDisconnect"]()["cancel"]();
		        delete this.disconnectRemove_absRefs[r];
		    }
		}			
	    
	};
}