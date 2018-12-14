"use strict";

{
	C3.Plugins.cjs.Acts =
	{
		ExecuteJS(myparam)
		{
			this.returnValue= "";
			try 
			{
				this.returnValue= eval(myparam);
			} catch(err)
			{
				this.returnValue= err;
	        }
		}
	};
}