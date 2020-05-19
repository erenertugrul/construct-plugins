// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class

cr.plugins_.jsPDF = function(runtime)
{
	this.runtime = runtime;
};

(function () {

	var pluginProto = cr.plugins_.jsPDF.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.jsPDF = window['jsPDF'];
		this.doc = new this.jsPDF();
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/


	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.AddFont = function(postScriptname,fontname,fontstyle)
	{
		this.doc['addFont'](postScriptname,fontname,fontstyle);
	};


	Acts.prototype.SetFontSize = function (FontSize)
	{
		this.doc["setFontSize"](FontSize);
	};
	Acts.prototype.AddText = function (x,y,angle,string)
	{
		this.doc["text"](string,x,y,angle);
	};
	Acts.prototype.AddImage = function (x,y,w,h,type,base64string)
	{
		this.doc["addImage"](base64string,type,x,y,w,h);
	};
	
	Acts.prototype.SavePDF = function (name)
	{
		this.doc["output"]('save', name);
	};
	Acts.prototype.AddLine = function (x1,y1,x2,y2)
	{
		this.doc["line"](x1,y1,x2,y2);
	};
	Acts.prototype.AddRect = function (x1,y1,w,h,style)
	{
		this.doc["rect"](x1,y1,w,h,style);
	};
	Acts.prototype.SetFont = function(fontName, fontStyle) 
	{
		this.doc["setFont"](fontName, fontStyle);
	};
	
	Acts.prototype.AddPage = function() 
	{
		this.doc["addPage"]();
	};
	Acts.prototype.SetProperties = function(_title,_subject,_author,_keywords,_creator) 
	{
		this.doc["setProperties"]({
			"title": _title,
			"subject": _subject,
			"author": _author,
			"keywords": _keywords,
			"creator": _creator
		});
	};
	
	Acts.prototype.NewDocument = function (orientation,unit,format)
	{
		this.doc = null;
		this.doc = new window["jsPDF"](orientation,unit,format);
	};
	Acts.prototype.SetFillColor = function (R,G,B)
	{
		this.doc["setFillColor"](R,G,B);
	};	
	
	Acts.prototype.SetDrawColor = function (R,G,B)
	{
		this.doc["setDrawColor"](R,G,B);
	};	

	Acts.prototype.SetTextColor = function (R,G,B)
	{
		this.doc["setTextColor"](R,G,B);
	};	
	Acts.prototype.AddEllipse = function (x1,y1,rx,ry,style)
	{
		this.doc["ellipse"](x1,y1,rx,ry,style);
	};
		
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.dataurl = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var myData = this.doc["output"]('dataurlstring');		
		ret.set_any(myData);				// return our value
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());