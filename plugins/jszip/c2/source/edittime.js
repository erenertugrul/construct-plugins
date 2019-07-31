function GetPluginSettings()
{
	return {
		"name":			"JSZip",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"eren_jszip",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Create .zip files using JavaScript ",
		"author":		"Eren Ertuğrul",
		"help url":		"https://github.com/erenertugrul",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"dependency":	"jszip-utils.js;filesaver.js;jszip.js",
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
				

// Zip Conditions
AddCondition(0, cf_trigger, "On Created Zip", "Zip", "On Created Zip", "Trigger when create new zip file action", "OnCreatedZip");
AddCondition(1, cf_trigger, "On Readed Zip", "Zip", "On Readed Zip", "Trigger when read zip file action", "OnReadedZip");
AddCondition(2, cf_trigger, "On Downloaded Zip", "Zip","On Downloaded Zip", "Trigger when download zip file action", "OnDownloadedZip");
AddCondition(3, cf_trigger, "On Added file", "Zip", "On Added File","Trigger when any add file.", "OnAddedFile");
AddCondition(11, cf_trigger, "On Closed Zip", "Zip", "On Closed Zip","Trigger when close zip action", "OnClosedZip");
AddCondition(12, cf_trigger, "On Added Sprite", "Zip", "On Added Sprite","Trigger when add sprite action", "OnAddedFile");
// File Conditions
AddCondition(4, cf_trigger, "On Readed File", "File", "On Readed File", "Trigger when read file action", "OnReadedFile");
AddCondition(5, cf_trigger, "On Removed File or Directory", "File", "On Removed File or Directory", "Trigger when removed file action", "OnRemovedFile");
AddCondition(6, cf_trigger, "On Created Directory", "File", "On Created Directory", "Trigger when created directory action", "OnCreatedDir");
AddCondition(7, cf_looping, "foreach file list", "File", "foreach file list", "foreach file list", "Foreachlist");

//Other Conditions
AddCondition(8, cf_trigger, "On Errored", "File", "On Errored", "Trigger when any error.", "OnErrorAny");

AddCondition(9, cf_trigger, "On Extract Zip", "Node", "On Extract Zip","Trigger when Extract zip file action", "OnExtractZip");
AddCondition(10, cf_trigger, "On Write Zip", "Node", "On write Zip","Trigger when write zip file action", "OnWritedFile");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// Zip Actions
AddAction(0, af_none, "Create new zip file", "Zip", "Created new zip file", "Create a new JSZip instance.", "CreateNewZipFile");

AddStringParam("zip file", "zip file");
AddAction(1, af_none, "Read Zip File", "Zip", "Read to {0} zip", "read zip file", "ReadZipFile");

AddStringParam("zip file", "zip file");
AddComboParamOption("blob");
AddComboParamOption("binarystring");
AddComboParamOption("array");
AddComboParamOption("uint8array");
AddComboParamOption("arraybuffer");
AddComboParamOption("base64");
AddComboParamOption("nodebuffer");
AddComboParam("Data Format", "zip data format", 0);
AddComboParamOption("no compression");
AddComboParamOption("1 (best speed)");
AddComboParamOption("2");
AddComboParamOption("3");
AddComboParamOption("4");
AddComboParamOption("5");
AddComboParamOption("6");
AddComboParamOption("7");
AddComboParamOption("8");
AddComboParamOption("9 (best compression)");
AddComboParam("Compression Level", "compression level", 0);
AddAction(2, af_none, "Download Zip file", "Zip", "download {0} zip file {1} {2} compression level", "download zip file", "DownloadZipFile");

AddStringParam("File Name", "File Name");
AddStringParam("String", "String");
AddAction(3, af_none, "Add string to zip file", "File", " {0} name {1} file to the zip file.", "Add or update a string to the zip file.", "FileAddString");

AddStringParam("File Name", "File Name");
AddStringParam("Url", "Url");
AddAction(4, af_none, "Add file remote url", "File", " {0} url {1} file to the zip file.", "File add remote url", "FileAddtoUrl");

AddStringParam("File Name", "File Name");
AddStringParam("File Data", "File Data");
AddAction(5, af_none, "Add file with filechooser", "File", " {0} {1} file to the zip file.", "Add or update a string to the zip file.", "FilechooserAdd");

AddObjectParam("Sprite", "A sprite object")
AddAction(6, af_none, "Add Sprite to zip file", "File", " sprite {0} upload", "Add Sprite to zip file", "SpriteAdd");

AddStringParam("File Name", "File Name");
AddComboParamOption("string");
AddComboParamOption("base64");
AddComboParamOption("array");
AddComboParamOption("blob");
AddComboParamOption("binarystring");
AddComboParamOption("arraybuffer");
AddComboParamOption("uint8array");
AddComboParamOption("nodebuffer");
AddComboParam("Data Format", "zip data format", 0);
AddAction(7, af_none, "File Read", "File", "  Read {0}  file to {1} format", "File Read", "FileRead");

AddStringParam("Dir Name", "Dir Name");
AddAction(8, af_none, "Create Empty Directory", "Other", " {0} directory name ", "Create a empty directory", "DirectoryCreate");

AddStringParam("Dir Name", "Dir Name");
AddAction(9, af_none, "Remove file or directory", "Other", " {0} Remove ", "Remove file or directory", "RemoveFileorDir");

AddStringParam("zip file", "zip file");
AddStringParam("dir name", "dirname");
AddAction(10, af_none, "Extract Zip File", "Node", "{0} {1} Extract zip file ", "Only worked node platform. (not browser)", "ExtractZipFile");



AddStringParam("File Name", "file name");
AddComboParamOption("no compression");
AddComboParamOption("1 (best speed)");
AddComboParamOption("2");
AddComboParamOption("3");
AddComboParamOption("4");
AddComboParamOption("5");
AddComboParamOption("6");
AddComboParamOption("7");
AddComboParamOption("8");
AddComboParamOption("9 (best compression)");
AddComboParam("Compression Level", "compression level", 0);
AddAction(11, af_none, "Write Zip File", "Node", "{0} level {1} Write zip file ", "Only worked node platform. (not browser)", "WriteZipFile");

AddAction(12, af_none, "Close Zip File", "Zip", "Close Zip File ", "Close Zip File", "CloseZipFile");

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
AddExpression(0, ef_return_string, "item_list", "loop", "item_list", "filelist loop");
AddExpression(1, ef_return_string, "item", "Main", "item", "get item");
AddExpression(2, ef_return_string, "error", "Main", "error", "return error msg");
AddExpression(3, ef_return_string, "item_url", "loop", "item_url", "return item urls");
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