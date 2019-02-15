///////////////////////////MODIFIED VERSION///////////////////////////
//// TITLE       :: Rex_MoveTo Upgrade to C3Runtime
//// AUTHOR      :: Chadori_RebornXD
//// DESCRIPTION :: Addon upgrade to support the C3Runtime.
//// GAME ENGINE :: Construct 3
/////////////////////////////////////////////////////////////////////


//Converted with C2C3AddonConverter v1.0.0.5
"use strict";

{
	const BEHAVIOR_ID = "Rex_MoveTo";
	const BEHAVIOR_VERSION = "2.0.0.0";
	const BEHAVIOR_CATEGORY = "movements";
	const BEHAVIOR_CLASS = SDK.Behaviors.Rex_MoveTo = class Rex_MoveTo extends SDK.IBehaviorBase
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
			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
				new SDK.PluginProperty("check", "activated", true),
				new SDK.PluginProperty("float", "max-speed", 400),
				new SDK.PluginProperty("float", "acceleration", 0),
				new SDK.PluginProperty("float", "deceleration", 0),
				new SDK.PluginProperty("check", "stop-by-solid", false),
				new SDK.PluginProperty("check", "continued-mode", false)
			]);

			// Support both C2 and C3 runtimes
			this._info.SetSupportedRuntimes(["c2", "c3"]);

			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	BEHAVIOR_CLASS.Register(BEHAVIOR_ID, BEHAVIOR_CLASS);
}
