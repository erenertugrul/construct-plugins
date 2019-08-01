//Converted with C2C3AddonConverter v1.0.0.15
"use strict";

{
	const BEHAVIOR_ID = "Rex_ShakeMod";
	const BEHAVIOR_VERSION = "0.1.0.0";
	const BEHAVIOR_CATEGORY = "movements";
	const BEHAVIOR_CLASS = SDK.Behaviors.Rex_ShakeMod = class Rex_ShakeMod extends SDK.IBehaviorBase
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
			this._info.SetSupportedRuntimes(["c2", "c3"]);
			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
				new SDK.PluginProperty("combo", "activated", {initialValue:"yes", items:["no","yes"]}),
				new SDK.PluginProperty("combo", "mode", {initialValue:"effect", items:["effect","behavior"]}),
				new SDK.PluginProperty("float", "duration", 0.5),
				new SDK.PluginProperty("float", "magnitude", 10),
				new SDK.PluginProperty("combo", "magnitude-mode", {initialValue:"decay", items:["constant","decay"]})
			]);
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	BEHAVIOR_CLASS.Register(BEHAVIOR_ID, BEHAVIOR_CLASS);
}
