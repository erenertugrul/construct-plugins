function GetPluginSettings()
{
	return {
		"name":			"Request Review",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"eren_requestreview",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"ios request review",
		"author":		"Eren ertugrul",
		"help url":		"http://www.github.com/erenertugrul",
		"category":		"Platform specific",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"cordova-plugins": "https://github.com/erenertugrul/cordova-requestreview.git",
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
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
// Conditions
AddCondition(0, cf_trigger, "On viewed", "main", "Open the review page", "Triggered when the review page is opened", "onView");
AddCondition(1, cf_trigger, "On itunes page", "main", "Open the itunes page", "Triggered when the itunes page is opened", "onPage");
AddCondition(2, cf_trigger, "On error", "error", "On error", "Triggered if an error in actions", "onError");
////////////////////////////////////////
// Actions
AddAction(0, af_none, "Request Review  ", "main", "open 'request review' page ", "open 'request review' page", "postreview");
AddStringParam("app_id", "enter app id");
AddAction(1, af_none, "Review Write", "main", "open the itunes with {0} and review write ", "open the itunes for review write", "postwrite");
////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_string, "errormessage ", "error", "result", "return the error message if available");
////////////////////////////////////////
ACESDone();
////////////////////////////////////////

var property_list = [
	//new cr.Property(ept_integer, 	"My property",		77,		"An example property.")
	
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