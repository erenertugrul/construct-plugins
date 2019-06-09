//Converted with C2C3AddonConverter v1.0.1.0
"use strict";

{
	const PLUGIN_ID = "mkArray";
	const PLUGIN_VERSION = "1.0.0.0";
	const PLUGIN_CATEGORY = "general";

	let app = null;

	const PLUGIN_CLASS = SDK.Plugins.mkArray = class mkArray extends SDK.IPluginBase
	{
		constructor()
		{
			super(PLUGIN_ID);
			SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());
			this._info.SetIcon("icon.png", "image/png");
			this._info.SetName(lang(".name"));
			this._info.SetDescription(lang(".description"));
			this._info.SetVersion(PLUGIN_VERSION);
			this._info.SetCategory(PLUGIN_CATEGORY);
			this._info.SetAuthor("mattkingz");
			this._info.SetHelpUrl(lang(".help-url"));
			this._info.SetIsSingleGlobal(false);
			this._info.SetIsDeprecated(false);
			this._info.SetSupportsEffects(false);
			this._info.SetMustPreDraw(false);
			this._info.SetCanBeBundled(true);

			this._info.SetSupportedRuntimes(["c2","c3"]);

			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
			]);
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}
