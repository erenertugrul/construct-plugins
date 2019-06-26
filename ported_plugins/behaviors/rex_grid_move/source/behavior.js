//Converted with C2C3AddonConverter v1.0.1.0
"use strict";

{
	const BEHAVIOR_ID = "Rex_GridMove";
	const BEHAVIOR_VERSION = "0.1.0.0";
	const BEHAVIOR_CATEGORY = "other";
	const BEHAVIOR_CLASS = SDK.Behaviors.Rex_GridMove = class Rex_GridMove extends SDK.IBehaviorBase
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
				new SDK.PluginProperty("float", "max-speed", 400),
				new SDK.PluginProperty("float", "acceleration", 0),
				new SDK.PluginProperty("float", "deceleration", 0),
				new SDK.PluginProperty("integer", "wander-range-x", 1),
				new SDK.PluginProperty("integer", "wander-range-y", 1),
				new SDK.PluginProperty("combo", "force-move", {initialValue:"no", items:["no","yes"]}),
				new SDK.PluginProperty("combo", "moveto", {initialValue:"yes", items:["no","yes"]}),
				new SDK.PluginProperty("combo", "continued-mode", {initialValue:"no", items:["no","yes"]})
			]);
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	BEHAVIOR_CLASS.Register(BEHAVIOR_ID, BEHAVIOR_CLASS);
}
