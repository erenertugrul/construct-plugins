//Converted with C2C3AddonConverter v1.0.1.0
"use strict";

{
	const BEHAVIOR_ID = "Rex_Zigzag";
	const BEHAVIOR_VERSION = "1.0.0.0";
	const BEHAVIOR_CATEGORY = "movements";
	const BEHAVIOR_CLASS = SDK.Behaviors.Rex_Zigzag = class Rex_Zigzag extends SDK.IBehaviorBase
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
			this._info.SetAuthor("Rex.Rainbow");
			this._info.SetHelpUrl(lang(".help-url"));
			this._info.SetIsOnlyOneAllowed(false);

			this._info.SetSupportedRuntimes(["c2","c3"]);

			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
				new SDK.PluginProperty("combo", "activated", {initialValue:"yes", items:["no","yes"]}),
				new SDK.PluginProperty("combo", "start", {initialValue:"yes", items:["no","yes"]}),
				new SDK.PluginProperty("combo", "rotatable", {initialValue:"yes", items:["no","yes"]}),
				new SDK.PluginProperty("integer", "repeat-count", 0),
				new SDK.PluginProperty("text", "commands", ""),
				new SDK.PluginProperty("float", "max-moving-speed", 400),
				new SDK.PluginProperty("float", "moving-acceleration", 0),
				new SDK.PluginProperty("float", "moving-deceleration", 0),
				new SDK.PluginProperty("float", "max-rotation-speed", 180),
				new SDK.PluginProperty("float", "rotation-acceleration", 0),
				new SDK.PluginProperty("float", "rotation-deceleration", 0),
				new SDK.PluginProperty("float", "ınitial-angle", 0),
				new SDK.PluginProperty("combo", "precise-mode", {initialValue:"no", items:["no","yes"]}),
				new SDK.PluginProperty("combo", "continued-mode", {initialValue:"no", items:["no","yes"]})
			]);
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	BEHAVIOR_CLASS.Register(BEHAVIOR_ID, BEHAVIOR_CLASS);
}
