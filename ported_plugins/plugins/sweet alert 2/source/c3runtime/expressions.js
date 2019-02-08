"use strict";

{
	C3.Plugins.SweetAlert.Exps =
	{
	    GetLastValue()
	    {
	        return (this.lastValue);
	    },

	    GetLastValueAt(at_)
	    {
	        return (JSON.stringify(this.lastValueAt[at_]));
	    },

	    GetCount()
	    {
	        return (this.count);
	    },

	    GetTag()
	    {
	        return (this.tag);
	    }
	};
}