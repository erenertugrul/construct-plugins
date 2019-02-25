"use strict";

{
	C3.Plugins.Rex_Firebase_Token.Instance = class Rex_Firebase_TokenInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			(function ()
			{
			    if (window.SuspendMgrKlass != null)
			        return;
			        
			    var SuspendMgrKlass = function(runtime)
			    {
			        this.objects = [];
			        this.addSuspendCallback(runtime);  
			    };
			    var SuspendMgrKlassProto = SuspendMgrKlass.prototype;
			    
				SuspendMgrKlassProto.addSuspendCallback = function(runtime)
				{
			        if (C3.Plugins.Rex_Waker)
			            return;
			            
			        var self = this;
			        var on_suspended = function (s)
			        {   
			            var i, cnt=self.objects.length, inst;
						if (s)
						{			    			    
						    // suspended
						    for (i=0; i<cnt; i++)
						    {			
						        inst = self.objects[i];     
						        if (inst.OnSuspend)
						            inst.OnSuspend();	    
						    }
						}
						else
						{
						    // resume
						    for (i=0; i<cnt; i++)
						    {			
						        inst = self.objects[i];     
						        if (inst.OnResume)
						            inst.OnResume();	    
						    }	  
						}
			        }
					//todo runtime.addSuspendCallback(on_suspended);      
				}; 
				    
				SuspendMgrKlassProto.push = function(inst)
				{
			        this.objects.push(inst);
				}; 
				
				SuspendMgrKlassProto.remove = function(inst)
				{
				    C3.arrayFindRemove(this.objects, inst);
				};
				
				window.SuspendMgrKlass = SuspendMgrKlass;
			}());
	     	(function ()
			{
			    C3.Plugins.Rex_Firebase_Token.TokenKlass = function(plugin)
			    {        
			        // export
			        this.OnTokenOwnerChanged = null;
			        this.OnGetToken = null;
			        this.OnReleaseToken = null;
			        
			        // export
			        this.plugin = plugin;
					this.myID = "";
			        this.ownerID = "";
			        this.my_ref = null;
			        this.on_owner_changed = null;
			    };
			    var TokenKlassProto = C3.Plugins.Rex_Firebase_Token.TokenKlass.prototype;
			    
				TokenKlassProto.IsInGroup = function()
				{
				    return (this.my_ref != null);
				}; 
				
				TokenKlassProto.IsOwner = function()
				{
				    return (this.myID == this.ownerID);
				};
				
				TokenKlassProto.ListenOwner = function()
				{
				    if (this.on_owner_changed)
				        return;
				        
				    var candidates_ref = this.plugin.get_ref();
				    var self = this;
				    var on_owner_changed = function(snapshot)
				    {
				        self.ownerID = snapshot["val"]();
				        if (self.OnTokenOwnerChanged)
				            self.OnTokenOwnerChanged();	  
				                      	            
				        if (self.IsOwner() && self.OnGetToken)
				            self.OnGetToken();	 
				            
				        if (!self.IsOwner() && self.OnReleaseToken)
				            self.OnReleaseToken();	 	            
				                       
				    };	    
				    candidates_ref["limitToFirst"](1)["on"]("child_added", on_owner_changed);
				    this.on_owner_changed = on_owner_changed;
				};	
				
			    TokenKlassProto.JoinGroup = function (UserID)
				{	   	    
				    if (this.IsInGroup())
				        this.LeaveGroup();
				    
				    if (UserID != null)
				        this.myID = UserID;
				    if (this.myID === "")
				        return;	  
				        
				    var self = this;
				    var on_complete = function (error)
				    {
				        if (error)
				            return;
				        
				        self.ListenOwner();
				    };      

				    var candidates_ref = this.plugin.get_ref();	    
			        this.my_ref = candidates_ref["push"]();
			        this.my_ref["onDisconnect"]()["remove"]();
			        this.my_ref["set"](this.myID, on_complete);              
				};
				
			    TokenKlassProto.LeaveGroup = function ()
				{
				    if (!this.IsInGroup())
				        return;
			  
			        var candidates_ref = this.plugin.get_ref();
				    candidates_ref["off"]("child_added", this.on_owner_changed);
				    this.my_ref["remove"]();
				    this.my_ref["onDisconnect"]()["cancel"]();        
				    this.my_ref = null;      
				    this.on_owner_changed = null;
				};
			}());      
			this.token = new C3.Plugins.Rex_Firebase_Token.TokenKlass(this);
			
			var self = this;
	        var on_tokenOwner_changed = function ()
	        {
	            self.Trigger(C3.Plugins.Rex_Firebase_Token.Cnds.OnTokenOwnerChanged);
	        };
	        var on_get_token = function ()
	        {
	            self.Trigger(C3.Plugins.Rex_Firebase_Token.Cnds.OnGetToken);
	        };  
	        var on_release_token = function ()
	        {
	            self.Trigger(C3.Plugins.Rex_Firebase_Token.Cnds.OnReleaseToken);
	        };          
	        this.token.OnTokenOwnerChanged = on_tokenOwner_changed;
	        this.token.OnGetToken = on_get_token;    
	        this.token.OnReleaseToken = on_release_token;            
	                
	                
	        if (window.SuspendMgr == null)   
	        {
	            window.SuspendMgr = new window.SuspendMgrKlass(this._runtime);            
	        }
	        window.SuspendMgr.push(this);
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
	    
	    JoinGroup(UserID)
		{	   	 
		    this.token.JoinGroup(UserID);   
		}
		
	    LeaveGroup()
		{
		    this.token.LeaveGroup();    
		}
   		OnSuspend()
   		{
   			this.LeaveGroup();
   		}
   		OnResume()
   		{
   			this.JoinGroup();
   		}
	};
}