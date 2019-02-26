"use strict";

{
	C3.Plugins.Rex_JSONBuider.Cnds =
	{
		AddObject(k_, type_)
		{
	        return this.add_object(k_, type_);
		},

		SetRoot(type_)
		{
	        this.clean();
	        return this.add_object("", type_);
		}
	};
}