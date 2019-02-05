function GetPluginSettings()
{
	return {
		"name":			"imgur",
		"id":			"imgur_upload",
		"version":		"1.1",
		"description":	"imgur simple image uploader",
		"author":		"Eren Ertugrul",
		"help url":		"https://oyunkulturu.com",
		"category":		"General",
		"type":			"object",
		"rotatable":	true,
		"flags":		0
						| pf_singleglobal
	};
};

////////////////////////////////////////
// Conditions				
AddCondition(0, cf_trigger, "On image uploaded", "success", "On image uploaded", "Triggered after 'Upload image with url or sprite' action if the upload was successfully", "on_url_upload");
AddCondition(1, cf_trigger, "On image upload failed", "fail", "On image upload failed", "Triggered if an error in upload image", "error_upload");
AddCondition(2, cf_trigger, "On image deleted", "success", "On image deleted", "Triggered after 'Delete image' action if the delete was successfully", "on_delete");
AddCondition(3, cf_trigger, "On image delete failed", "fail", "On image delete failed", "Triggered if an error in delete image", "error_delete");

////////////////////////////////////////
// Actions
AddStringParam("image url or base64 link", "a URL for an image or base64 image (up to 10MB)");
AddAction(0, af_none, "Upload image with url", "upload", "upload image to url or base64 image", "Upload image with url", "url_upload");
AddStringParam("image hashcode", "hash to delete image");
AddAction(1, af_none, "Delete image", "delete", "hash {0} to delete image ", "Delete image", "img_delete");
AddObjectParam("image","A sprite object for upload.")
AddAction(2,af_none,"Upload image with sprite","upload","upload image {0} file.","Upload image with sprite","sp_upload");

////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_string, "UploadedUrl", "success", "imagelink", "the URL to uploaded image");
AddExpression(1, ef_return_string, "HashCode", "success", "hashcode", "return the hashcode for image delete");
AddExpression(2, ef_return_string, "ErrorMessage", "fail", "errorcode", "return the error message");
////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text,"Client-ID","5d4249cd734c559","get id https://imgur.com/account/settings/apps")
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