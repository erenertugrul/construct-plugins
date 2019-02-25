"use strict";

{
	C3.Plugins.Rex_Firebase_Authentication.Cnds =
	{
	    EmailPassword_OnCreateAccountSuccessful()
	    {
	        return true;
	    },  

	    EmailPassword_OnCreateAccountError()
	    {
	        return true;
	    }, 
	    
	    EmailPassword_OnChangingPasswordSuccessful()
	    {
	        return true;
	    },  

	    EmailPassword_OnChangingPasswordError()
	    {
	        return true;
	    },  
	    
	    EmailPassword_OnSendPasswordResetEmailSuccessful()
	    {
	        return true;
	    },  

	    EmailPassword_OnSendPasswordResetEmailError()
	    {
	        return true;
	    },  
	    
	    EmailPassword_OnDeleteUserSuccessful()
	    {
	        return true;
	    },  

	    EmailPassword_OnDeleteUserError()
	    {
	        return true;
	    },  
	    
	    EmailPassword_OnUpdatingProfileSuccessful()
	    {
	        return true;
	    },  

	    EmailPassword_OnUpdatingProfileError()
	    {
	        return true;
	    }, 
	    
	    EmailPassword_OnUpdatingEmailSuccessful()
	    {
	        return true;
	    },  

	    EmailPassword_OnUpdatingEmailError()
	    {
	        return true;
	    }, 
	    
	    EmailPassword_OnSendVerificationEmailSuccessful()
	    {
	        return true;
	    },  

	    EmailPassword_OnSendVerificationEmailError()
	    {
	        return true;
	    }, 


	    IsAnonymous()
	    {
	        var val;
	        if (!isFirebase3x())
	        {
	            var user = this.lastAuthData;
	            if (user)            
	                val = (user["provider"] === "anonymous");            
	            else
	                val = false;
	        }
	        else
	        {
	            var user = getAuthObj()["currentUser"];
	            val = user && user["isAnonymous"];
	        }
	        
	        return val;
	    },
	    
	    OnLoginSuccessful()
	    {
	        return true;
	    },  

	    OnLoginError()
	    {
	        return true;
	    },  

	    OnLoggedOut()
	    {
	        return true;
	    },      

	    IsLogin()
	    {
	        if (!isFirebase3x())
	            return (this.lastAuthData != null);
	        else
	            return (getAuthObj()["currentUser"] != null);
	    },  
	    
	    OnLoginByOther()
	    {
	        return true;
	    },  
	    
	    OnLoggedOutByOther()
	    {
	        return true;
	    },   
	    
	    OnLinkSuccessful()
	    {
	        return true;
	    },  
	    
	    OnLinkError()
	    {
	        return true;
	    }

    
	};
}