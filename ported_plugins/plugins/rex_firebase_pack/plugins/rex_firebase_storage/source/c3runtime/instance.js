"use strict";

{
	C3.Plugins.Rex_Firebase_Storage.Instance = class Rex_Firebase_StorageInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
		
				    
	        this.uploadTask = null;
	        this.metadata = {};
	        this.snapshot = null;
	        this.isUploading = false;
	        this.error = null;
	        this.exp_LastDownloadURL = "";
	        this.exp_LastMetadata = null
			if (properties)		// note properties may be null in some cases
			{
 				this.rootpath = properties[0] + "/";
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
		get_storage_ref(k)
		{
	        if (k == null)
		        k = "";
		    var path = this.rootpath + k + "/";
	        return window["Firebase"]["storage"]()["ref"](path);
		}     
	    
	    upload(file, path, metadata)
	    {
	        if (this.uploadTask)
	            this.uploadTask["cancel"]();
	        
	        var self=this;
	        this.isUploading = null;
	        this.snapshot = null;
	        this.error = null;              
	        this.exp_LastDownloadURL = "";
	        
	        var onComplete = function ()
	        {
	            self.isUploading = false;
	            self.snapshot = self.uploadTask["snapshot"];
	            self.exp_LastDownloadURL = self.snapshot["downloadURL"];
	            self.exp_LastMetadata = self.snapshot["metadata"];
	            self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnUploadCompleted);
	        };
	        var onError = function (error)
	        {
	            self.isUploading = false;
	            self.error = error;
	            switch (error["code"]) 
	            {
	            case 'storage/unauthorized':
	                self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnUploadError);
	                break;
	            
	            case 'storage/canceled':
	                self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnUploadCanceled);            
	                break;
	                
	            case 'storage/unknown':
	                self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnUploadError);
	                break;
	                
	            default:
	                self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnUploadError);
	                break;            
	            }
	        };
	        var onStateChanged = function (snapshot)
	        {
	            self.snapshot = self.uploadTask["snapshot"];            
	            var isRunning = (snapshot["state"] === 'running');
	            if (isRunning && (self.isUploading === null))
	                self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnStart);                 
	            else if (isRunning && !self.isUploading)
	                self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnResmue); 
	            else if (!isRunning && self.isUploading)
	                self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnPaused);
	                        
	            self.isUploading = isRunning;
	            
	            self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnProgress);
	        };
	        
	        this.exp_LastMetadata = metadata;
	        this.uploadTask = this.get_storage_ref(path)["put"](file, metadata);
	        this.uploadTask["on"]('state_changed', onStateChanged, onError, onComplete);   
	    }
	    
	    	
		doRequest( url_, callback )
		{
		    var oReq;
		    
			// Windows Phone 8 can't AJAX local files using the standards-based API, but
			// can if we use the old-school ActiveXObject. So use ActiveX on WP8 only.
			/*if (this.runtime.isWindowsPhone8)
				oReq = new ActiveXObject("Microsoft.XMLHTTP");
			else*/
			oReq = new XMLHttpRequest();
				
	        oReq.open("GET", url_, true);
	        oReq.responseType = "arraybuffer";
	        
	        oReq.onload = function (oEvent) 
	        {
	            callback(oReq.response);
	        };
	        
	        oReq.send(null);
		}	 

	};
}