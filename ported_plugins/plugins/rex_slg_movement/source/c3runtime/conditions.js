"use strict";

{
	C3.Plugins.Rex_SLGMovement.Cnds =
	{
	    OnCostFn(name) 
	    {
	        return C3.equalsNoCase(name, this.costFnName);
	    },

	    OnFilterFn(name) 
	    {
	        return C3.equalsNoCase(name, this.filterFnName);
	    }
	};
}