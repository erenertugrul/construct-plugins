"use strict";
	var isFirebase3x = function()
	{ 
        return (window["FirebaseV3x"] === true);
    };

    // 2.x	

    // 3.x	
    var getAuthObj = function()
    {
        return window["Firebase"]["auth"]();
    };

    //acts var
        // 2.x
    var getHandler2x = function(self, successTrig, errorTrig)
    {
        var handler = function(error, authData) 
        {
            self.lastError = error;
            self.lastAuthData = authData;
            if (error == null) 
            {
                // get auth data by expression:UserID, and expression:Provider
                self.Trigger(successTrig, self);                
            } 
            else 
            {
                // get error message by expression:ErrorCode and expression:ErrorMessage
                self.Trigger(errorTrig, self);
            }
        };
        return handler;
    };
    
    var getLoginHandler2x = function(self)
    {
        var handler = function(error, authData) 
        {
            self.lastError = error;
            self.lastAuthData = authData;
            if (error == null) 
            {
                // self.isMyLoginCall = false;    // set it in onAuthStateChanged
                // get auth data by expression:UserID, and expression:Provider
                self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLoginSuccessful, self);                
            } 
            else 
            {
                self.isMyLoginCall = false;
                // get error message by expression:ErrorCode and expression:ErrorMessage
                self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLoginError, self);
            }
        };
        self.isMyLoginCall = true;
        return handler;
    };    
    
    // 3.x
    var addHandler = function (self, authObj, successTrig, errorTrig)
    {
        var onSuccess = function (result)
        {
            self.lastError = null;
            self.lastAuthData = result;
            if (successTrig)
                self.Trigger(successTrig, self);
        };
        var onError = function (error)
        {
            self.lastError = error;
            self.lastAuthData = null;
            if (errorTrig)
                self.Trigger(errorTrig, self);
        };        
        authObj["then"](onSuccess)["catch"](onError);
    };
    
    var addLoginHandler = function (self, authObj)
    {
        var onSuccess = function (result)
        {
            self.lastLoginResult = result;
        };
        var onError = function (error)
        {       
            self.isMyLoginCall = false;
            self.lastError = error;
            self.lastLoginResult = null;
            self.Trigger(C3.Plugins.Rex_Firebase_Authentication.Cnds.OnLoginError, self);            
        };        
        self.isMyLoginCall = true;
        authObj["then"](onSuccess)["catch"](onError);
    };
    var PRESISTING_TYPE = ["default", "sessionOnly", "never"];
    var PROVIDER_TYPE2x = ["facebook", "twitter", "github", "google"];
    // 3.x
    var capitalizeFirstLetter = function (s) 
    {
        return s.charAt(0).toUpperCase() + s.slice(1);
    };   
    //exps
        // 2.x
    var getProviderProperty = function (authData, p)
    {
		if (authData == null)
		    return "";
	    
		var provide_type = authData["provider"];
		var provider_info = authData[provide_type];
		if (provider_info == null)
		    return "";
			
		var val = provider_info[p];
		if (val == null)
		    val = "";

        return val;
    };
    
    // 3.x
    var getUserProperty3x = function(p)
    {
        var user = getAuthObj()["currentUser"]; 
        return (user)? user[p]:"";
    };
    var getProviderProperty3x = function (p, idx)
    {
		var user = getAuthObj()["currentUser"]; 
        if (!user)
            return "";
        
        if (idx == null) idx = 0;
        var providerData = user["providerData"][idx];
        var val = (providerData)? providerData[p]:"";
        return val;
    };    
    
{
	C3.Plugins.Rex_Firebase_Authentication = class Rex_Firebase_AuthenticationPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}