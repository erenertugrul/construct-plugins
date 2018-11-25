"use strict";

{
	C3.Plugins.imgur_upload.Cnds =
	{
		on_url_upload(m)
		{
			return true;
		},
		error_upload(m)
		{
			return true;
		},
		on_delete(m)
		{
			return true;
		},
		error_delete(m)
		{
			return true;
		}
	};
}