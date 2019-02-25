"use strict";

{
	C3.Plugins.Rex_Firebase.Cnds =
	{

		OnTransaction (cb)
		{
		    return C3.equalsNoCase(cb, this.onTransaction.cb);
		},    

		OnReading (cb)
		{
		    return C3.equalsNoCase(cb, this.onReadCb);
		},  

		OnComplete (cb)
		{
		    return C3.equalsNoCase(cb, this.onCompleteCb);
		}, 	

		OnError (cb)
		{
		    return C3.equalsNoCase(cb, this.onCompleteCb);
		},

		LastDataIsNull ()
		{
	        var data =(this.snapshot === null)? null: this.snapshot["val"]();
		    return (data === null);
		},
	 
		TransactionInIsNull ()
		{
	        var data =(this.onTransaction.input === null)? null: this.onTransaction.input;
		    return (data === null);
		}, 

	    // cf_deprecated
		IsTransactionAborted () { return false; },   
	    // cf_deprecated    
	    
		OnTransactionComplete (cb)
		{
		    return C3.equalsNoCase(cb, this.onTransaction.completedCB);
		}, 	

		OnTransactionError (cb)
		{
		    return C3.equalsNoCase(cb, this.onTransaction.completedCB);
		},   

		OnTransactionAbort (cb)
		{
		    return C3.equalsNoCase(cb, this.onTransaction.completedCB);
		},     
	    
		OnConnected ()
		{
		    return true;
		},    

		OnDisconnected ()
		{
		    return true;
		},      

		IsConnected ()
		{
		    return this.isConnected;
		} 
	};
}