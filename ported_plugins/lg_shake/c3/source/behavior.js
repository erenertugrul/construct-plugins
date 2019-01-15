//Converted with C2C3AddonConverter v1.0.0.15
"use strict";

{
	const BEHAVIOR_ID = "lgshake";
	const BEHAVIOR_VERSION = "1.0.0.0";
	const BEHAVIOR_CATEGORY = "general";
	const BEHAVIOR_CLASS = SDK.Behaviors.lgshake = class lgshake extends SDK.IBehaviorBase
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
			this._info.SetAuthor("Luiz Gama");
			this._info.SetHelpUrl(lang(".help-url"));
			this._info.SetIsOnlyOneAllowed(true);
			SDK.Lang.PushContext(".properties");
			this._info.SetSupportedRuntimes(["c2", "c3"]);
			this._info.SetProperties([
				new SDK.PluginProperty("combo", "ınitial-state", {initialValue:"enabled", items:["disabled","enabled"]})
			]);
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	BEHAVIOR_CLASS.Register(BEHAVIOR_ID, BEHAVIOR_CLASS);
}
