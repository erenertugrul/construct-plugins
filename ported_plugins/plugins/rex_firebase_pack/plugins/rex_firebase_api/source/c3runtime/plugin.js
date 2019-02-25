"use strict";
    
    var get_key = function (obj)
    {       
        return (!isFirebase3x())?  obj["key"]() : obj["key"];
    };
    
    var get_refPath = function (obj)
    {       
        return (!isFirebase3x())?  obj["ref"]() : obj["ref"];
    };    
    
    var get_root = function (obj)
    {       
        return (!isFirebase3x())?  obj["root"]() : obj["root"];
    };
    
    var serverTimeStamp = function ()
    {       
        if (!isFirebase3x())
            return window["Firebase"]["ServerValue"]["TIMESTAMP"];
        else
            return window["Firebase"]["database"]["ServerValue"];
    };       

    var get_timestamp = function (obj)    
    {       
        return (!isFirebase3x())?  obj : obj["TIMESTAMP"];
    };    
    // 2.x , 3.x      


    // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
    var __afterInitialHandler = [];
    var addAfterInitialHandler = function(callback)
    {
        if (__afterInitialHandler === null)
            callback()
        else
            __afterInitialHandler.push(callback);
    };
    var runAfterInitializeHandlers = function()
    {
        var i, cnt=__afterInitialHandler.length;
        for(i=0; i<cnt; i++)
        {
            __afterInitialHandler[i]();
        }
        __afterInitialHandler = null;
    };
    window.FirebaseAddAfterInitializeHandler = addAfterInitialHandler;

    
    var ItemListKlass = function ()
    {
        // -----------------------------------------------------------------------
        // export: overwrite these values
        this.updateMode = 1;                  // AUTOCHILDUPDATE
        this.keyItemID = "__itemID__";
        
        // custom snapshot2Item function
        this.snapshot2Item = null;
        
        // auto child update, to get one item
        this.onItemAdd = null;
        this.onItemRemove = null;
        this.onItemChange = null;
        
        // manual update or
        // auto all update, to get all items
        this.onItemsFetch = null;
        
        // used in ForEachItem
        this.onGetIterItem = null;  
        
        this.extra = {};
        // export: overwrite these values
        // -----------------------------------------------------------------------        
        
        // -----------------------------------------------------------------------        
        // internal
        this.query = null;
        this.items = [];
        this.itemID2Index = {}; 
                
        // saved callbacks
        this.add_child_handler = null;
        this.remove_child_handler = null;
        this.change_child_handler = null;
        this.items_fetch_handler = null;        
        // internal       
        // -----------------------------------------------------------------------        
    };
    
    var ItemListKlassProto = ItemListKlass.prototype;
    
    ItemListKlassProto.MANUALUPDATE = 0;
    ItemListKlassProto.AUTOCHILDUPDATE = 1;
    ItemListKlassProto.AUTOALLUPDATE = 2;    
    
    // --------------------------------------------------------------------------
    // export
    ItemListKlassProto.GetItems = function ()
    {
        return this.items;
    };
    
    ItemListKlassProto.GetItemIndexByID = function (itemID)
    {
        return this.itemID2Index[itemID];
    };     
    
    ItemListKlassProto.GetItemByID = function (itemID)
    {
        var i = this.GetItemIndexByID(itemID);
        if (i == null)
            return null;
            
        return this.items[i];
    };  
    
    ItemListKlassProto.Clean = function ()
    {
        this.items.length = 0;
        clean_table(this.itemID2Index); 
    };        
    
    ItemListKlassProto.StartUpdate = function (query)
    {
        this.StopUpdate();            
        this.Clean();        
  
        if (this.updateMode === this.MANUALUPDATE)
            this.manual_update(query);
        else if (this.updateMode === this.AUTOCHILDUPDATE)        
            this.auto_child_update_start(query);        
        else if (this.updateMode === this.AUTOALLUPDATE)   
            this.auto_all_update_start(query);    
    };
    
    ItemListKlassProto.StopUpdate = function ()
    {
        if (this.updateMode === this.AUTOCHILDUPDATE)        
            this.auto_child_update_stop();        
        else if (this.updateMode === this.AUTOALLUPDATE)   
            this.auto_all_update_stop();
    };  
    
    ItemListKlassProto.ForEachItem = function (runtime, start, end)
    {        
        if ((start == null) || (start < 0))
            start = 0; 
        if ((end == null) || (end > this.items.length - 1))
            end = this.items.length - 1;

        var current_frame = runtime.GetEventSheetManager().GetCurrentEventStackFrame();
        var current_event = current_frame.GetCurrentEvent();
        var solmod = current_event.GetSolModifiers();
        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
        var c = runtime.GetEventSheetManager().GetEventStack();
        var p = runtime.GetEventStack(); 
        var h = c.Push(current_event);
                 
        var i;
        for(i=start; i<=end; i++)
        {
            if (solModifierAfterCnds)
            {
                runtime.GetEventSheetManager().PushCopySol(solmod);
            }
            
            if (this.onGetIterItem)
                this.onGetIterItem(this.items[i], i);
            current_event.Retrigger(current_frame,h);
            
            if (solModifierAfterCnds)
            {
                runtime.GetEventSheetManager().PopSol(solmod);
                
            }            
        }
        p.Pop();
            
        return false;
    };            
    // export
    // --------------------------------------------------------------------------    
    
    // --------------------------------------------------------------------------
    // internal   
    ItemListKlassProto.add_item = function(snapshot, prevName, force_push)
    {
        var item;
        if (this.snapshot2Item)
            item = this.snapshot2Item(snapshot);
        else
        {
            var k = get_key(snapshot);
            item = snapshot["val"]();
            item[this.keyItemID] = k;
        }
        
        if (force_push === true)
        {
            this.items.push(item);
            return;
        }        
            
        if (prevName == null)
        {
            this.items.unshift(item);
        }
        else
        {
            var i = this.itemID2Index[prevName];
            if (i == this.items.length-1)
                this.items.push(item);
            else
                this.items.splice(i+1, 0, item);
        }
        
        return item;
    };
    
    ItemListKlassProto.remove_item = function(snapshot)
    {
        var k = get_key(snapshot);
        var i = this.itemID2Index[k];    
        var item = this.items[i];
        C3.arrayRemove(this.items, i);
        return item;
    };    

    ItemListKlassProto.update_itemID2Index = function()
    {
        clean_table(this.itemID2Index);
        var i,cnt = this.items.length;
        for (i=0; i<cnt; i++)
        {
            this.itemID2Index[this.items[i][this.keyItemID]] = i;
        }   
    };
    
    ItemListKlassProto.manual_update = function(query)
    {
        var self=this;
        var read_item = function(childSnapshot)
        {
            self.add_item(childSnapshot, null, true);
        };            
        var handler = function (snapshot)
        {           
            snapshot["forEach"](read_item);                
            self.update_itemID2Index();   
            if (self.onItemsFetch)
                self.onItemsFetch(self.items)
        };
      
        query["once"]("value", handler);    
    };
    
    ItemListKlassProto.auto_child_update_start = function(query)
    {
        var self = this;         
        var add_child_handler = function (newSnapshot, prevName)
        {
            var item = self.add_item(newSnapshot, prevName);
            self.update_itemID2Index();
            if (self.onItemAdd)
                self.onItemAdd(item);
        };
        var remove_child_handler = function (snapshot)
        {
            var item = self.remove_item(snapshot);
            self.update_itemID2Index();
            if (self.onItemRemove)
                self.onItemRemove(item);
        };                  
        var change_child_handler = function (snapshot, prevName)
        {
            var item = self.remove_item(snapshot);
            self.update_itemID2Index();
            self.add_item(snapshot, prevName);
            self.update_itemID2Index();
            if (self.onItemChange)
                self.onItemChange(item); 
        };
        
        this.query = query;
        this.add_child_handler = add_child_handler;
        this.remove_child_handler = remove_child_handler;
        this.change_child_handler = change_child_handler;
        
        query["on"]("child_added", add_child_handler);
        query["on"]("child_removed", remove_child_handler);
        query["on"]("child_moved", change_child_handler);
        query["on"]("child_changed", change_child_handler);             
    };
    
    ItemListKlassProto.auto_child_update_stop = function ()
    {
        if (!this.query)
            return;
        
        this.query["off"]("child_added", this.add_child_handler);
        this.query["off"]("child_removed", this.remove_child_handler);
        this.query["off"]("child_moved", this.change_child_handler);
        this.query["off"]("child_changed", this.change_child_handler);
        this.add_child_handler = null;
        this.remove_child_handler = null;
        this.change_child_handler = null;   
        this.query = null;
    };      

    ItemListKlassProto.auto_all_update_start = function(query)
    {
        var self=this;
        var read_item = function(childSnapshot)
        {
            self.add_item(childSnapshot, null, true);
        };            
        var items_fetch_handler = function (snapshot)
        {           
            self.Clean();
            snapshot["forEach"](read_item);                
            self.update_itemID2Index();   
            if (self.onItemsFetch)
                self.onItemsFetch(self.items)
        };
        
        this.query = query;
        this.items_fetch_handler = items_fetch_handler;
        
        query["on"]("value", items_fetch_handler);    
    };
    
    ItemListKlassProto.auto_all_update_stop = function ()
    {
        if (!this.query)
            return;
        
        this.query["off"]("value", this.items_fetch_handler);
        this.items_fetch_handler = null;
        this.query = null;
    };        
    
    var clean_table = function (o)
    {
        var k;
        for (k in o)
            delete o[k];
    };
    // internal 
    // --------------------------------------------------------------------------   
    window.FirebaseItemListKlass = ItemListKlass;

    // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------    
    // --------------------------------------------------------------------------
    var CallbackMapKlass = function ()
    {
        this.map = {};
    };
    
    var CallbackMapKlassProto = CallbackMapKlass.prototype;

    CallbackMapKlassProto.Reset = function(k)
    {
        for (var k in this.map)
            delete this.map[k];
    }; 

    CallbackMapKlassProto.get_callback = function(absRef, eventType, cbName)
    {
        if (!this.IsExisted(absRef, eventType, cbName))
            return null;
    
        return this.map[absRef][eventType][cbName];
    };

    CallbackMapKlassProto.IsExisted = function (absRef, eventType, cbName)
    {
        if (!this.map.hasOwnProperty(absRef))
            return false;
        
        if (!eventType)  // don't check event type
            return true;
         
        var eventMap = this.map[absRef];
        if (!eventMap.hasOwnProperty(eventType))
            return false;
            
        if (!cbName)  // don't check callback name
            return true;
                                    
        var cbMap = eventMap[eventType];
        if (!cbMap.hasOwnProperty(cbName))
            return false;
        
        return true;     
    };
    
    CallbackMapKlassProto.Add = function(query, eventType, cbName, cb)
    {
        var absRef = query["toString"]();
        if (this.IsExisted(absRef, eventType, cbName))
            return;
                    
        if (!this.map.hasOwnProperty(absRef))
            this.map[absRef] = {};
        
        var eventMap = this.map[absRef];
        if (!eventMap.hasOwnProperty(eventType))
            eventMap[eventType] = {};

        var cbMap = eventMap[eventType];
        cbMap[cbName] = cb;
        
        query["on"](eventType, cb);         
    };
       
    CallbackMapKlassProto.Remove = function(absRef, eventType, cbName)
    {
        if ((absRef != null) && (typeof(absRef) == "object"))
            absRef = absRef["toString"]();
            
        if (absRef && eventType && cbName)
        {
            var cb = this.get_callback(absRef, eventType, cbName);
            if (cb == null)
                return;                
            get_ref(absRef)["off"](eventType, cb);  
            delete this.map[absRef][eventType][cbName];
        }
        else if (absRef && eventType && !cbName)
        {
            var eventMap = this.map[absRef];
            if (!eventMap)
                return;
            var cbMap = eventMap[eventType];
            if (!cbMap)
                return;
            get_ref(absRef)["off"](eventType); 
            delete this.map[absRef][eventType];
        }
        else if (absRef && !eventType && !cbName)
        {
            var eventMap = this.map[absRef];
            if (!eventMap)
                return;
            get_ref(absRef)["off"](); 
            delete this.map[absRef];
        }  
        else if (!absRef && !eventType && !cbName)
        {
            for (var r in this.map)
            {
                get_ref(r)["off"](); 
                delete this.map[r];
            } 
        }  
    }; 
    
    CallbackMapKlassProto.RemoveAllCB = function(absRef)
    {
        if (absRef)
        {
            var eventMap = this.map[absRef];
            for (var e in eventMap)
            {
                var cbMap = eventMap[e];
                for (var cbName in cbMap)
                {
                    get_ref(absRef)["off"](e, cbMap[cbName]);  
                }
            }
            
            delete this.map[absRef];
        }
        else if (!absRef)
        {
            for (var r in this.map)
            {
                var eventMap = this.map[r];
                for (var e in eventMap)
                {
                    var cbMap = eventMap[e];
                    for (var cbName in cbMap)
                    {
                        get_ref(r)["off"](e, cbMap[cbName]);  
                    }
                }
                
                delete this.map[r];
            }
        }       
    };  
    
    CallbackMapKlassProto.getDebuggerValues = function (propsections)
    {
        var r, eventMap, e, cbMap, cn, display;
        for (r in this.map)
        {
            eventMap = this.map[r];
            for (e in eventMap)
            {
                cbMap = eventMap[e];
                for (cn in cbMap)
                {
                    display = cn+":"+e+"-"+r;
                    propsections.push({"name": display, "value": ""});
                }
            }
        }
    };
    
    CallbackMapKlassProto.GetRefMap = function ()
    {
        return this.map;
    };    
    
    window.FirebaseCallbackMapKlass = CallbackMapKlass;
    

    var getValueByKeyPath = function (item, k, default_value)
    {  
        var v;
        if (item == null)
            v = null;
        
        // invalid key    
        else if ((k == null) || (k === ""))
            v = item;
        
        // key but no object
        else if (typeof(item) !== "object")
            v = null;
        
        // only one key
        else if (k.indexOf(".") === -1)
            v = item[k];
        else
        {
            v = item;              
            var keys = k.split(".");
            var i, cnt=keys.length;
            for(i=0; i<cnt; i++)
            {
                v = v[ keys[i] ];
                if (v == null)
                    break;
            }
        }
        
        return din(v, default_value);
    }    
    
    var din = function (d, default_value)
    {       
        var o;
        if (d === true)
            o = 1;
        else if (d === false)
            o = 0;
        else if (d == null)
        {
            if (default_value != null)
                o = default_value;
            else
                o = 0;
        }
        else if (typeof(d) == "object")
            o = JSON.stringify(d);
        else
            o = d;
        return o;
    };    
    
    window.FirebaseGetValueByKeyPath = getValueByKeyPath;     
{
	C3.Plugins.Rex_FirebaseAPI = class Rex_FirebaseAPIPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}