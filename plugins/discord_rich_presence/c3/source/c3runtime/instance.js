"use strict";

{
	C3.Plugins.eren_DiscordRPC.Instance = class eren_DiscordRPCInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			var client_id = properties[0];
			if (!this._runtime.IsPreview() && C3.Platform.IsDesktopApp){
			  	this.client = require('discord-rich-presence/')(client_id);
				this.rpc = this.client.first;
				this.avatar = null;
				this.id = null;
				this.username = null;
				this.premium = null;
				this.usertag = null;
			}

		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				// data to be saved for savegames
			};
		}
		
		LoadFromJson(o)
		{
			// load state for savegames
		}
	};
}