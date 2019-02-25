"use strict";

{
	C3.Plugins.Rex_Firebase_Counter.Cnds =
	{
		OnUpdate()
		{
		    return true;
		},
		
		OnMyWriting()
		{
		    return true;
		},	
		
		CompareLastWroteValue(cmp, s)
		{
		    if (this.exp_MyLastWroteValue == null)
		        return false;
			return do_cmp(this.exp_MyLastWroteValue, cmp, s);
		},	
		
		CompareLastValue(cmp, s)
		{
			return do_cmp(this.exp_LastValue, cmp, s);
		},
				
		OnMyWritingAbort()
		{
		    return true;
		},		
				
		OnAddFn(cb)
		{
		    return C3.equalsNoCase(cb, this.onCustomAdd_cb);
		},	
				
		OnMyWritingError()
		{
		    return true;
		}	
	};
}