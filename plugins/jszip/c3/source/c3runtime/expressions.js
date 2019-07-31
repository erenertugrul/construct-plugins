"use strict";

{
	C3.Plugins.eren_jszip.Exps =
	{
		item()
		{
			if (this.is_base64 == true){
				var a = "data:image/png;base64,"
				return(a+this.item);
			}
			else{
				return(this.item);
			}
		},
		item_list()
		{
			return(this.foritems);
		},
		item_url()
		{
			return(this.foritemurl);
		},
		error()
		{
			return(this.anyerror);
		}
	};
}