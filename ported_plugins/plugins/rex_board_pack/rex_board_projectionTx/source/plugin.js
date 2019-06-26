//Converted with C2C3AddonConverter v1.0.1.0
"use strict";

{
	const PLUGIN_ID = "Rex_ProjectionTx";
	const PLUGIN_VERSION = "0.1.0.0";
	const PLUGIN_CATEGORY = "other";

	let app = null;

	const PLUGIN_CLASS = SDK.Plugins.Rex_ProjectionTx = class Rex_ProjectionTx extends SDK.IPluginBase
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
			this._info.SetIsSingleGlobal(false);
			this._info.SetIsDeprecated(false);
			this._info.SetSupportsEffects(false);
			this._info.SetMustPreDraw(false);
			this._info.SetCanBeBundled(true);

			this._info.SetSupportedRuntimes(["c2","c3"]);

			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
				new SDK.PluginProperty("group", "origin"),
				new SDK.PluginProperty("float", "x-at-(0,0)", 0),
				new SDK.PluginProperty("float", "y-at-(0,0)", 0),
				new SDK.PluginProperty("group", "vector-u"),
				new SDK.PluginProperty("float", "ux", 0),
				new SDK.PluginProperty("float", "uy", 0),
				new SDK.PluginProperty("group", "vector-v"),
				new SDK.PluginProperty("float", "vx", 0),
				new SDK.PluginProperty("float", "vy", 0),
				new SDK.PluginProperty("group", "misc"),
				new SDK.PluginProperty("combo", "directions", {initialValue:"4 directions", items:["4 directions","8 directions"]})
			]);
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}
