//Converted with C2C3AddonConverter v1.0.0.15
"use strict";

{
	const PLUGIN_ID = "SimpleQRScanner";
	const PLUGIN_VERSION = "1.0.0.0";
	const PLUGIN_CATEGORY = "general";

	let app = null;

	const PLUGIN_CLASS = SDK.Plugins.SimpleQRScanner = class SimpleQRScanner extends SDK.IPluginBase
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
			this._info.SetAuthor("Rafael Fernandes Lopes (rafaelf@imaginakids.com.br)");
			this._info.SetHelpUrl(lang(".help-url"));
			this._info.SetIsSingleGlobal(true);
			this._info.AddCordovaPluginReference({
				id: "https://github.com/rafaelfl/cordova-gizwits-scan-qrcode.git"
			});
			this._info.SetIsDeprecated(false);
			this._info.SetSupportsEffects(false);
			this._info.SetMustPreDraw(false);
			this._info.SetCanBeBundled(false);
			this._info.SetSupportedRuntimes(["c2", "c3"]);
			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
				new SDK.PluginProperty("text", "title", "SimpleQRScanner"),
				new SDK.PluginProperty("text", "description", "Align the QR Code in the viewfinder")
			]);
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}
