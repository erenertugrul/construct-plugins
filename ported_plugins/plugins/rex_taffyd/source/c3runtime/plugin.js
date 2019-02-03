"use strict";

{
	C3.Plugins.Rex_taffydb = class Rex_taffydbPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
			C3.Plugins.Rex_taffydb.databases = {}; // {db: database, ownerUID: uid }
		}
		
		Release()
		{
			super.Release();
		}
	};
}
