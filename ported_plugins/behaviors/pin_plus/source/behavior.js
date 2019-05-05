//Converted with C2C3AddonConverter v1.0.1.0
"use strict";

{
	const BEHAVIOR_ID = "PinPlus";
	const BEHAVIOR_VERSION = "1.0.0.0";
	const BEHAVIOR_CATEGORY = "general";
	const BEHAVIOR_CLASS = SDK.Behaviors.PinPlus = class PinPlus extends SDK.IBehaviorBase
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
			this._info.SetAuthor("Scirra");
			this._info.SetHelpUrl(lang(".help-url"));
			this._info.SetIsOnlyOneAllowed(false);

			this._info.SetSupportedRuntimes(["c2","c3"]);

			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
				new SDK.PluginProperty("combo", "x", {initialValue:"disabled", items:["disabled","enabled","enabled 2 (disregard distance when pinned)","enabled 3 (scale the pin coordinate)"]}),
				new SDK.PluginProperty("combo", "y", {initialValue:"disabled", items:["disabled","enabled","enabled 2 (disregard distance when pinned)","enabled 3 (scale the pin coordinate)"]}),
				new SDK.PluginProperty("combo", "zindex", {initialValue:"disabled", items:["disabled","in front","behind"]}),
				new SDK.PluginProperty("combo", "angle", {initialValue:"disabled", items:["disabled","enabled","enabled 2 (disregard angle offset when pinned)"]}),
				new SDK.PluginProperty("combo", "width", {initialValue:"disabled", items:["disabled","enabled","enabled 2 (width relative)","enabled 3 (scale)","enabled 4 (scale relative)"]}),
				new SDK.PluginProperty("combo", "height", {initialValue:"disabled", items:["disabled","enabled","enabled 2 (height relative)","enabled 3 (scale)","enabled 4 (scale relative)"]}),
				new SDK.PluginProperty("combo", "opacity", {initialValue:"disabled", items:["disabled","enabled"]}),
				new SDK.PluginProperty("combo", "visibility", {initialValue:"disabled", items:["disabled","enabled"]}),
				new SDK.PluginProperty("combo", "collisions-enabled", {initialValue:"disabled", items:["disabled","enabled"]}),
				new SDK.PluginProperty("combo", "timescale", {initialValue:"disabled", items:["disabled","enabled"]}),
				new SDK.PluginProperty("combo", "hotspot-x", {initialValue:"disabled", items:["disabled","enabled"]}),
				new SDK.PluginProperty("combo", "hotspot-y", {initialValue:"disabled", items:["disabled","enabled"]}),
				new SDK.PluginProperty("integer", "ımagepoint", 0),
				new SDK.PluginProperty("combo", "animation", {initialValue:"disabled", items:["disabled","enabled (set to current frame)","enabled 2 (set to beginning of animation)"]}),
				new SDK.PluginProperty("combo", "frame", {initialValue:"disabled", items:["disabled","enabled"]}),
				new SDK.PluginProperty("combo", "mirror", {initialValue:"disabled", items:["disabled","enabled","enabled 2 (mirror relative)","enabled 3 (mirror image & position)","enabled 4 (mirror relative image & position)","enabled 5 (mirror position only)"]}),
				new SDK.PluginProperty("combo", "flip", {initialValue:"disabled", items:["disabled","enabled","enabled 2 (flip relative)","enabled 3 (flip image & position)","enabled 4 (flip relative image & position)","enabled 5 (flip position only)"]}),
				new SDK.PluginProperty("combo", "destroy", {initialValue:"disabled", items:["disabled","enabled"]})
			]);
			SDK.Lang.PopContext();		// .properties
			SDK.Lang.PopContext();
		}
	};
	BEHAVIOR_CLASS.Register(BEHAVIOR_ID, BEHAVIOR_CLASS);
}
