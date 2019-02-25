"use strict";

{
	C3.Plugins.Rex_Firebase_message.Instance = class Rex_Firebase_messageInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
		

	        
	        this.userID = "";
	        this.userName = "";

	        this.inBox = this.create_messageBox();
	        this.newMsgRecv = this.create_newMessageReceived();
	                
	        this.exp_LastMessage = null;
	        this.exp_CurMsg = null;
	        this.exp_CurMsgIndex = -1;  
			if (properties)		// note properties may be null in some cases
			{
	 		    this.rootpath = properties[0] + "/" + properties[1] + "/";
		        this.message_type = properties[2];
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
		create_messageBox()
		{
		    var inBox = new window.FirebaseItemListKlass();
		    
		    inBox.updateMode = inBox.AUTOCHILDUPDATE;
		    inBox.keyItemID = "messageID";
		    
		    var self = this;	    
		    var on_update = function()
		    {
		        self.Trigger(C3.Plugins.Rex_Firebase_message.Cnds.OnUpdate); 
		    };	    
	        inBox.onItemAdd = on_update;
	        inBox.onItemRemove = on_update;
	        inBox.onItemChange = on_update;
	        
		    var onGetIterItem = function(item, i)
		    {
		        self.exp_CurMsg = item;
		        self.exp_CurMsgIndex = i;
		    };
		    inBox.onGetIterItem = onGetIterItem; 
		           
	        return inBox;
	    }	
	    
		create_newMessageReceived()
		{
		    var newMsgRecv = new window.FirebaseItemListKlass();
		    
		    newMsgRecv.updateMode = newMsgRecv.AUTOCHILDUPDATE;
		    newMsgRecv.keyItemID = "messageID";
	        newMsgRecv.extra.startAt = "";

		    var self = this;	    
		    var on_add = function(item)
		    {	                
	            if (item["messageID"] < newMsgRecv.extra.startAt)
	                return;
		        self.exp_LastMessage = item;
		        self.Trigger(C3.Plugins.Rex_Firebase_message.Cnds.OnNewMessage); 
		    }; 
	        newMsgRecv.onItemAdd = on_add;

	        return newMsgRecv;
	    }	    	
	    
		get_ref(k)
		{
		    if (k == null)
		        k = "";
		        
		    var path;
		    if (k.substring(0,8) == "https://")
		        path = k;
		    else
		        path = this.rootpath + k + "/";
		        
	        return new window["Firebase"](path);
		}
		
		get_inbox_ref(userID)
		{
	        if (userID == null)
	            userID = this.userID;
	            
	        var ref = this.get_ref();        
		    return ref["orderByChild"]("receiverID")["equalTo"](userID);
		}	
		
		get_sent_ref(userID)
		{
	        if (userID == null)
	            userID = this.userID;
	            
	        var ref = this.get_ref();
		    return ref["orderByChild"]("senderID")["equalTo"](userID);
		}			
		
	    start_update()
		{
		    var query = this.get_inbox_ref(this.userID);
		    this.inBox.StartUpdate(query);
		    
	        this.newMsgRecv.extra.startAt = this.get_ref()["push"]()["key"]();
		    var query = this.get_inbox_ref(this.userID)["limitToLast"](1);
		    this.newMsgRecv.StartUpdate(query);	   
		}
	 
	    stop_update()
		{ 
		    this.inBox.StopUpdate();
		    this.newMsgRecv.StopUpdate();
		}

	    send(receiverID, title_, content_)
		{
	        // prepare header      
		    var header = {
	            "senderID": this.userID,
	            "senderName": this.userName,
	            "receiverID": receiverID,
	            "title" : title_,
	            "sentAt": window["Firebase"]["ServerValue"]["TIMESTAMP"]
		    };
	        // send header
	        var ref = this.get_ref("headers")["push"](header);                
	        var messageID = ref["key"]();
	        
	        // prepare body
	        if (this.messageType == MESSAGE_JSON)
	            content_ = JSON.parse(content_); 
	        this.get_ref("bodies")["child"](messageID)["set"](content_);      
		}  

	};
}