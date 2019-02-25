"use strict";
 var ARGS_COPY = [];
 	var get_itemID_path = function(itemID)
	{
	    return "itemIDs/" + itemID;
	};
	var get_itemID2Keys_path = function(itemID, key_)
	{
	    var p = "itemID-keys/" + itemID;
		if (key_)
		    p += "/" + key_;
        return p;
	};
    var get_key = function (obj)
    {       
        return (!isFirebase3x())?  obj["key"]() : obj["key"];
    };
    
    // 2.x , 3.x    
	var isFirebase3x = function()
	{ 
        return (window["FirebaseV3x"] === true);
    };
    
    var isFullPath = function (p)
    {
        return (p.substring(0,8) === "https://");
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
    
	var get_key_path = function(itemID, key_)
	{
	    return "filters/" + key_ + "/" + itemID;
	};	 
	
	var retrieve_itemIDs = function (table_in, arr_out)
	{
        var itemID;
        arr_out.length = 0;
        for (itemID in table_in)
        {
            arr_out.push(itemID);
        }
	};
    
    var string_quote = function(v)
    {
        var s;
        if (typeof (v) == "string")
            s = '"'+v+'"';
        else // number
            s = v.toString();
        return s
    }; 

    var array_copy = function (arr_out, arr_in, start_index)
    {
        if (start_index == null)
            start_index = 0
            
        var i, cnt=arr_in.length;
        arr_out.length = cnt - start_index;        
        for(i=start_index; i<cnt; i++)
            arr_out[i-start_index] = arr_in[i];
    };  
//////////////////////////
    var FilterKlass = function(plugin)
    {
        this.plugin = plugin;
        
        this.wait_events = 0;
        this.on_complete = null;
        this.current_groupUid = 0;
        this.groups = {};
        this.set_expression = "";
    };
    var FilterKlassProto = FilterKlass.prototype;
    
	FilterKlassProto.isDone_test = function(on_complete)
	{    
	    this.wait_events -= 1;
        if (this.wait_events > 0)
            return;
            
        // all jobs done 
        var result_group = this.DoSetOperation(this.set_expression);        
              
	    if (on_complete != null)	        
			on_complete(result_group);	    
	};  

    FilterKlassProto.NewGroupUID = function()
    {
        var current_group_uid = this.current_groupUid.toString();
        this.groups[current_group_uid] = {};
        this.current_groupUid += 1;
        return current_group_uid;
    };
    
    // picking cnditions
    // export
    FilterKlassProto["Query"] = function (query_typeName, key_, value0, value1)
    {
        // read handler
        var current_group_uid = this.NewGroupUID();
        var read_result = this.groups[current_group_uid];
        
        var self = this;
        var read_item = function(childSnapshot)
        {
            var k = get_key(childSnapshot);
            var v = childSnapshot["val"]();
            read_result[k] = v;
        };     
        var on_read = function (snapshot)
        {
            snapshot["forEach"](read_item);
            self.isDone_test(self.on_complete);
        };
        
        // create query
        this.wait_events += 1;
        var query = this.plugin.get_ref("filters")["child"](key_);        
        query = query["orderByValue"]();
        query = this[query_typeName](query, value0, value1);
        query["once"]("value", on_read);
        
        var code_string = '(filter.groups["'+current_group_uid+'"])';
        return code_string;
    };
    // export 
    
    FilterKlassProto["Equal"] = function (query, value_)
    {
        return query["equalTo"](value_);
    };
    FilterKlassProto["GreaterEqual"] = function (query, value_)
    {
        return query["startAt"](value_);
    };  
    FilterKlassProto["LessEqual"] = function (query, value_)
    {
        return query["endAt"](value_);
    };    
    FilterKlassProto["InRange"] = function (query, value0, value1)
    {
        return query["startAt"](value0)["endAt"](value1);
    };     
    // picking cnditions
    
    // set operations    
    // export    
    var params = [];
    FilterKlassProto["AddSETOP"] = function (operation_name)
    {
        var i,cnt=arguments.length;
        for (i=1; i<cnt; i++)
            params.push(arguments[i]);
        operation_name = '"'+operation_name+'"';
        // TODO
        var code_string = 'filter["SET"]('+operation_name+","+params.join(",")+")";
        return code_string;
    };
    // export     
    
    FilterKlassProto["SET"] = function (operation_name)
    {   
        // arguments are group_uids
        var i, cnt=arguments.length;
        var groupA=arguments[1], groupB;
        var itemID;
        
        for (i=2; i<cnt; i++)
        {
            groupB = arguments[i];
            this[operation_name](groupA, groupB);
        }
        return groupA;        
    };
    FilterKlassProto["OR"] = function (setA, setB)
    {
        var k;
        for (k in setB)
            setA[k] = true;      
    };
    FilterKlassProto["AND"] = function (setA, setB)
    {
        var k;
        for (k in setA)
        {
            if (!setB.hasOwnProperty(k))
                delete setA[k];
        }   
    };    
    FilterKlassProto["SUB"] = function (setA, setB)
    {
        var k;
        for (k in setB)
        {
            if (setA.hasOwnProperty(k))
                delete setA[k];
        }   
    };     
    FilterKlassProto["SUB_VALUE"] = function (setA, value_)
    {
        var k;
        for (k in setA)
        {
            if (setA[k] == value_)
                delete setA[k];
        }   
    };     
    // set operations
    
    // code string to handler
    FilterKlassProto.DoRequest = function (condition_expression, on_complete)
    {
        this.current_groupUid = 0;
        this.wait_events = 0;
        
        this.on_complete = on_complete;      
        var code_string = "function(filter){\n return "+condition_expression +";\n}";
        var request;        
        try
        {
            request = eval("("+code_string+")");
        }
        catch(err)
        {
            request = null;
        }
        this.set_expression = request(this);
    };
    
    FilterKlassProto.DoSetOperation = function (set_expression)
    {
        var code_string = "function(filter){\n return "+set_expression +";\n}";
        var handler;
        try
        {
            handler = eval("("+code_string+")");
        }
        catch(err)
        {
            handler = null;
        }
        var result_groupUid = handler(this); 
        return result_groupUid;   
    };
    // code string to handler    
    
{
	C3.Plugins.Rex_Firebase_ItemFilter = class Rex_Firebase_ItemFilterPlugin extends C3.SDKPluginBase
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