"use strict";

{
	C3.Plugins.eren_DiscordRPC.Acts =
	{
		setactivity(_state,_details,_largeimagekey,_largimagetext,_smallimagekey,_smallimagetext)
		{
			if (!this._runtime.IsPreview() && C3.Platform.IsDesktopApp)
			{
				if (this.client == null)
				{
					this.client = require('discord-rich-presence/')(client_id);
				};
				if (this.username == null && this.client["second"]["user"] != null)
				{
					this.username = this.client["second"]["user"]["username"];
					this.avatar = "https://cdn.discordapp.com/avatars/"+this.client["second"]["user"]["id"]+"/"+this.client["second"]["user"]["avatar"]+".png";
					this.id = this.client["second"]["user"]["id"];
					this.premium = this.client["second"]["user"]["premium_type"];
					this.usertag = this.client["second"]["user"]["username"]+"#"+this.client["second"]["user"]["discriminator"];
				};
				this.rpc["updatePresence"]({
				["details"]: _details,
				["state"]: _state,
				["smallImageKey"]:_smallimagekey,
				["smallImageText"]:_smallimagetext,
				["largeImageKey"]:_largeimagekey,
				["largeImageText"]: _largimagetext
				});
				this.Trigger(C3.Plugins.eren_DiscordRPC.Cnds.onpresence, this);
			};
		}
	};
}