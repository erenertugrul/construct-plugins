function GetPluginSettings()
{
	return {
		"name":			"Firebase Remote Config",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"eren_firebase_remote",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Firebase Remote Config for Cordova plugin",
		"author":		"Eren Ertuğrul",
		"help url":		"github.com/erenertugrul",
		"category":		"Platform specific",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"cordova-plugins": "cordova-plugin-firebase-config",
		"flags":		0						// uncomment lines to enable flags...
						| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example				
AddCondition(0, cf_trigger, "On Boolean", "successfully", "On Boolean received","On Boolean received", "onBoolean");
AddCondition(1, cf_trigger, "On String", "successfully", "On String received","On String received", "onString");
AddCondition(2, cf_trigger, "On Number", "successfully", "On Number received","On Number received", "onNumber");
AddCondition(3, cf_trigger, "On GetBytes", "successfully", "On GetBytes received","On GetBytes received", "onBytes");


AddCondition(4, cf_trigger, "On Fetch Error", "error", "On Fetch Error","On Fetch Error", "onError");
AddCondition(5, cf_trigger, "On String Error", "error", "On String Error","On String Error", "onStringError");
AddCondition(6, cf_trigger, "On Number Error", "error", "On Number Error","On Number Error", "onNumberError");
AddCondition(7, cf_trigger, "On Boolean Error", "error", "On Boolean Error","On Boolean Error", "onBooleanError");
AddCondition(8, cf_trigger, "On Bytes Error", "error", "On Bytes Error","On Bytes Error", "onBytesError");


////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
//AddNumberParam("update", "Enter a key");
//AddAction(0, af_none, "update", "My category", "update {0}", "Description for my action!", "update");
AddStringParam("get boolean", "Enter a key");
AddAction(0, af_none, "Get Boolean", "Main", "getboolean {0}", "get Boolean value", "getboolean");

AddStringParam("get string", "Enter a key");
AddAction(1, af_none, "Get String", "Main", "getstring {0} ", "get String value", "getstring");

AddStringParam("get number", "Enter a key");
AddAction(2, af_none, "Get Number", "Main", "getnumber {0} ", "get Number value", "getnumber");

AddStringParam("get bytes", "Enter a key");
AddAction(3, af_none, "Get Bytes", "Main", "getbytes {0} ", "get Bytes value", "getbytes");

AddNumberParam("set minutes", "Enter minutes.");
AddAction(4, af_none, "Change to update time", "Main", "set update time {0}","set Update time","setupdatetime");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
AddExpression(0, ef_return_string, "boolean_value", "successfully", "getboolean", "Return the boolean value");
AddExpression(1, ef_return_string, "string_value", "successfully", "getstring", "Return the string value");
AddExpression(2, ef_return_string, "number_value", "successfully", "getnumber", "Return the number value");
AddExpression(3, ef_return_string, "bytes_value", "successfully", "getbytes", "Return the byte value");

AddExpression(4, ef_return_string, "get_fetch_error", "Error", "geterror", "Return the fetch error value");
AddExpression(5, ef_return_string, "get_string_error", "Error", "getstringerror", "Return the string error value");
AddExpression(6, ef_return_string, "get_number_error", "Error", "getnumbererror", "Return the number error value");
AddExpression(7, ef_return_string, "get_boolean_error", "Error", "getbooleanerror", "Return the boolean error value");
AddExpression(8, ef_return_string, "get_bytes_error", "Error", "getbyteserror", "Return the bytes error value");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	new cr.Property(ept_integer, 	"update time",		0,		" set minutes. if the dev mode is on, it's always '0'"),
	new cr.Property(ept_combo, 	"devmode",		"True",		" If true, update time is set to 0" ,"False|True")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}