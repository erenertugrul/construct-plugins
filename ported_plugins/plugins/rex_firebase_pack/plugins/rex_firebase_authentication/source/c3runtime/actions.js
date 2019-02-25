"use strict";

{
	C3.Plugins.Rex_Firebase_Authentication.Acts =
	{
	    EmailPassword_CreateAccount(e_, p_)
	    {
	        // 2.x
	        if (!isFirebase3x())
	        {
	            var reg_data = {"email":e_,  "password":p_ };
	            var handler = getHandler2x(this,
	                                         C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnCreateAccountSuccessful,
	                                         C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnCreateAccountError);
	            this.get_ref()["createUser"](reg_data, handler);
	        }
	        
	        // 3.x
	        else
	        {
	            var authObj = getAuthObj()["createUserWithEmailAndPassword"](e_, p_);
	            addHandler(this, authObj, 
	                              C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnCreateAccountSuccessful,
	                              C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnCreateAccountError
	                              );
	        }
	    }, 

	    EmailPassword_Login(e_, p_, r_)
	    {
	        // 2.x
	        if (!isFirebase3x())
	        {        
	            var reg_data = {"email":e_,  "password":p_ };
	            var handler = getLoginHandler2x(this);
	            var d = {"remember":PRESISTING_TYPE[r_]};
	            this.get_ref()["authWithPassword"](reg_data, handler, d);
	        }
	        
	        // 3.x
	        else
	        {
	            var authObj = getAuthObj();
	            addLoginHandler(this, authObj["signInWithEmailAndPassword"](e_, p_));            
	        }            
	    },  
	    
	    EmailPassword_ChangePassword(e_, old_p_, new_p_)
	    {        
	        // 2.x
	        if (!isFirebase3x())
	        {         
	            var reg_data = {"email":e_,  "oldPassword ":old_p_,  "newPassword":new_p_};
	            var handler = getHandler2x(this,
	                                         C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnChangingPasswordSuccessful,
	                                         C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnChangingPasswordError);
	            this.get_ref()["changePassword"](reg_data, handler);
	        }
	        
	        // 3.x
	        else
	        {
	            var authObj = getAuthObj()["currentUser"]["updatePassword"](new_p_);
	            addHandler(this, authObj, 
	                              C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnChangingPasswordSuccessful,
	                              C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnChangingPasswordError
	                              );    
	        }    
	    }, 
	    
	    EmailPassword_SendPasswordResetEmail(e_)
	    {
	        // 2.x
	        if (!isFirebase3x())
	        {   
	            var reg_data = {"email":e_};
	            var handler = getHandler2x(this,
	                                         C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnSendPasswordResetEmailSuccessful,
	                                         C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnSendPasswordResetEmailError);
	            this.get_ref()["resetPassword"](reg_data, handler);
	        }
	        
	        // 3.x
	        else
	        {
	            var authObj = getAuthObj()["sendPasswordResetEmail"](e_);
	            addHandler(this, authObj, 
	                              C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnSendPasswordResetEmailSuccessful,
	                              C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnSendPasswordResetEmailError
	                              );                             
	        }         
	    },      
	    
	    EmailPassword_DeleteUser(e_, p_)
	    {   
	        // 2.x
	        if (!isFirebase3x())
	        {           
	            var reg_data = {"email":e_,  "password":p_};
	            var handler = getHandler2x(this,
	                                         C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnDeleteUserSuccessful,
	                                         C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnDeleteUserError);
	            this.get_ref()["removeUser"](reg_data, handler);           
	        }
	        
	        // 3.x
	        else
	        {
	            var authObj = getAuthObj()["currentUser"]["delete"]();
	            addHandler(this, authObj, 
	                              C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnDeleteUserSuccessful,
	                              C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnDeleteUserError
	                              );      
	        }            
	    },      
	    
	    Anonymous_Login(r_)
	    {
	        // 2.x
	        if (!isFirebase3x())
	        {      
	            var handler = getLoginHandler2x(this);
	            var d = {"remember":PRESISTING_TYPE[r_]};
	            this.get_ref()["authAnonymously"](handler, d);
	        }
	        
	        // 3.x
	        else
	        {
	            var authObj = getAuthObj();
	            addLoginHandler(this, authObj["signInAnonymously"]());     
	        }              
	    },  
	    
	    AuthenticationToken_Login(t_, r_)
	    {
	        // 2.x
	        if (!isFirebase3x())
	        {         
	            var handler = getLoginHandler2x(this);
	            var d = {"remember":PRESISTING_TYPE[r_]};
	            this.get_ref()["authWithCustomToken"](t_, handler, d);
	        }
	        
	        // 3.x
	        else
	        {
	            var authObj = getAuthObj();
	            addLoginHandler(this, authObj["signInWithCustomToken"]());    
	        }
	    },      
	    

	    ProviderAuthentication_Login(provider, t_, r_, scope_)
	    {
	        // 2.x
	        if (!isFirebase3x())
	        {             
	            if (typeof(provider) === "number") 
	                provider = PROVIDER_TYPE2x[provider];
	            
	            var loginType = (t_ === 0)? "authWithOAuthPopup":"authWithOAuthRedirect";       
	            var handler = getLoginHandler2x(this);
	            var d = {"remember":PRESISTING_TYPE[r_],
	                     "scope":scope_};
	            this.get_ref()[loginType](provider, handler, d);
	        }
	        
	        // 3.x
	        else
	        {
	            if (typeof(provider) === "number") 
	                provider = PROVIDER_TYPE2x[provider];    
	           
	            provider = capitalizeFirstLetter( provider) + "AuthProvider";  
	            var providerObj = new window["Firebase"]["auth"][provider]();
	            if (scope_ !== "") 
	                providerObj["addScope"](scope_);
	            
	            var authObj = getAuthObj();
	            if (t_ === 0)    // signInWithPopup
	            {
	                addLoginHandler(this, authObj["signInWithPopup"](providerObj));
	            }
	            else    // signInWithRedirect
	            {
	                authObj["signInWithRedirect"](providerObj);
	                addLoginHandler(this, authObj["getRedirectResult"]());
	            }
	        }
	    },

	    AuthWithOAuthToken_FB(access_token, r_, scope_)
	    {
	        if (access_token == "")
	        {        
	            if (typeof (FB) == null) 
	             return;
	        
	             var auth_response = FB["getAuthResponse"]();
	             if (!auth_response)
	                 return;
	        
	            access_token = auth_response["accessToken"];
	        }
	        
	        // 2.x
	        if (!isFirebase3x())
	        {             
	            var handler = getLoginHandler2x(this);  
	            var d = {"remember":PRESISTING_TYPE[r_],
	                     "scope":scope_};                                     
	            this.get_ref()["authWithOAuthToken"]("facebook", access_token, handler, d); 
	        }
	        
	        // 3.x
	        else
	        {
	            var credential = window["Firebase"]["auth"]["FacebookAuthProvider"]["credential"](access_token);
	            var authObj = getAuthObj();
	            addLoginHandler(this, authObj["signInWithCredential"](credential));                     
	        }     
	    },      
	        
	    LoggingOut()
	    {
	        this.isMyLogOutCall = true;
	        // 2.x
	        if (!isFirebase3x())
	        {        
	            this.get_ref()["unauth"]();
	        }
	        
	        // 3.x
	        else
	        {
	            var authObj = getAuthObj()["signOut"]();
	        }      
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
	    },  

	    LinkToFB(access_token)
	    {      
	        // 2.x
	        if (!isFirebase3x())
	        {        
	            alert("Does not support in firebase 2.x api");
	            return;    
	        }
	        
	        var user = getAuthObj()["currentUser"];   
	        if (user == null)
	        {
	            return;
	        }
	    
	        if (access_token == "")
	        {        
	            if (typeof (FB) == null) 
	                return;
	        
	            var auth_response = FB["getAuthResponse"]();
	            if (!auth_response)
	                return;
	        
	            access_token = auth_response["accessToken"];
	        }
	        
	        // 3.x
	        var credential = window["Firebase"]["auth"]["FacebookAuthProvider"]["credential"](access_token);
	        var authObj = user["link"](credential);
	        addHandler(this, authObj, 
	                          C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLinkSuccessful,
	                          C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLinkError
	                          ); 
	    },
	    
	    LinkToGoogle(id_token)
	    {
	        // 2.x
	        if (!isFirebase3x())
	        {        
	            alert("Does not support in firebase 2.x api");
	            return;    
	        }
	        
	        var user = getAuthObj()["currentUser"];   
	        if (user == null)
	        {
	            return;
	        }        
	    
	        // 3.x
	        var credential = window["Firebase"]["auth"]["GoogleAuthProvider"]["credential"](id_token);
	        var authObj = user["link"](credential);
	        addHandler(this, authObj, 
	                          C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLinkSuccessful,
	                          C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLinkError
	                          ); 
	    },  
	    
	    LinkToEmailPassword(e_, p_)
	    {
	        // 2.x
	        if (!isFirebase3x())
	        {        
	            alert("Does not support in firebase 2.x api");
	            return;    
	        }
	        
	        var user = getAuthObj()["currentUser"];   
	        if (user == null)
	        {
	            return;
	        }        
	             
	        // 3.x
	        var credential = window["Firebase"]["auth"]["EmailAuthProvider"]["credential"](e_, p_);
	        var authObj = user["link"](credential);
	        addHandler(this, authObj, 
	                          C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLinkSuccessful,
	                          C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLinkError
	                          ); 
	    },   
	    
	    UpdateProfile(displayName, photoURL)
	    {
	        // 2.x
	        if (!isFirebase3x())
	        {        
	            alert("Does not support in firebase 2.x api");
	            return;    
	        }
	        
	        // 3.x
	        else
	        {
	            var self = this;
	            var user = getAuthObj()["currentUser"]; 
	            var data = {
	                "displayName": displayName,
	                "photoURL": photoURL,
	            }
	            var onSuccess = function ()
	            {
	                self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnUpdatingProfileSuccessful, self);
	            };
	            var onError = function ()
	            {
	                self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnUpdatingProfileError, self);
	            };            
	            user["updateProfile"](data)["then"](onSuccess)["catch"](onError);
	        }
	    }, 

	    UpdateEmail(email)
	    {
	        // 2.x
	        if (!isFirebase3x())
	        {        
	            alert("Does not support in firebase 2.x api");
	            return;    
	        }
	        
	        // 3.x
	        else
	        {
	            var self = this;
	            var user = getAuthObj()["currentUser"]; 
	            var onSuccess = function ()
	            {
	                self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnUpdatingEmailSuccessful, self);
	            };
	            var onError = function ()
	            {
	                self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnUpdatingEmailError, self);
	            };            
	            user["updateEmail"](email)["then"](onSuccess)["catch"](onError);
	        }
	    },

	    SendEmailVerification(email)
	    {
	        // 2.x
	        if (!isFirebase3x())
	        {        
	            alert("Does not support in firebase 2.x api");
	            return;    
	        }
	        
	        // 3.x
	        else
	        {
	            var self = this;
	            var user = getAuthObj()["currentUser"]; 
	            var onSuccess = function ()
	            {
	                self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnSendVerificationEmailSuccessful, self);
	            };
	            var onError = function ()
	            {
	                self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.EmailPassword_OnSendVerificationEmailError, self);
	            };            
	            user["sendEmailVerification"]()["then"](onSuccess)["catch"](onError);
	        }
	    }

	};
}