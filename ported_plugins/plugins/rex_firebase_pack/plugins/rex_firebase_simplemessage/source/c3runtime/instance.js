"use strict";

{
	C3.Plugins.Rex_Firebase_SimpleMessage.Instance = class Rex_Firebase_SimpleMessageInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
	        this.userID = "";
	        this.userName = "";
	        
	        // check outPort changing
	        this.lastReceiverID = null;

			
			if (properties)		// note properties may be null in some cases
			{
	         	this.rootpath = properties[0] + "/" + properties[1] + "/";
	        	var message_type = properties[2];
	        	this.offline_mode = properties[3];
			}
	        var messageKlass = (this.offline_mode == OFFLMSG_DISCARD)? window.FirebaseSimpleMessageKlass: window.FirebaseStackMessageKlass;        
            this.inBox = this.create_inBox(messageKlass, message_type);
            this.outPort = new messageKlass(message_type);
        
        	this.exp_LastMessage = null;    
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

		
	    create_inBox(messageKlass, message_type)
		{    
		    var self = this;
		    var on_received = function(d)
		    {
		        self.exp_LastMessage = d;
	            var trig = C3.Plugins.Rex_Firebase_SimpleMessage.Cnds.OnReceivedMessage;
	            self.Trigger(trig); 
		    };

		    var simple_message = new messageKlass(message_type);
		    simple_message.onReceived = on_received;
	        
	        return simple_message;
	    }
	    
	    send_message(receiverID, message)
		{  
	        if ((receiverID == null) || (receiverID == ""))
	            return;
	        
	        // re-build outPort
		    if (this.lastReceiverID != receiverID)
		    {
	            var ref = this.get_ref(receiverID);
		        this.outPort.SetRef(ref);
		    }
		    
		    if (message == null)
		    {
		        // clean message
		        this.outPort.Send();  
		    }
		    else
		    {
		        this.outPort.Send(message, this.userID, this.userName);    
		    }
		  
	    }
	};
}