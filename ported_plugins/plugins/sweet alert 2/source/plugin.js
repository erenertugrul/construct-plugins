//Converted with C2C3AddonConverter v1.0.1.0
"use strict";

{
	const PLUGIN_ID = "SweetAlert";
	const PLUGIN_VERSION = "0.20.0.0";
	const PLUGIN_CATEGORY = "other";

	let app = null;

	const PLUGIN_CLASS = SDK.Plugins.SweetAlert = class SweetAlert extends SDK.IPluginBase
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
			this._info.SetAuthor("PlayLive and Andrews Vinícius");
			this._info.SetHelpUrl(lang(".help-url"));
			this._info.SetIsSingleGlobal(true);
			this._info.SetIsDeprecated(false);
			this._info.SetSupportsEffects(false);
			this._info.SetMustPreDraw(false);
			this._info.SetCanBeBundled(true);

			this._info.SetSupportedRuntimes(["c2", "c3"]);	// c3 for stubs only!

			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
			]);
			this._info.AddFileDependency({
				filename: "SweetAlert.css",
				type: "external-css"
			});
			this._info.AddFileDependency({
				filename: "SweetAlert.js",
				type: "external-script"
			});
			this._info.AddFileDependency({
				filename: "jquery-1.6.3.min.js",
				type: "external-script"
			});
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}
