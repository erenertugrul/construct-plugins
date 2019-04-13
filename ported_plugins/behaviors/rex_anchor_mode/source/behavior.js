//Converted with C2C3AddonConverter v1.0.1.0
"use strict";

{
	const BEHAVIOR_ID = "rex_Anchor_mod";
	const BEHAVIOR_VERSION = "1.0.0.0";
	const BEHAVIOR_CATEGORY = "movements";
	const BEHAVIOR_CLASS = SDK.Behaviors.rex_Anchor_mod = class rex_Anchor_mod extends SDK.IBehaviorBase
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
				new SDK.PluginProperty("combo", "left-edge", {initialValue:"window left", items:["window left","window right","none"]}),
				new SDK.PluginProperty("combo", "top-edge", {initialValue:"window top", items:["window top","window bottom","none"]}),
				new SDK.PluginProperty("combo", "right-edge", {initialValue:"none", items:["none","window right"]}),
				new SDK.PluginProperty("combo", "bottom-edge", {initialValue:"none", items:["none","window bottom"]}),
				new SDK.PluginProperty("combo", "ınitial-state", {initialValue:"enabled", items:["disabled","enabled"]}),
				new SDK.PluginProperty("combo", "set-once", {initialValue:"no", items:["no","yes"]})
			]);
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	BEHAVIOR_CLASS.Register(BEHAVIOR_ID, BEHAVIOR_CLASS);
}
