function GetBehaviorSettings()
{
	return {
		"name":			"lg_Shake",
		"id":			"lgshake",
		"version":		"1.0",
		"description":	"Shake an object in the X and Y axis.",
		"author":		"Luiz Gama",
		"help url":		"http://www.twitter.com/luizhgama",
		"category":		"General",
		"flags":		bf_onlyone
	};
};

// ACEs
AddNumberParam("Magnitude", "The strength of the shake, in maximum pixels to scroll away.", "10");
AddNumberParam("Duration", "The time the shake should last, in seconds.", "0.5");
AddComboParamOption("Reducing magnitude");
AddComboParamOption("Constant magnitude");
AddComboParam("Mode", "Select whether the magnitude gradually reduces to zero over the duration, or stays constant.");
AddComboParamOption("Do not enforce position");
AddComboParamOption("Enforce position");
AddComboParam("Enforce Position", "Select whether the shake will force object original position to stay the same during and after shake.");
AddComboParamOption("X,Y");
AddComboParamOption("Only X");
AddComboParamOption("Only Y");
AddComboParam("Shake axis", "Select shake axis");
AddAction(0, 0, "Shake", "", "Shake {my} with magnitude <i>{0}</i> for <i>{1}</i> seconds axis {4} ({2})({3})  ", "Shake the screen for a duration of time.", "Shake");

AddComboParamOption("disabled");
AddComboParamOption("enabled");
AddComboParam("State", "Whether to enable or disable the behavior.");
AddAction(1, 0, "Set enabled", "", "Set {my} {0}", "Enable or disable the behavior.", "SetEnabled");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo, "Initial state", "Enabled", "Whether to initially have the behavior enabled or disabled.", "Disabled|Enabled")
	];
	
// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
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
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
