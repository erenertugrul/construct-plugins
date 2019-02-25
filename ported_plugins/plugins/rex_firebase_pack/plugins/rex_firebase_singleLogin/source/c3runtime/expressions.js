"use strict";

{
	C3.Plugins.Rex_Firebase_SingleLogin.Exps =
	{
		LoginCount()
		{
	        var cnt = (this.loginList === null)? 0: this.loginList.GetItems().length;
			return (cnt);
		},
	    
		CurLoginIndex()
		{
			return (this.exp_CurLoginItemIdx);
		},
	    
		CurLoginTimestamp()
		{
		    var ts;	    
		    if (this.exp_CurLoginItem != null)
		        ts = get_timestamp(this.exp_CurLoginItem["timestamp"]);
		    else
		        ts = 0;
		        	    
			return (ts);
		}
	};
}