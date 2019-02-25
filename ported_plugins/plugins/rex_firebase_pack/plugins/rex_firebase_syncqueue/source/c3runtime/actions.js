"use strict";

{
	C3.Plugins.Rex_Firebase_SyncQueue.Acts =
	{
	    SetupToken(token_objs)
		{   
		    // release token
		    if (this.tokenCtrl)
		    {
		        this.tokenCtrl.Remove(this);
		        this.tokenCtrl = null;
		    }

	        var token_inst = token_objs.instances[0];
	        if (token_inst.GetTokenCtrl)
	        {
	            this.tokenCtrl = token_inst.GetTokenCtrl();
	            this.tokenCtrl.Add(this);
	        }      
	        else
	            alert ("Sync Queue should connect to a token object");               
		},
		
	    Push2In(d)
		{	    
		    this.get_ref("in")["push"](dout(d));
		},
		
	    Push2Out(d)
		{	           
	        this.get_ref("out")["push"](dout(d));
		}	
	};
}