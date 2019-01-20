// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.SimpleQRScanner = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.SimpleQRScanner.prototype;
		
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
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;

		//this.qrdecode = qrcode;
		
		this.result = "";

		var props = this.properties;

		this.scanTitle = props[0];
		this.scanDesc = props[1];

		//var plugin = this;
		
		//qrcode.callback = read;
		//this.qrdecode["callback"] = function(res){
		//	plugin.result = res;
		//	plugin.runtime.trigger(cr.plugins_.SimpleQRScanner.prototype.cnds.onDecoded, plugin);

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
	// Conditions
	function Cnds() {};

	// the example condition
	/*Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};*/
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();

	var cnds = pluginProto.cnds;
		
	cnds.onDecoded = function ()
	{
		// ... see other behaviors for example implementations ...
		//C
		return true;
	};

	cnds.onDecodeError = function ()
	{
		// ... see other behaviors for example implementations ...
		//C
		return true;
	};

	cnds.onDecodeCancel = function ()
	{
		// ... see other behaviors for example implementations ...
		//C
		return true;
	};
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	/*Acts.prototype.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};*/
	
	// ... other actions here ...

	Acts.prototype.qrDecode = function ()
	{
		var self = this;

		/**
		* 
		* callback:
		{
			"resultCode": "Int",              //(0: unknown; 1: success; 2: error; 3: cancel)
			"result": "String"            //( QR code(success); reason(error); cancel(cancel) )
		}
		*/
		if (this.runtime.isCordova){
			cordova.plugins.gizscanqrcode.scan(
			{
			"baseColor": "#4e8dec",

			//bar
			"title": self.scanTitle,
			"barColor": "4e8dec",
			"statusBarColor": "white",

			//describe string
			"describe": self.scanDesc,
			"describeFontSize": "15",
			"describeLineSpacing": "8",
			"describeColor": "ffffff",

			//scan border
			"borderColor": "4e8dec",
			"borderScale": "0.6",              //(0.1 ~ 1)

			//choose photo button
			"choosePhotoEnable": "false",
			"choosePhotoBtnTitle": "Photo",
			"choosePhotoBtnColor": "4e8dec",

			//flashlight
			"flashlightEnable": "true"
			},
			function (result) {
				var inst = self;

				//alert("Scanned: " + typeof(result) + "\n" + result);

				// Cocoon.io was giving error when using JSON object...
				// var myres = JSON.parse(result);
			
				//
				// Dealing with the string manually... :(
				//
				var myresg = result.toString().replace("{", "").replace("}", "").trim();
				//alert(myresg);
				var lines = myresg.split(",");
				var line_resultCode = "", line_result = "";

				if (lines[0].search("resultCode") > -1) {
					line_resultCode = lines[0]; // first line (resultCode)
					line_result = lines[1]; // second line (result)
				} else {
					line_result = lines[0]; // second line (resultCode)
					line_resultCode = lines[1]; // first line (result)
				}

				//alert(line_resultCode);
				var resultCode = parseInt(line_resultCode.split(":")[1]);
				//alert(resultCode);
				
				//alert(line_result);
				var myresvet = line_result.split(":");
				var myresquot = "";

				for (i = 1; i < myresvet.length; i++) {
					myresquot += myresvet[i].trim();

					if (i < myresvet.length-1) {
						myresquot += ":";
					}
				}
				var myres = myresquot.substr(1, myresquot.length-2).replace("\\", "");

				//alert(myres);

				inst.result = myres;

				var errorCode = resultCode;

				if (errorCode == 3) {
					inst.result = "";
					self.runtime.trigger(cr.plugins_.SimpleQRScanner.prototype.cnds.onDecodeCancel, inst);
				} else {
					self.runtime.trigger(cr.plugins_.SimpleQRScanner.prototype.cnds.onDecoded, inst);
				}
			},
			function (error) {
				var inst = self;

				//alert("Error: " + error);

				// Cocoon.io was giving error when using JSON object...
				// var myres = JSON.parse(result);
			
				//
				// Dealing with the string manually... :(
				//
				var myresg = error.toString().replace("{", "").replace("}", "").trim();
				//alert(myresg);
				var lines = myresg.split(",");
				var line_resultCode = "", line_result = "";

				if (lines[0].search("resultCode") > -1) {
					line_resultCode = lines[0]; // first line (resultCode)
					line_result = lines[1]; // second line (result)
				} else {
					line_result = lines[0]; // first line (result)
					line_resultCode = lines[1]; // second line (resultCode)
				}

				//alert(line_resultCode);
				var resultCode = parseInt(line_resultCode.split(":")[1]);
				//alert(resultCode);
				
				//alert(line_result);
				var myresvet = line_result.split(":");
				var myresquot = "";

				for (i = 1; i < myresvet.length; i++) {
					myresquot += myresvet[i].trim();

					if (i < myresvet.length-1) {
						myresquot += ":";
					}
				}
				var myres = myresquot.substr(1, myresquot.length-2).replace("\\", "");

				var errorCode = resultCode;

				inst.result = "";

				//alert("Error: " + errorCode);
				if (errorCode == 0 || errorCode == 2) {
					self.runtime.trigger(cr.plugins_.SimpleQRScanner.prototype.cnds.onDecodeError, inst);
				} else if (errorCode == 3) {
					self.runtime.trigger(cr.plugins_.SimpleQRScanner.prototype.cnds.onDecodeCancel, inst);
				}
			}
		);	
		}

	};

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	/*Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};*/

	Exps.prototype.decodedQRCode = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.result);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());