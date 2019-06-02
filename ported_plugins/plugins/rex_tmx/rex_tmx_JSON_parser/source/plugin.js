//Converted with C2C3AddonConverter v1.0.1.0
"use strict";

{
	const PLUGIN_ID = "Rex_tmx_JSON_parser";
	const PLUGIN_VERSION = "0.11.0.0";
	const PLUGIN_CATEGORY = "other";

	let app = null;

	const PLUGIN_CLASS = SDK.Plugins.Rex_tmx_JSON_parser = class Rex_tmx_JSON_parser extends SDK.IPluginBase
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
			this._info.SetAuthor("Rex.Rainbow");
			this._info.SetHelpUrl(lang(".help-url"));
			this._info.SetIsDeprecated(false);
			this._info.SetSupportsEffects(false);
			this._info.SetMustPreDraw(false);
			this._info.SetCanBeBundled(false);

			this._info.SetSupportedRuntimes(["c2","c3"]);

			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
			]);
			this._info.AddFileDependency({
				filename: "zlib_and_gzip.min.js",
				type: "external-script"
				});
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}