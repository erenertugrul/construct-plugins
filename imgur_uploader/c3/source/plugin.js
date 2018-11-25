//Converted with C2C3AddonConverter v1.0.0.15
"use strict";

{
	const PLUGIN_ID = "imgur_upload";
	const PLUGIN_VERSION = "1.0.0.0";
	const PLUGIN_CATEGORY = "platform-specific";

	let app = null;
	
	const PLUGIN_CLASS = SDK.Plugins.imgur_upload = class imgur_upload extends SDK.IPluginBase
	{
		constructor()
		{
			super(PLUGIN_ID);
			SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());
			//this._info.SetIcon("icon.svg", "image/svg");
			this._info.SetIcon("icon.png", "image/png");
			this._info.SetName(lang(".name"));
			this._info.SetDescription(lang(".description"));
			this._info.SetVersion(PLUGIN_VERSION);
			this._info.SetCategory(PLUGIN_CATEGORY);
			this._info.SetAuthor("Eren Ertuğrul");
			this._info.SetHelpUrl(lang(".help-url"));
			this._info.SetIsSingleGlobal(true);
			this._info.SetIsDeprecated(false);
			this._info.SetSupportsEffects(false);
			this._info.SetMustPreDraw(false);
			this._info.SetCanBeBundled(false);
			// Support both the C2 and C3 runtimes
			this._info.SetSupportedRuntimes(["c2", "c3"]);
			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
				new SDK.PluginProperty("text", "client-id", "5d4249cd734c559") // you should put own client id
			]);
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();

		}
	};
	PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}
