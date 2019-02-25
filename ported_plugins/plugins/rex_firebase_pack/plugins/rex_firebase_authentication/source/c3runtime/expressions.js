"use strict";

{
	C3.Plugins.Rex_Firebase_Authentication.Exps =
	{
	    ErrorCode()
	    {
	        // 2.x , 3.x
	        var val = (!this.lastError)? "": this.lastError["code"];    
	        return (val || "");
	    }, 
	    
	    ErrorMessage()
	    {
	        // 2.x , 3.x
	        var val = (!this.lastError)? "": this.lastError["message"];    
	        return (val || "");
	    },  
	    
	    UserID()
	    {            
	        return (this.getCurrentUserID() || "");
	    },  
	    Provider()
	    {
	        var pid;
	        // 2.x
	        if (!isFirebase3x())
	        {
	            pid = (!this.lastAuthData)? "": this.lastAuthData["provider"];   
	        }  
	        
	        // 3.x
	        else
	        {
	            pid = getProviderProperty3x("providerId");
	        }  
	        return (pid);
	    },  

	    DisplayName()
	    {
	        var name;
	        // 2.x
	        if (!isFirebase3x())
	        {
	            name = getProviderProperty(this.lastAuthData, "displayName");
	        }  
	        
	        // 3.x
	        else
	        {
	            name = getUserProperty3x("displayName");
	        }
	        return (name || "");
	    },
	    UserIDFromProvider()
	    {
	        var uid;
	        // 2.x
	        if (!isFirebase3x())
	        {
	            uid = getProviderProperty(this.lastAuthData, "id");
	        }  
	        
	        // 3.x
	        else
	        {
	            uid = getProviderProperty3x("uid");
	        }        
	        return (uid || "");
	    },
	    AccessToken()
	    {
	        var token;
	        // 2.x
	        if (!isFirebase3x())
	        {
	            token = getProviderProperty(this.lastAuthData, "accessToken");
	        }  
	        
	        // 3.x
	        else
	        {
	            if (this.lastLoginResult && this.lastLoginResult["credential"])
	                token = this.lastLoginResult["credential"]["accessToken"];
	        }       
	        return (token || "");
	    },      
	    CachedUserProfile()
	    {
	        var profile;
	        // 2.x
	        if (!isFirebase3x())
	        {
	            profile = getProviderProperty(this.lastAuthData, "cachedUserProfile");
	        }  
	        
	        // 3.x
	        else
	        {
	            alert("CachedUserProfile had not implemented in firebase 3.x");
	        }              
	        // ??        
	        return ( profile || "" );
	    },
	    Email()
	    {
	        var email;
	        // 2.x
	        if ((!isFirebase3x()))
	        {
	            email = getProviderProperty(this.lastAuthData, "email");
	        }  
	        
	        // 3.x
	        else
	        {
	            email = getProviderProperty3x("email");
	        }             
	        return (email || "");
	    },      
	    UserName()
	    {
	        var name;
	        // 2.x
	        if (!isFirebase3x())
	        {
	            name = getProviderProperty(this.lastAuthData, "username");
	        }  
	        
	        // 3.x
	        else
	        {
	            name = getUserProperty3x("displayName");            
	        }
	        
	        return (name || "");
	    },
	    ErrorDetail()
	    {
	        // 2.x , 3.x        
	        var val = (!this.lastError)? "": this.lastError["detail"];   
	        if (val == null)
	            val = "";        
	        return (val);
	    }, 
	    PhotoURL()
	    {
	        var photoUrl;
	        // 2.x
	        if (!isFirebase3x())
	        {
	            photoUrl = "";
	        }  
	        
	        // 3.x
	        else
	        {
	            photoUrl = getProviderProperty3x("photoURL");
	        }
	        return (photoUrl || "");
	    }
	};
}