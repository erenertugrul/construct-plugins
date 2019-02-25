"use strict";
// query
var LIMITTYPE = ["limitToFirst", "limitToLast"];
var COMPARSION_TYPE = ["equalTo", "startAt", "endAt", "startAt", "endAt"];
{
	C3.Plugins.Rex_Firebase_ItemBook.Acts =
	{
	    SetSubDomainRef(ref)
	    {
	        this.rootpath = ref + "/";
	        this.readTables = {};
	    },      
	    TreeSetValue(k_, v_)
	    {
	        this.TreeSetValue(k_, v_);
	    },     

	    TreeSetBooleanValue(k_, v_)
	    {
	        this.TreeSetValue(k_, (v_ === 1));
	    },   

	    TreeSetNullValue(k_)
	    {
	        this.TreeSetValue(k_, null);
	    },   

	    TreeCleanAll()
	    {
	        this.setValue(this.writeTableID, this.writeItemID, null, null);
	    },   
	    
	    TreeSetServerTimestamp(k_)
	    {
	        this.TreeSetValue(k_, window["Firebase"]["database"]["ServerValue"]);
	    },       
	    
	    TreeSetJSON(k_, v_)
	    {
	        v_ = JSON.parse(v_);
	        this.TreeSetValue(k_, v_);
	    },       

	    UpdateBook()
	    {        
	        var self=this;      
	        var handler = function(error) 
	        {
	            var trig = (error)? C3.Plugins.Rex_Firebase_ItemBook.Cnds.OnUpdateError:
	                                        C3.Plugins.Rex_Firebase_ItemBook.Cnds.OnUpdateComplete;
	            self.Trigger(trig, self);  
	        };
	        var ref = this.get_ref();
	        
	        if (isCleanBook(this.writeItems))
	        {
	            ref["parent"]["set"](null, handler);
	        }
	        else
	        {
	            ref["update"](this.writeItems, handler);
	        }
	        this.writeItems = {};
	    },      
	    
	    EnumSetValue(tableID_, itemID_, k_, v_)
	    {
	        this.EnumSetValue(tableID_, itemID_, k_, v_);
	    },     

	    EnumSetBooleanValue(tableID_, itemID_, k_, v_)
	    {
	        this.EnumSetValue(tableID_, itemID_, k_, (v_ === 1));
	    },   

	    EnumSetNullValue(tableID_, itemID_, k_)
	    {
	        if (tableID_ === "")
	            this.setValue(null, null, null, null);
	        else if (itemID_ === "")
	            this.setValue(tableID_, null, null, null);
	        else if (k_ === "")
	            this.setValue(tableID_, itemID_, null, null);   
	        else
	            this.setValue(tableID_, itemID_, k_, null);
	    },   
	    
	    EnumSetServerTimestamp(tableID_, itemID_, k_)
	    {
	        this.EnumSetValue(tableID_, itemID_, k_, window["Firebase"]["database"]["ServerValue"]);
	    },       
	    
	    EnumSetJSON(tableID_, itemID_, k_, v_)
	    {
	        v_ = JSON.parse(v_);
	        this.EnumSetValue(tableID_, itemID_, k_, v_);
	    },      
	    TreeOnDisconnectedCancel(k_)
	    {
	        var k = getFullKey("", this.writeTableID, this.writeItemID, k_);  
	        var ref = this.get_ref(k);
	        ref["onDisconnect"]()["cancel"]();      
	    },        
	   
	    TreeOnDisconnectedSetServerTimestamp(k_)
	    {
	        var k = getFullKey("", this.writeTableID, this.writeItemID, k_);  
	        var ref = this.get_ref(k);
	        ref["onDisconnect"]()["set"](window["Firebase"]["database"]["ServerValue"]);        
	    },     
	   
	    TreeOnDisconnectedSetValue(k_, v_)
	    {
	        var k = getFullKey("", this.writeTableID, this.writeItemID, k_);  
	        var ref = this.get_ref(k);
	        ref["onDisconnect"]()["set"](v_);       
	    },     
	   
	    TreeOnDisconnectedSetBooleanValue(k_, v_)
	    {
	        var k = getFullKey("", this.writeTableID, this.writeItemID, k_);  
	        var ref = this.get_ref(k);
	        ref["onDisconnect"]()["set"](v_===1);       
	    }, 
	    
	    TreeOnDisconnectedSetJSON(k_, v_)
	    {
	        var k = getFullKey("", this.writeTableID, this.writeItemID, k_);  
	        var ref = this.get_ref(k);
	        v_ = JSON.parse(v_);
	        ref["onDisconnect"]()["set"](v_);       
	    },   
	    
	    EnumOnDisconnectedRemove(tableID_, itemID_, k_)
	    {
	        var k = getFullKey("", tableID_, itemID_, k_);  
	        var ref = this.get_ref(k);
	        ref["onDisconnect"]()["remove"]();      
	    },       
	   
	    EnumOnDisconnectedSetServerTimestamp(tableID_, itemID_, k_)
	    {
	        var k = getFullKey("", tableID_, itemID_, k_);  
	        var ref = this.get_ref(k);
	        ref["onDisconnect"]()["set"](window["Firebase"]["database"]["ServerValue"]);        
	    },    
	   
	    EnumOnDisconnectedSetValue(tableID_, itemID_, k_, v_)
	    {
	        var k = getFullKey("", tableID_, itemID_, k_);  
	        var ref = this.get_ref(k);
	        ref["onDisconnect"]()["set"](v_);       
	    },    
	   
	    EnumOnDisconnectedSetBooleanValue(tableID_, itemID_, k_, v_)
	    {
	        var k = getFullKey("", tableID_, itemID_, k_);  
	        var ref = this.get_ref(k);
	        ref["onDisconnect"]()["set"](v_ === 1);     
	    },    
	   
	    EnumOnDisconnectedSetJSON(tableID_, itemID_, k_, v_)
	    {        
	        var k = getFullKey("", tableID_, itemID_, k_);  
	        var ref = this.get_ref(k);
	        v_ = JSON.parse(v_);
	        ref["onDisconnect"]()["set"](v_);       
	    },        
	    
	    EnumOnDisconnectedCancel(tableID_, itemID_, k_)
	    {
	        var k = getFullKey("", tableID_, itemID_, k_);  
	        var ref = this.get_ref(k);
	        ref["onDisconnect"]()["cancel"]();      
	    },
	    

	    GetItemsBySingleConditionInRange(tableID_, key_, start, end, limit_type, limit_count, tag_)
	    {  
	        var self=this;
	        var onReqDone = this.onRequestComplete;
	        var onRead = function (snapshot)
	        {
	            if (!self.readTables.hasOwnProperty(tableID_))
	                self.readTables[tableID_] = {};
	            var table = self.readTables[tableID_];
	            var items = snapshot["val"]() || {};
	            for (var k in items)
	                table[k] = items[k];
	            
	            self.exp_LastTableID = tableID_;                  
	            self.trigTag = tag_;
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemBook.Cnds.OnRequestComplete, self);       
	            self.trigTag = null;
	            
	            if (onReqDone)
	                onReqDone();
	        };     
	                
	        var query = this.get_ref()["child"](tableID_);
	        query = query["orderByChild"](key_);
	        query = query["startAt"](start)["endAt"](end);
	        if (limit_count > 0)
	            query = query[LIMITTYPE[limit_type]](limit_count);
	        
	        var qf = function()
	        {
	            query["once"]("value", onRead);
	        }
	        if (!onReqDone)
	            qf();
	        else
	            this.addToRequestQueue(qf);
	    },  
	    
	    
	    GetItemsBySingleCondition(tableID_, key_, comparsion_type, value_, limit_type, limit_count, tag_)
	    {  
	        var self=this;
	        var onReqDone = this.onRequestComplete;     
	        var onRead = function (snapshot)
	        {
	            if (!self.readTables.hasOwnProperty(tableID_))
	                self.readTables[tableID_] = {};            
	            var table = self.readTables[tableID_];
	            var items = snapshot["val"]() || {};
	            for (var k in items)
	                table[k] = items[k];
	            
	            self.exp_LastTableID = tableID_;              
	            self.trigTag = tag_;
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemBook.Cnds.OnRequestComplete, self);       
	            self.trigTag = null;
	            
	            if (onReqDone)
	                onReqDone();
	        };         
	                
	        var query = this.get_ref()["child"](tableID_);    
	        query = query["orderByChild"](key_);        
	        query = query[COMPARSION_TYPE[comparsion_type]](value_);
	        if (limit_count > 0)        
	            query = query[LIMITTYPE[limit_type]](limit_count);

	        var qf = function()
	        {
	            query["once"]("value", onRead);
	        }
	        if (!onReqDone)
	            qf();
	        else
	            this.addToRequestQueue(qf);        
	    },    

	    LoadItem(tableID_, itemID_, tag_)
	    { 
	        if (tableID_ === "")
	            itemID_ = "";   
	        
	        var self=this;
	        var onReqDone = this.onRequestComplete;   
	        var onRead = function (snapshot)
	        {            
	            var o =  snapshot["val"]() || {};
	            if (tableID_ === "")
	            {
	                self.readTables = o;  
	            }
	            else if (itemID_ === "")
	            {
	                self.readTables[tableID_] = o ;
	            }
	            else
	            {
	                if (!self.readTables.hasOwnProperty(tableID_))
	                    self.readTables[tableID_] = {};
	                self.readTables[tableID_][itemID_] = o;
	            }   
	            self.exp_LastTableID = tableID_;   
	            self.exp_LastItemID = itemID_;               
	            self.trigTag = tag_;
	            self.Trigger(C3.Plugins.Rex_Firebase_ItemBook.Cnds.OnRequestComplete, self);       
	            self.trigTag = null;
	            
	            if (onReqDone)
	                onReqDone();            
	        };         
	        
	     
	        var query = this.get_ref();       
	        if (tableID_ !== "")        
	            query = query["child"](tableID_);
	        if (itemID_ !== "")
	            query = query["child"](itemID_);
	                
	        var qf = function()
	        {
	            query["once"]("value", onRead);
	        }
	        if (!onReqDone)
	            qf();
	        else
	            this.addToRequestQueue(qf);            
	    },
	    
	    
	    StartQueue(tag_)
	    {
	        this.queueMode = true;
	        this.requestQueue.length = 0;  
	        
	        var self=this;
	        var queueCnt=0;
	        this.addToRequestQueue = function (qf)
	        {
	            this.requestQueue.push(qf);
	            queueCnt += 1;
	        }
	        this.onRequestComplete = function ()
	        {
	            queueCnt -= 1;
	            if (queueCnt === 0)
	            {
	                self.trigTag = tag_;
	                self.Trigger(C3.Plugins.Rex_Firebase_ItemBook.Cnds.OnRequestComplete, self);       
	                self.trigTag = null;
	                self.onRequestComplete = null;
	            }
	        }
	    },    
	    ProcessQueue()
	    {
	        for (var i in this.requestQueue)
	            this.requestQueue[i]();
	        
	        this.queueMode = false;
	    },

	    CleanResultTable(tableID_)
	    {
	        if (tableID_ === "")
	            this.readTables = {};
	        else if (this.readTables.hasOwnProperty(tableID_))
	            delete this.readTables[tableID_];
	            
	    },    
	   
	    
	    SetConvertKeyName(keyTableID_, keyItemID_)
	    {
	        this.convertKeyTableID = keyTableID_;
	        this.convertKeyItemID = keyItemID_;        
	    }    
	};
}