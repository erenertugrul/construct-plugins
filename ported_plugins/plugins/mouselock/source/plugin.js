//Converted with C2C3AddonConverter v1.0.1.0
"use strict";

{
	const PLUGIN_ID = "MouseLock";
	const PLUGIN_VERSION = "0.5.0.0";
	const PLUGIN_CATEGORY = "other";

	let app = null;

	const PLUGIN_CLASS = SDK.Plugins.MouseLock = class MouseLock extends SDK.IPluginBase
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
			this._info.SetAuthor("Tim Hamilton");
			this._info.SetHelpUrl(lang(".help-url"));
			this._info.SetIsSingleGlobal(true);
			this._info.SetIsDeprecated(false);
			this._info.SetSupportsEffects(false);
			this._info.SetMustPreDraw(false);
			this._info.SetCanBeBundled(true);
			this._info.SetUsesJquery(true);

			this._info.SetSupportedRuntimes(["c2","c3"]);

			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
				new SDK.PluginProperty("group", "constraints"),
				new SDK.PluginProperty("combo", "activate-on", {initialValue:"double click", items:["single click","double click","custom button"]}),
				new SDK.PluginProperty("combo", "bounding", {initialValue:"bound to window", items:["bound to window","bound to layout","unbounded"]}),
				new SDK.PluginProperty("combo", "disable-ıf-unlock", {initialValue:"false", items:["false","true"]}),
				new SDK.PluginProperty("combo", "enable-quantum-tunnelling", {initialValue:"yes-no", items:["yes-no","maybe"]}),
				new SDK.PluginProperty("group", "movement-properties"),
				new SDK.PluginProperty("combo", "smoothing", {initialValue:"false", items:["false","true"]}),
				new SDK.PluginProperty("combo", "ınvert-x", {initialValue:"false", items:["false","true"]}),
				new SDK.PluginProperty("combo", "ınvert-y", {initialValue:"false", items:["false","true"]}),
				new SDK.PluginProperty("float", "cursor-speed", 1),
				new SDK.PluginProperty("float", "dead-zone", 0),
				new SDK.PluginProperty("integer", "speed-cap", 0),
				new SDK.PluginProperty("integer", "response-curve", 0)
			]);
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
			this._info.AddFileDependency({
				filename: "jquery-2.1.1.min.js",
				type: "external-script"
			});
		}
	};
	PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}
