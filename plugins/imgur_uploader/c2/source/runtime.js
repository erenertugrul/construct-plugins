// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.imgur_upload = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.imgur_upload.prototype;
	var image_link = "";
	var delete_hash ="";
	var any_error ="";
	var imu = null;
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
		imu = this;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		imu.client_id = this.properties[0];

	};
	instanceProto.onDestroy = function ()
	{
	};
	
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
		propsections.push({
			"title": "IMGUR",
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
	Cnds.prototype.on_url_upload = function (myparam)
	{
		return true;
	};
		Cnds.prototype.error_upload = function (myparam)
	{
		return true;
	};
		Cnds.prototype.on_delete = function (myparam)
	{
		return true;
	};
	Cnds.prototype.error_delete = function (myparam)
	{
		return true;
	};	
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.url_upload = function (url)
	{	
		var urll = "";
		var basecheck = url["startsWith"]('data');
		function analyze_data(blob){
			var myReader = new FileReader();
			myReader.readAsDataURL(blob)
			myReader.addEventListener("loadend", function(e)
			{
				var buffer = e.srcElement.result;
				urll = buffer.substring(22,buffer.length);
				request();
			});
		}
		if (basecheck == true){
			urll = url.substring(22,url.length);
			request();
		}
		else{
			var blob = url["startsWith"]('blob');
			if(blob == true){
					var xhr = new XMLHttpRequest(); 
					xhr.open("GET", url); 
					xhr.responseType = "blob";
					xhr.onload = function() 
					{
					    analyze_data(xhr.response);
					}
					xhr.send();
			}
			else{
				urll = url;
				request();
			}
		}
		function request(){
			fetch('https://api.imgur.com/3/image', {
			    method: 'POST',
			    async: true,
			    headers: {
			      "Authorization": "Client-ID "+imu.client_id
			    },
			    body: urll
			  	})
		  		.then(function(response){
					return response["json"]()
				})
			  	.then(function(success){
					if (success.status == "200"){
				  		image_link = success["data"]["link"];
				  		delete_hash = success["data"]["deletehash"];
			            imu.runtime.trigger(cr.plugins_.imgur_upload.prototype.cnds.on_url_upload, imu);
	                }
	                else{
	                    any_error = success["data"]["error"];
	    		  		imu.runtime.trigger(cr.plugins_.imgur_upload.prototype.cnds.error_upload, imu);
	                }
			  	})
		}

	};
	Acts.prototype.sp_upload = function (obj)
	{
		var imageDataUri = null;
		if (obj)
		{
			var inst = obj.getFirstPicked();
			if (!inst || !inst.curFrame)
				return;
			var frame = inst.curFrame;
			imageDataUri = frame.getDataUri();
		}
		fetch('https://api.imgur.com/3/image', {
		    method: 'POST',
		    async: true,
		    headers: {
		      "Authorization": "Client-ID "+imu.client_id
		    },
		    body: imageDataUri.substring(22,imageDataUri.length)
		  	})
	  		.then(function(response){
				return response["json"]()
			})
		  	.then(function(success){
				if (success.status == "200"){
			  		image_link = success["data"]["link"];
			  		delete_hash = success["data"]["deletehash"];
		            imu.runtime.trigger(cr.plugins_.imgur_upload.prototype.cnds.on_url_upload, imu);
                }
                else{
                    any_error = success["data"]["error"];
    		  		imu.runtime.trigger(cr.plugins_.imgur_upload.prototype.cnds.error_upload, imu);
                }
		  	})
	};
	Acts.prototype.img_delete = function (url)
	{
		fetch('https://api.imgur.com/3/image/'+url, {
		    method: 'DELETE',
		    async: true,
		    headers: {
		      "Authorization": "Client-ID "+this.client_id
		    }
		  	})
	  		.then(function(response){
				if (response.status == "200"){
					imu.runtime.trigger(cr.plugins_.imgur_upload.prototype.cnds.on_delete, imu);
				}
				else{
			  		any_error = "Unauthorized";
			  		imu.runtime.trigger(cr.plugins_.imgur_upload.prototype.cnds.error_delete, imu);
				}
			})
	};	
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.imagelink = function (ret)
	{
		ret.set_string(image_link);
	};
	Exps.prototype.hashcode = function (ret)
	{
		ret.set_string(delete_hash);
	};
	Exps.prototype.errorcode = function (ret)
	{
		ret.set_string(any_error);
	};


	pluginProto.exps = new Exps();

}());