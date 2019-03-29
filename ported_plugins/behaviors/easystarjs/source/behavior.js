//Converted with C2C3AddonConverter v1.0.0.10
"use strict";

{
	const BEHAVIOR_ID = "EasystarTilemap";
	const BEHAVIOR_VERSION = "1.4.0.0";
	const BEHAVIOR_CATEGORY = "general";
	const BEHAVIOR_CLASS = SDK.Behaviors.EasystarTilemap = class EasystarTilemap extends SDK.IBehaviorBase
	{
		constructor()
		{
			super(BEHAVIOR_ID);
			SDK.Lang.PushContext("behaviors." + BEHAVIOR_ID.toLowerCase());
			this._info.SetIcon("icon.png", "image/png");
			this._info.SetName(lang(".name"));
			this._info.SetDescription(lang(".description"));
			this._info.SetVersion(BEHAVIOR_VERSION);
			this._info.SetCategory(BEHAVIOR_CATEGORY);
			this._info.SetAuthor("Magistross");
			this._info.SetHelpUrl(lang(".help-url"));
			this._info.SetIsOnlyOneAllowed(true);
			this._info.SetSupportedRuntimes(["c2", "c3"]);
			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
				new SDK.PluginProperty("combo", "diagonal", {initialValue:"enabled", items:["enabled","disabled"]}),
				new SDK.PluginProperty("integer", "iterations-per-calculation", -1),
				new SDK.PluginProperty("combo", "empty-tile-is", {initialValue:"walkable", items:["walkable","non-walkable"]}),
				new SDK.PluginProperty("combo", "corner-cutting", {initialValue:"enabled", items:["enabled","disabled"]}),
				new SDK.PluginProperty("combo", "asynchronous", {initialValue:"yes", items:["yes","no"]})
			]);
			this._info.AddFileDependency({
				filename: "easystar-0.4.1-custom.js",
				type: "external-script"
				});
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	BEHAVIOR_CLASS.Register(BEHAVIOR_ID, BEHAVIOR_CLASS);
}
