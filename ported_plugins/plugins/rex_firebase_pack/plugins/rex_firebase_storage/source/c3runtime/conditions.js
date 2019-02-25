"use strict";

{
	C3.Plugins.Rex_Firebase_Storage.Cnds =
	{
		OnUploadCompleted()
		{
		    return true;
		}, 	

		OnUploadError()
		{
		    return true;
		},     

		OnUploadCanceled()
		{
		    return true;
		},  

		OnPaused()
		{
		    return true;
		},     

		OnResmue()
		{
		    return true;
		},  	

		IsUploading()
		{
		    return this.isUploading;
		},  

		OnProgress()
		{
		    return true;
		}, 

		OnStart()
		{
		    return true;
		},     
	    
		OnGetDownloadURL()
		{
		    return true;
		}, 	

		OnGetDownloadURLError()
		{
		    return true;
		},     

		FileDoesntExist()
		{
	        return (this.error && (this.error === 'storage/object_not_found'));
		},     
	    
		OnDeleteCompleted()
		{
		    return true;
		}, 	

		OnDeleteError()
		{
		    return true;
		},     
	    
		OnGetMetadata()
		{
		    return true;
		}, 	

		OnGetMetadataError()
		{
		    return true;
		},    
	    
		OnUpdateMetadata()
		{
		    return true;
		}, 	

		OnUpdateMetadataError()
		{
		    return true;
		}    
	};
}