//Converted with C2C3AddonConverter v1.0.1.0
"use strict";

{
	const BEHAVIOR_ID = "rex_Anchor2";
	const BEHAVIOR_VERSION = "0.1.0.0";
	const BEHAVIOR_CATEGORY = "movements";
	const BEHAVIOR_CLASS = SDK.Behaviors.rex_Anchor2 = class rex_Anchor2 extends SDK.IBehaviorBase
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
				new SDK.PluginProperty("combo", "horizontal-align-mode", {initialValue:"left edge", items:["left edge","right edge","center","hotspot","none"]}),
				new SDK.PluginProperty("float", "horizontal-position", 0),
				new SDK.PluginProperty("combo", "vertical-align-mode", {initialValue:"top edge", items:["top edge","bottom edge","center","hotspot","none"]}),
				new SDK.PluginProperty("float", "vertical-position", 0),
				new SDK.PluginProperty("combo", "ınitial-state", {initialValue:"enabled", items:["disabled","enabled"]}),
				new SDK.PluginProperty("combo", "set-once", {initialValue:"no", items:["no","yes"]})
			]);
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	BEHAVIOR_CLASS.Register(BEHAVIOR_ID, BEHAVIOR_CLASS);
}
