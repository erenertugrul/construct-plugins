"use strict";

{
	C3.Plugins.Rex_Firebase.Acts =
	{

	    SetDomainRef(ref)
		{
		    this.rootpath = ref + "/"; 
		}, 	
	    
	      
	    SetValue(k, v, onCompleteCb)
		{
		    var handler = getOnCompleteHandler(this, onCompleteCb);
		    this.getRef(k)["set"](v, handler);
		}, 

	    SetJSON(k, v, onCompleteCb)
		{
		    var handler = getOnCompleteHandler(this, onCompleteCb);	    
		    this.getRef(k)["set"](JSON.parse(v), handler);
		}, 

	    UpdateJSON(k, v, onCompleteCb)
		{
		    var handler = getOnCompleteHandler(this, onCompleteCb);	 	    
		    this.getRef(k)["update"](JSON.parse(v), handler);
		}, 	

	    PushValue(k, v, onCompleteCb)
		{
		    var handler = getOnCompleteHandler(this, onCompleteCb);
		    var ref = this.getRef(k)["push"](v, handler);
			this.lastPushRef = k + "/" +  getKey(ref);
		}, 

	    PushJSON(k, v, onCompleteCb)
		{
		    var handler = getOnCompleteHandler(this, onCompleteCb);	    
		    var ref = this.getRef(k)["push"](JSON.parse(v), handler);
			this.lastPushRef = k + "/" + getKey(ref);
		},
		
	    Transaction(k, onTransactionCb, onCompleteCb)
		{ 
	        var self = this;  

		    var _onComplete = function(error, committed, snapshot) 
		    {
		        self.onTransaction.completedCB = onCompleteCb;    
		        self.error = error; 
	            self.onTransaction.committedValue = snapshot["val"]();
	            
	            var cnds = C3.Plugins.Rex_Firebase.Cnds;            
		        var trig = (error)? cnds.OnTransactionError:
	                           (!committed)? cnds.OnTransactionAbort:
		                           cnds.OnTransactionComplete;
	                               
		        self.Trigger(trig, self); 
		        self.onTransaction.completedCB = null;
	        };
	        
	        var _onTransaction = function(current_value)
	        {
	            self.onTransaction.cb = onTransactionCb;	  
	            self.onTransaction.input = current_value;
	            self.onTransaction.output = null;
	            self.Trigger(C3.Plugins.Rex_Firebase.Cnds.OnTransaction, self); 
	            self.onTransaction.cb = null;
	            
	            if (self.onTransaction.output === null)
	                return;
	            else
	                return self.onTransaction.output;
	        };
		    this.getRef(k)["transaction"](_onTransaction, _onComplete);
		},
		
	    ReturnTransactionValue(v)
		{
		    this.onTransaction.output = v;
		}, 
		
	    ReturnTransactionJSON(v)
		{
		    this.onTransaction.output = JSON.parse(v);
		}, 	
		
	    Remove(k, onCompleteCb)
		{
		    var handler = getOnCompleteHandler(this, onCompleteCb);	    
		    this.getRef(k)["remove"](handler);
		}, 	

	    SetBooleanValue(k, b, onCompleteCb)
		{
		    var handler = getOnCompleteHandler(this, onCompleteCb);
		    this.getRef(k)["set"]((b===1), handler);
		},	
		
	    PushBooleanValue(k, b, onCompleteCb)
		{
		    var handler = getOnCompleteHandler(this, onCompleteCb);
		    var ref = this.getRef(k)["push"]((b===1), handler);
			this.lastPushRef = k + "/" +  getKey(ref);
		}, 	

	    SetServerTimestamp(k, onCompleteCb)
		{
		    var handler = getOnCompleteHandler(this, onCompleteCb);
		    this.getRef(k)["set"](serverTimeStamp(), handler);
		},	
		
	    PushServerTimestamp(k, onCompleteCb)
		{
		    var handler = getOnCompleteHandler(this, onCompleteCb);
		    var ref = this.getRef(k)["push"](serverTimeStamp(), handler);
			this.lastPushRef = k + "/" +  getKey(ref);
		}, 		
	    AddReadingCallback(k, type_, cbName)
		{
		    this.addCallback(this.getRef(k), type_, cbName);                        
		}, 		
		
	    RemoveReadingCallback(k, type_, cbName)
		{
	        var absRef = (k != null)? this.getRef(k)["toString"](): null;
	        var eventType = (type_ != null)? EVENTTYPEMAP[type_]: null;
	        this.callbackMap.Remove(absRef, eventType, cbName);
		},
		
	    AddReadingCallbackOnce(k, type_, cbName)
		{
		    this.addCallbackOnce(this.getRef(k), type_, cbName);                        
		}, 

	    RemoveRefOnDisconnect(k)
		{
		    this.getRef(k)["onDisconnect"]()["remove"]();
		}, 

	    SetValueOnDisconnect(k, v)
		{
		    this.getRef(k)["onDisconnect"]()["set"](v);
		},	

	    UpdateJSONOnDisconnect(k, v)
		{
		    this.getRef(k)["onDisconnect"]()["update"](JSON.parse(v));
		},	

	    CancelOnDisconnect(k)
		{
		    this.getRef(k)["onDisconnect"]()["cancel"]();
		},
		
		

	    AddQueryCallback(queryObjs, type_, cbName)
		{
	        var refObj = get_query(queryObjs);
	        if (refObj == null)
	            return;
	            
	        this.addCallback(refObj, type_, cbName);                        
		},	

	    AddQueryCallbackOnce(queryObjs, type_, cbName)
		{
	        var refObj = get_query(queryObjs);
	        if (refObj == null)
	            return;
	            	    
		   this.addCallbackOnce(refObj, type_, cbName);   
		},

	    GoOffline()
		{
	        // 2.x
	        if (!isFirebase3x())
	        {        
		        window["Firebase"]["goOffline"]();
	        }
	        
	        // 3.x
	        else
	        {
	            window["Firebase"]["database"]()["goOffline"]();
	        }
		},
			
	    GoOnline()
		{
	        // 2.x
	        if (!isFirebase3x())
	        {           
		        window["Firebase"]["goOnline"]();
	            
	        }
	        
	        // 3.x
	        else
	        {
	            window["Firebase"]["database"]()["goOnline"]();
	        }
		}	
	};
}