"use strict";
var OFFLMSG_DISCARD = 0;
var OFFLMSG_PEND = 1;
	var isFirebase3x = function()
	{ 
        return (window["FirebaseV3x"] === true);
    };
    
    var isFullPath = function (p)
    {
        return (p.substring(0,8) === "https://");
    };
	    
    var get_key = function (obj)
    {       
        return (!isFirebase3x())?  obj["key"]() : obj["key"];
    };
    
    var get_root = function (obj)
    {       
        return (!isFirebase3x())?  obj["root"]() : obj["root"];
    };
    // 2.x , 3.x  
	
(function ()
{
    // 2.x , 3.x    
	var isFirebase3x = function()
	{ 
        return (window["FirebaseV3x"] === true);
    };
    var get_refPath = function (obj)
    {       
        return (!isFirebase3x())?  obj["ref"]() : obj["ref"];
    };    
    // 2.x , 3.x  
    
    if (window.FirebaseStackMessageKlass != null)
        return;    
    
    var MESSAGE_STRING = 0;
    var MESSAGE_JSON = 1;
    var StackMessageKlass = function (messageType)
    {
        // export
        this.onReceived = null
        // export
                
        this.messageType = messageType;
        
        // internal
        this.ref = null;
        this.on_read = null;        
    };
    
    var StackMessageKlassProto = StackMessageKlass.prototype;    

    StackMessageKlassProto.SetRef = function (ref)
    {
        var is_reading = (this.on_read != null);
        this.StopUpdate();
        this.ref = ref;
        if (is_reading)
            this.StartUpdate();
    }; 
    
    StackMessageKlassProto.Send = function (message, senderID, senderName)
    {
        if (this.ref == null)
            return;
            
        
        // clean message
        if ((message == null) && (senderID == null) && (senderName == null))
        {
            // do nothing  
            return;
        }
        
        if (this.messageType == MESSAGE_JSON)
            message = JSON.parse(message); 
        
        var d = {
            "message": message,
            "senderID": senderID,
            "senderName": senderName,
        };     
        this.ref["push"](d);
    };    
    
    StackMessageKlassProto.StartUpdate = function (ref)
	{
        this.StopUpdate();
        if (ref != null)
            this.ref = ref; 
        
        var self = this;
	    var on_update = function (snapshot)
	    {     
	        var d = snapshot["val"]();
            if (self.skip_first)
            {
                self.skip_first = false;
                return;
            }
            if (d == null)
                return;


            if (self.messageType == MESSAGE_JSON)
                d["message"] = JSON.stringify(d["message"]);
            
            if (self.onReceived)
                self.onReceived(d);
                
            // remove this child
            get_refPath(snapshot)["remove"]();
        };

        this.ref["limitToFirst"](1)["on"]("child_added", on_update);        
        this.on_read = on_update;
    };

    StackMessageKlassProto.StopUpdate = function ()
	{
        if (this.on_read == null)
            return;

        this.ref["off"]("child_added", this.on_read);
        this.on_read = null; 
    };  
        	
	window.FirebaseStackMessageKlass = StackMessageKlass;
}());     

(function ()
{
    if (window.FirebaseSimpleMessageKlass != null)
        return;    
    
    var MESSAGE_STRING = 0;
    var MESSAGE_JSON = 1;
    var SimpleMessageKlass = function (messageType)
    {
        // export
        this.onReceived = null
        // export
                
        this.messageType = messageType;
        
        // internal
        this.skip_first = true;
        this.stamp = false;
        this.ref = null;
        this.on_read = null;        
    };
    
    var SimpleMessageKlassProto = SimpleMessageKlass.prototype;    

    SimpleMessageKlassProto.SetRef = function (ref)
    {
        var is_reading = (this.on_read != null);
        this.StopUpdate();
        this.ref = ref;
        if (is_reading)
            this.StartUpdate();
    }; 
    
    SimpleMessageKlassProto.Send = function (message, senderID, senderName)
    {
        if (this.ref == null)
            return;
            
        
        // clean message
        if ((message == null) && (senderID == null) && (senderName == null))
        {
            this.ref["remove"]();       
            return;
        }
        
        if (this.messageType == MESSAGE_JSON)
            message = JSON.parse(message); 
        
        var d = {
            "message": message,
            "senderID": senderID,
            "senderName": senderName,
            "stamp" : this.stamp,
        };
        this.skip_first = false;        
        this.ref["set"](d);        
        this.stamp = !this.stamp;
    };    
    
    SimpleMessageKlassProto.StartUpdate = function (ref)
	{
        this.StopUpdate();
        if (ref != null)
            this.ref = ref; 
        
        this.skip_first = true;      // skip previous message
        
        var self = this;
	    var on_update = function (snapshot)
	    {     
	        var d = snapshot["val"]();
            if (self.skip_first)
            {
                self.skip_first = false;
                return;
            }
            if (d == null)
                return;


            if (self.messageType == MESSAGE_JSON)
                d["message"] = JSON.stringify(d["message"]);
            
            if (self.onReceived)
                self.onReceived(d);
        };

        this.ref["on"]("value", on_update);        
        this.on_read = on_update;
        this.ref["onDisconnect"]()["remove"]();
    };

    SimpleMessageKlassProto.StopUpdate = function ()
	{
        if (this.on_read == null)
            return;

        this.ref["off"]("value", this.on_read);
        this.on_read = null;             
        
        this.ref["remove"]();
        this.ref["onDisconnect"]()["cancel"]();
    };  
        	
	window.FirebaseSimpleMessageKlass = SimpleMessageKlass;
}());  
{
	C3.Plugins.Rex_Firebase_SimpleMessage = class Rex_Firebase_SimpleMessagePlugin extends C3.SDKPluginBase
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