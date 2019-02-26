"use strict";

{
	C3.Plugins.Rex_JSONBuider.Acts =
	{
	    Clean()
		{     
	        this.clean();
		}, 

	    AddValue(k_, v_)
		{
	        this.add_value(k_, v_);
		},     

	    AddBooleanValue(k_, v_)
		{
	        this.add_value(k_, (v_ === 1));
		},   

	    AddNullValue(k_)
		{
	        this.add_value(k_, null);
		}   
	};
}