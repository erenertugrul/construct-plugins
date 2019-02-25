"use strict";

{
	C3.Plugins.Rex_Firebase_Storage.Acts =
	{
	 	UploadFromFileChooser(fileChooserObjs, storagePath)
		{
	        if (!fileChooserObjs)
	            return;
	        
	        var fc = fileChooserObjs.GetFirstPicked();

	        if (!fc)
	            return;
	        
	        //assert2( fc.elem, "Firebase storage: input is not a file chooser object.");
	        var files = fc.GetSdkInstance()._files;
	        if (!files)
	            return;
	        
	        var f = files[0];
	        if (!f)
	            return;
	        
	        this.upload(f, storagePath, this.metadata);
	        this.metadata = {};
		}, 
	    
	    CancelUploading()
		{
	        if (!this.uploadTask)
	            return;
	        
	        this.uploadTask["cancel"]();
		}, 
	    
	    PauseUploading()
		{
	        if (!this.uploadTask)
	            return;
	        
	        this.uploadTask["pause"]();
		},     
	    
	    ResumeUploading()
		{
	        if (!this.uploadTask)
	            return;
	        
	        this.uploadTask["resume"]();
		},      
	    
	    UploadFromSprite(objType, storagePath)
		{
			var c = null;
			var im = null;
	        if (!objType)
	            return;
	        	        // canvas to blob
	        var self=this;         
	        var onGetBlob = function (blob)
	        {
	            // upload blob
	            self.upload(blob, storagePath, self.metadata);
	            self.metadata = {};
	        };
	        var inst = objType.GetFirstPicked();
	        if (!inst)
	            return;
	        
	        
	        // get canvas element
	        var canvas;        
	        // sprite
	        if (inst)
	        {
	        	const b = inst.GetCurrentImageInfo();
	        	b && b.ExtractImageToCanvas().then((b) => {
	            	b["toBlob"](onGetBlob);
	        	});
	        }
	        
	        // canvas
	        /*
	        else if (inst.canvas)
	        {
	            canvas = inst.canvas;
	        }


	       // canvas["toBlob"](onGetBlob);   */
		},     
	    


	    UploadDataURI(dataURI, storagePath)
		{
			var self = this;
			var blob = dataURI["startsWith"]('blob');
			if (blob == true){
				var xhr = new XMLHttpRequest(); 
				xhr.open("GET", dataURI); 
				xhr.responseType = "blob";
				function analyze_data(blob)
				{
				    var myReader = new FileReader();
				    myReader.readAsDataURL(blob)
				    
				    myReader.addEventListener("loadend", function(e)
				    {
				        var buffer = e.srcElement.result;
						var base64_link = buffer;
				        var obj = dataURItoBlob(base64_link);
				        var blob = obj[0];
				        var contentType = obj[1];
				        
				        if (!self.metadata.hasOwnProperty("contentType"))
				            self.metadata["contentType"] = contentType;
				        
				        self.upload(blob, storagePath, self.metadata);   
				        self.metadata = {};
				    });
				}

				xhr.onload = function() 
				{
				    analyze_data(xhr.response);
				}
				xhr.send();
			}
		},       
	    
	    UploadString(s, storagePath)
		{
	        var type = "text/plain";
	        var blob = new Blob([s], {"type": type});
	        
	        if (!this.metadata.hasOwnProperty("contentType"))
	            this.metadata["contentType"] = type;
	        
	        this.upload(blob, storagePath, this.metadata);   
	        this.metadata = {};
		},       
	    
	    UploadObjectURL(objectURL, contentType, storagePath)
		{
	        var self=this;
	        var callback = function (blob)
	        {
	            if (contentType !== "")
	                self.metadata["contentType"] = contentType;        
	            
	            self.upload(blob, storagePath, self.metadata); 
	            self.metadata = {};
	        }
	        this.doRequest(objectURL, callback);
		},      
	    
	    GetDownloadURL(storagePath)
		{
	        var self=this;
	        var ref = this.get_storage_ref(storagePath);
	        
	        this.error = null;
	        this.exp_LastDownloadURL = "";
	        var onComplete = function (url)
	        {
	            self.exp_LastDownloadURL = url;
	            self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnGetDownloadURL);
	        };
	        var onError = function (error)
	        {
	            self.error = error;
	            self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnGetDownloadURLError);
	        }
	        ref["getDownloadURL"]()["then"](onComplete)["catch"](onError);
		},     
	    
	    DeleteAtURL(storagePath)
		{
	        var self=this;
	        var ref = this.get_storage_ref(storagePath);
	        
	        this.error = null;
	        var onComplete = function ()
	        {
	            self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnDeleteCompleted);
	        };
	        var onError = function (error)
	        {
	            self.error = error;
	            self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnDeleteError);
	        }
	        ref["delete"]()["then"](onComplete)["catch"](onError);
		},
	        
	    GetMetadata(storagePath)
		{
	        var self=this;
	        var ref = this.get_storage_ref(storagePath);
	        
	        this.error = null;
	        this.exp_LastMetadata = null;
	        var onComplete = function (metadata)
	        {
	            self.exp_LastMetadata = metadata;
	            self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnGetMetadata);
	        };
	        var onError = function (error)
	        {
	            self.error = error;
	            self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnGetMetadataError);
	        }
	        ref["getMetadata"]()["then"](onComplete)["catch"](onError);
		},
	        
	    UpdateMetadata(storagePath)
		{
	        var self=this;
	        var ref = this.get_storage_ref(storagePath);
	        
	        this.error = null;
	        this.exp_LastMetadata = null;
	        var onComplete = function (metadata)
	        {
	            self.exp_LastMetadata = metadata;
	            self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnUpdateMetadata);
	        };
	        var onError = function (error)
	        {
	            self.error = error;
	            self.Trigger(C3.Plugins.Rex_Firebase_Storage.Cnds.OnUpdateMetadataError);
	        }
	        ref["updateMetadata"](this.metadata)["then"](onComplete)["catch"](onError);
	        this.metadata = {};
		},
	    
	    MetadataSetValue(k, v)
		{
	        setValue(k, v, this.metadata);
	        this.metadata
		},    
	        
	    MetadataLoadJSON(s)
		{
	        this.metadata = JSON.parse(s);
		},  
	    
	    MetadataRemoveKey(k)
		{
	        setValue(k, null, this.metadata);
	        this.metadata
		} 
	    
	};
}