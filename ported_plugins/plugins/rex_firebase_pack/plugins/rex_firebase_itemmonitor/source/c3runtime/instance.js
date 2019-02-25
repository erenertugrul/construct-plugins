"use strict";

{
	C3.Plugins.Rex_Firebase_ItemMonitor.Instance = class Rex_Firebase_ItemMonitorInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
	        this.query = null;
	        this.items = {};
	        this.tag2items = {};         
	        this.callbackMap = new window.FirebaseCallbackMapKlass();
	        this.exp_LastItemID = "";
	        this.exp_LastItemContent = null;
	        this.exp_LastPropertyName = "";
	        this.exp_LastValue = null;        
	        this.exp_PrevValue = null;
	        this.exp_CurItemID = "";
	        this.exp_CurItemContent = null;       
	        this.exp_CurKey = "";  
	        this.exp_CurValue = 0;
			
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

	    StartMonitor(query, tag, monitorKey)
		{
		    this.StopMonitor(); 
	        if (this.tag2items.hasOwnProperty(tag)) 
	            return;
	            
		    this.tag2items[tag] = {};
		    var tag2items = this.tag2items[tag];

	        var self = this;
	        var on_add = function (snapshot)
	        {
	            var itemID = get_key(snapshot);            
	            // add itemID into tag2items, indexed by tag
	            tag2items[itemID] = true;  
	            
	            // add item on monitor
	            var itemContent = snapshot["val"]();
	            self.items[itemID] = itemContent;              
	            self.exp_LastItemID = itemID;
	            self.exp_LastItemContent = itemContent;            
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnItemAdded);
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnItemListChanged);                                    
	            self.start_monitor_item(snapshot, monitorKey);
	        };
	        var on_remove = function (snapshot)
	        {
	            var itemID = get_key(snapshot);            
	            // add itemID into tag2items, indexed by tag  
	            delete tag2items[itemID];
	            if (is_empty_table(self.tag2items[tag]))
	                delete self.tag2items[tag];
	                
	            // remove item from monitor
	            delete self.items[itemID];                
	            self.stop_monitor_item(get_refPath(snapshot), monitorKey);                                 
	            self.exp_LastItemID = itemID;  
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnItemRemoved);    
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnItemListChanged);             
	        };
	        this.callbackMap.Add(query, "child_added", "child_added#"+tag, on_add);
	        this.callbackMap.Add(query, "child_removed", "child_removed#"+tag, on_remove);     
		}
		
		RemoveMonitorQuery(query, tag)
		{
	        this.callbackMap.Remove(query, "child_added", "child_added#"+tag);
	        this.callbackMap.Remove(query, "child_removed", "child_removed#"+tag); 
		    this.remove_tag2items(tag);    	    
		}
		
		StopMonitor()
		{
	        if (this.query == null)
	            return;
	        
		    for (var tag in this.tag2items)
		    {
		        this.RemoveMonitorQuery(this.query, tag);
		    }          

	        this.query = null;        
		}
		
	    
	    // read the item once then start monitor
		start_monitor_item(snapshot, tag)
		{
	        if (tag == null)
	            tag = "";
	            
	        var ref = get_refPath(snapshot);
	        var k = get_key(snapshot);
	        var v = snapshot["val"]();
	        
	        // add item into items
	        this.items[k] = v;
	        var monitor_item = this.items[k];
	        
	        // add callback
	        var self = this;
	        var on_prop_added = function (snapshot)
		    {
	            var ck = get_key(snapshot);
	            var cv = snapshot["val"]();
	            if (monitor_item[ck] === cv)
	                return;

	            // run trigger
	            self.exp_LastItemID = k;
	            self.exp_LastPropertyName = ck;
	            self.exp_LastValue = cv;
	            monitor_item[ck] = cv;
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnPropertyAdded);
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnItemListChanged); 
		    };        
	        
	        var on_value_changed = function (snapshot)
		    {
	            var ck = get_key(snapshot);
	            var cv = snapshot["val"]();
	            if (monitor_item[ck] === cv)
	                return;

	            // run trigger
	            self.exp_LastItemID = k;
	            self.exp_LastPropertyName = ck;
	            self.exp_LastValue = cv;
	            
	            if (monitor_item[ck] == null)
	                self.exp_PrevValue = self.exp_LastValue;
	            else
	                self.exp_PrevValue = monitor_item[ck];
	            
	            monitor_item[ck] = cv;
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnAnyValueChnaged);            
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnValueChnaged);
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnItemListChanged); 
		    };

	        var on_prop_removed = function (snapshot)
		    {
	            var ck = get_key(snapshot);
	            if (!monitor_item.hasOwnProperty(ck))
	                return;
	                
	            // run trigger
	            self.exp_LastItemID = k;
	            self.exp_LastPropertyName = ck;
	            delete monitor_item[k];
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnPropertyRemoved); 
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnItemListChanged); 
		    };
		        
	        this.callbackMap.Add(ref, "child_added", "prop_added#"+tag, on_prop_added);
	        this.callbackMap.Add(ref, "child_removed", "prop_removed#"+tag, on_prop_removed);
	        this.callbackMap.Add(ref, "child_moved", "prop_added#"+tag, on_value_changed);
	        this.callbackMap.Add(ref, "child_changed", "prop_removed#"+tag, on_value_changed);      
	        // add callback       
		}   
	    
		stop_monitor_item(ref, tag)
		{
	        this.callbackMap.Remove(ref, "child_added", "prop_added#"+tag);
	        this.callbackMap.Remove(ref, "child_removed", "prop_removed#"+tag);
	        this.callbackMap.Remove(ref, "child_moved", "prop_added#"+tag);
	        this.callbackMap.Remove(ref, "child_changed", "prop_removed#"+tag);             
		}
		
		remove_tag2items(tag)
		{
		    var tag2items = this.tag2items[tag];
		    if (tag2items == null)
		        return;

	        delete this.tag2items[tag];	    
	        for(var itemID in tag2items)
	        {
	            delete this.items[itemID];    
	            this.stop_monitor_item(this.get_ref(itemID), tag);
	            
	            this.exp_LastItemID = itemID;  
	            this.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnItemRemoved); 
	            this.Trigger(C3.Plugins.Rex_Firebase_ItemMonitor.Cnds.OnItemListChanged);             
	        }
		}	
		
		ForEachItemID(itemIDList, items)
		{
	        var current_frame = runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = runtime.GetEventSheetManager().GetEventStack();
	        var p = runtime.GetEventStack(); 
	        var h = c.Push(current_event);
			         
			var i, cnt=itemIDList.length;
			for(i=0; i<cnt; i++)
			{
	            if (solModifierAfterCnds)
	            {
	                runtime.GetEventSheetManager().PushCopySol(solmod);
	            }
	            
	            this.exp_CurItemID = itemIDList[i];
	            this.exp_CurItemContent = items[this.exp_CurItemID]; 
	            current_event.Retrigger(current_frame,h);
	            
			    if (solModifierAfterCnds)
			    {
			       runtime.GetEventSheetManager().PopSol(solmod);
			    }            
			}
	        p.Pop();
	     		
			return false;
		}
	
	};
}