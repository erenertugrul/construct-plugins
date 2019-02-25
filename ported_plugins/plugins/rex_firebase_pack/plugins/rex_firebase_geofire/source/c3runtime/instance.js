"use strict";

{
	C3.Plugins.Rex_Firebase_Geofire.Instance = class Rex_Firebase_GeofireInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			    
       		this.exp_LastGeneratedKey = "";
	        this.geoQuery = null;          
	        this.current_items = {};
	        this.exp_LastItemID = "";
	        this.exp_LastLocation = null;      
	        this.exp_LastDistance = 0;        
	        this.exp_CurItemID = ""; 
	        this.exp_CurItemContent = null;  
			
			if (properties)		// note properties may be null in some cases
			{
 				this.rootpath = properties[0] + "/" ;
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
		    var path = this.rootpath + k + "/";
	            
	        return window["Firebase"]["database"]()["ref"](path);
	        
		}  

		getGeo()
		{
	        return new window["GeoFire"](this.get_ref());   
		}      
	    
	    setValue (itemID, location)
		{
	        var self=this;      
	        var onComplete = function ()
	        {
	            self.Trigger(C3.Plugins.Rex_Firebase_Geofire.Cnds.OnUpdateComplete, self);  
	        };
	        
	        var onError= function (error)
	        {
	            self.Trigger(C3.Plugins.Rex_Firebase_Geofire.Cnds.OnUpdateError, self);  
	        };	    
			var geo = this.getGeo();
	        geo["set"](itemID, location)["then"](onComplete, onError);
		}
	    
	    getValue (itemID)
		{
	        var self=this;      
	        var onComplete = function (location)
	        {
	            self.exp_LastItemID = itemID;
	            self.exp_LastLocation = location;
	            self.Trigger(C3.Plugins.Rex_Firebase_Geofire.Cnds.OnGetItemComplete, self);  
	        };
	        
	        var onError= function (error)
	        {
	            self.exp_LastItemID = itemID;            
	            self.Trigger(C3.Plugins.Rex_Firebase_Geofire.Cnds.OnGetItemError, self);  
	        };	    
			var geo = this.getGeo();
	        geo["get"](itemID)["then"](onComplete, onError);
		}
	    
	    
	    queryStart (lat, lng, r)
		{
	        var d = { "center": [lat, lng], "radius": r };
			if (!this.geoQuery)
	        {
	            this.geoQuery = this.getGeo()["query"](d);
	            
	            var trig = C3.Plugins.Rex_Firebase_Geofire.Cnds;            
	            var self = this;
	            var onReady = function ()
	            {
	                self.Trigger(trig.OnReady, self);  
	            };
	            var onEntered = function (itemID, location, distance)
	            {
	                self.exp_LastItemID = itemID;
	                self.exp_LastLocation = location;
	                self.exp_LastDistance = distance;
	                self.current_items[itemID] = [location, distance];
	                self.Trigger(trig.OnItemEntered, self);  
	            };
	            var onExisted = function (itemID, location, distance)
	            {
	                self.exp_LastItemID = itemID;
	                self.exp_LastLocation = location;
	                self.exp_LastDistance = distance;
	                if (self.current_items.hasOwnProperty(itemID))
	                    delete self.current_items[itemID];
	                self.Trigger(trig.OnItemExisted, self);  
	            };            
	            var onMoved = function (itemID, location, distance)
	            {
	                self.exp_LastItemID = itemID;
	                self.exp_LastLocation = location;
	                self.exp_LastDistance = distance;
	                self.current_items[itemID] = [location, distance];
	                self.Trigger(trig.OnItemMoved, self);  
	            };              

	            this.geoQuery.on("ready", onReady);
	            this.geoQuery.on("key_entered", onEntered );        
	            this.geoQuery.on("key_exited", onExisted  );
	            this.geoQuery.on("key_moved", onMoved  );   
	            
	        }
	        else
	            this.geoQuery["updateCriteria"](d);
		} 
	    
	    queryStop ()
		{
	        if (!this.geoQuery)
	            return;
	        
	        this.geoQuery["cancel"]();
	        this.geoQuery = null;
		} 
	    
		ForEachItemID (itemIDList, items)
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
	       

	};
}