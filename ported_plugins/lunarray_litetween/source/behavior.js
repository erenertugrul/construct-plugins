"use strict";

{
	////////////////////////////////////////////
	// The behavior ID is how Construct identifies different kinds of behaviors.
	// *** NEVER CHANGE THE BEHAVIOR ID! ***
	// If you change the behavior ID after releasing the behavior, Construct will think it is an entirely different
	// behavior and assume it is incompatible with the old one, and YOU WILL BREAK ALL EXISTING PROJECTS USING THE BEHAVIOR.
	// Only the behavior name is displayed in the editor, so to rename your behavior change the name but NOT the ID.
	// If you want to completely replace a behavior, make it deprecated (it will be hidden but old projects keep working),
	// and create an entirely new behavior with a different behavior ID.
	const BEHAVIOR_ID = "lunarray_LiteTween";
	////////////////////////////////////////////
	
	const BEHAVIOR_VERSION = "1.7";
	const BEHAVIOR_CATEGORY = "general";
	
	const BEHAVIOR_CLASS = SDK.Behaviors.lunarray_LiteTween = class lunarray_LiteTween extends SDK.IBehaviorBase
	{
		constructor()
		{
			super(BEHAVIOR_ID);
			
			SDK.Lang.PushContext("behaviors." + BEHAVIOR_ID.toLowerCase());
			
			this._info.SetName(lang(".name"));
			this._info.SetDescription(lang(".description"));
			this._info.SetVersion(BEHAVIOR_VERSION);
			this._info.SetCategory(BEHAVIOR_CATEGORY);
			this._info.SetAuthor("lunarray");
			this._info.SetHelpUrl(lang(".help-url"));
			this._info.SetSupportedRuntimes(["c2", "c3"]);
			SDK.Lang.PushContext(".properties");
			this._info.SetProperties([
				// sdk example
				//new SDK.PluginProperty("integer", "test-property", 0),
				new SDK.PluginProperty("combo", "active-on-start", {
					"initialValue": "yes",
					"items": ["no", "yes", "ping-pong", "loop", "flip-flop"]
				}),
				new SDK.PluginProperty("combo", "tweened-property", {
					"initialValue": "position",
					"items": ["position", "size", "width", "height", "angle", "opacity", "value", "horizontal", "vertical", "scale"]
				}),
				new SDK.PluginProperty("combo", "function", {
					"initialValue": "easeoutbounce",
					"items": ["linear", "easeinquad", "easeoutquad", "easeinoutquad", "easeincubic", "easeoutcubic", 
					"easeinoutcubic", "easeinquart", "easeoutquart", "easeinoutquart", "easeinquint", "easeoutquint", 
					"easeinoutquint", "easeincircle", "easeoutcircle", "easeinoutcircle", "easeinback", "easeoutback", 
					"easeinoutback", "easeinelastic", "easeoutelastic", "easeinoutelastic", "easeinbounce", "easeoutbounce", 
					"easeinoutbounce", "easeinsmoothstep", "easeoutsmoothstep", "easeinoutsmoothstep"]
				}),
				new SDK.PluginProperty("text", "target", "100,100"),
				new SDK.PluginProperty("combo", "target-mode", {
					"initialValue": "absolute",
					"items": ["absolute", "relative"]
				}),
				new SDK.PluginProperty("float", "duration", 2.5),
				new SDK.PluginProperty("combo", "enforce-mode", {
					"initialValue": "enforce",
					"items": ["compromise", "enforce"]
				})
			]);
			SDK.Lang.PopContext();	// .properties

			SDK.Lang.PopContext();
		}
	};
	
	BEHAVIOR_CLASS.Register(BEHAVIOR_ID, BEHAVIOR_CLASS);
}