"use strict";

{
	C3.Plugins.Rex_Firebase.Instance = class Rex_FirebaseInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
		        

			// push
			this.lastPushRef = "";
			// transaction
			this.onTransaction = {};
	        this.onTransaction.cb = null;
	        this.onTransaction.input = null;
	        this.onTransaction.output = null;
	        // transaction completed
	        this.onTransaction.completedCB = null;
	        this.onTransaction.committedValue = null;        
	        // on complete
	        this.onCompleteCb = null;
	        this.error = null;
	        // reading
	        /*
	        if (!this.recycled)
	            this.callbackMap = new window.FirebaseCallbackMapKlass();
	        else
	            this.callbackMap.Reset();
	        */      
	        this.callbackMap = new window.FirebaseCallbackMapKlass();        
	        this.onReadCb = null;
	        this.snapshot = null;
			this.prevChildName = null;
	        this.exp_LastGeneratedKey = "";   
	        this.exp_ServerTimeOffset = 0;        
	        this.isConnected = false;
	        			
			if (properties)		// note properties may be null in some cases
			{
 				this.rootpath = properties[0] + "/";
	        var self=this;
	        var setupFn = function ()
	        {
	            if (properties[1] === 1)
	                self.connectionDetectingStart();
	            
	            if (properties[2] === 1)
	                self.serverTimeOffsetDetectingStart();
	        }
			}
	        

	        window.FirebaseAddAfterInitializeHandler(setupFn); 

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
		getRef(k)
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
	    addCallback(query, type_, cbName)
		{
		    var eventType = EVENTTYPEMAP[type_];	
		    var self = this;   
	        var reading_handler = function (snapshot, prevChildName)
	        {
	            self.onReadCb = cbName;   
	            self.snapshot = snapshot;
				self.prevChildName = prevChildName;
	               self.Trigger(C3.Plugins.Rex_Firebase.Cnds.OnReading, self); 
	            self.onReadCb = null;            
	        };

	        this.callbackMap.Add(query, eventType, cbName, reading_handler);
		} 	
		
	    addCallbackOnce(refObj, type_, cb)
		{
		    var eventType = EVENTTYPEMAP[type_];	    

		    var self = this;   
	        var reading_handler = function (snapshot, prevChildName)
	        {
	            self.onReadCb = cb;   
	            self.snapshot = snapshot;
	            self.prevChildName = prevChildName;
	               self.Trigger(C3.Plugins.Rex_Firebase.Cnds.OnReading, self); 
	            self.onReadCb = null; 
	        };
		    refObj["once"](eventType, reading_handler);                         
		} 
	    
		connectionDetectingStart()
		{
	        var self = this;
	        var onValueChanged = function (snap)
	        {
	            var trig;                   
	            var isConnected = !!snap["val"]();
	            if ( isConnected )            
	                trig = C3.Plugins.Rex_Firebase.Cnds.OnConnected;        
	            else if (self.isConnected && !isConnected)   // disconnected after connected
	                trig = C3.Plugins.Rex_Firebase.Cnds.OnDisconnected;
	            
	            self.isConnected = isConnected;
	            
	               self.Trigger(trig, self); 
	        };
	        
	        var p = getRoot(this.getRef()) + "/.info/connected"; 
	        var ref = this.getRef(p);
	        ref.on("value", onValueChanged);
		}   
	    
		serverTimeOffsetDetectingStart()
		{
	        var self = this;
	        var onValueChanged = function (snap)
	        {
	            self.exp_ServerTimeOffset = snap["val"]() || 0;
	        };
	        
	        var p = getRoot(this.getRef()) + "/.info/serverTimeOffset"; 
	        var ref = this.getRef(p);
	        ref.on("value", onValueChanged);
		}   
	};
}