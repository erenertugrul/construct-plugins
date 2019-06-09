// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.mkArray = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.mkArray.prototype;
		
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
		
		this.arrays = {};
		this.current_arr = null;
		this.current_value = null;
		this.current_index = null;
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

	instanceProto.clearArray = function(name){
		if(!this.arrayExists(name)) return;
		
		while(this.arrays[name].length > 0)
			this.arrays[name].pop();
	};

	instanceProto.deleteArray = function(name){
		if(!this.arrayExists(name)) return;

		this.clearArray(name);
		delete this.arrays[name];
	};

	instanceProto.arrayExists = function(name){
		return this.arrays[name] != null;
	}

	instanceProto.isArrayEmpty = function(name){
		return this.arrayExists(name) && this.arrays[name].length == 0;
	}

	instanceProto.indexOutOfBounds = function(name, index){
		if(!this.arrayExists(name)) return true;
		if(this.isArrayEmpty(name)) return true;
		return index < 0 || index >= this.arrays[name].length;
	}

	instanceProto.comparison = function(op, val1, val2){
		switch(op){
			case 0:
				return val1 == val2;
			case 1:
				return val1 != val2;
			case 2:
				return val1 < val2;
			case 3:
				return val1 <= val2;
			case 4:
				return val1 > val2;
			case 5:
				return val1 >= val2;
		}
		return false;
	}

	
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


	Cnds.prototype.IsEmpty = function (arr_name)
	{
		return this.isArrayEmpty(arr_name);
	};

	Cnds.prototype.CompareLength = function (arr_name, op, value)
	{
		if(!this.arrayExists(arr_name)) return false;
		return this.comparison(op, this.arrays[arr_name].length, value);
	};

	Cnds.prototype.CompareAt = function (arr_name, index, op, value)
	{
		if(this.indexOutOfBounds(arr_name, index)) return false;
		return this.comparison(op, this.arrays[arr_name][index], value);
	};

	Cnds.prototype.Contains = function (arr_name, value)
	{
		if(this.isArrayEmpty(arr_name)) return false;
		var arr = this.arrays[arr_name];
		for(var i = 0; i < arr.length; i++){
			if(arr[i] == value)
				return true;
		}
		return false;
	};

	instanceProto.doForEachTrigger = function (current_event, current_arr, current_index)
	{
		this.current_arr = current_arr;
		this.current_value = this.arrays[current_arr][current_index];
		this.current_index = current_index;
		this.runtime.pushCopySol(current_event.solModifiers);
		current_event.retrigger();
		this.runtime.popSol(current_event.solModifiers);
	};
	
	Cnds.prototype.ForEach = function (arr_name)
	{
		if(this.isArrayEmpty(arr_name)) return false;

        var current_event = this.runtime.getCurrentEventStack().current_event;
		
		for (var i = 0; i < this.arrays[arr_name].length; i++)
		{
			this.doForEachTrigger(current_event, arr_name, i);
		}

		this.current_arr = null;
		this.current_index = null;
		this.current_value = null;

		return false;
	};

	Cnds.prototype.For = function (arr_name, start, finish, step)
	{
		if(this.isArrayEmpty(arr_name)) return false;
		if(this.indexOutOfBounds(arr_name, start)) return false;
		if(this.indexOutOfBounds(arr_name, finish)) return false;
		step = Math.abs(Math.floor(step));
		if(step == 0) return false;

        var current_event = this.runtime.getCurrentEventStack().current_event;
		
		for (var i = start; finish > start ? i <= finish : i >= finish; finish > start ? i+=step: i-=step)
		{
			this.doForEachTrigger(current_event, arr_name, i);
		}

		this.current_arr = null;
		this.current_index = null;
		this.current_value = null;

		return false;
	};

	Cnds.prototype.CompareCurrentValue = function (op, value)
	{
		if(this.current_value == null) return false;
		return this.comparison(op, this.current_value, value);
	};

	Cnds.prototype.CompareCurrentIndex = function (op, value)
	{
		if(this.current_index == null) return false;
		return this.comparison(op, this.current_index, value);
	};
	
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.NewArray = function (arr_name)
	{
		if(this.arrayExists(arr_name))
			this.clearArray(arr_name);
		else
			this.arrays[arr_name] = [];
	};

	Acts.prototype.PushToArray = function (arr_name, value, where)
	{
		if(!this.arrayExists(arr_name))	return;

		switch(where){
			case 0:
				this.arrays[arr_name].push(value);
				break;
			case 1:
				this.arrays[arr_name].unshift(value);
				break;
		}
	};

	Acts.prototype.InsertToArray = function (arr_name, value, index)
	{
		if(this.indexOutOfBounds(arr_name, index))	return;

		this.arrays[arr_name].splice(index, 0, value);
	};
	
	Acts.prototype.PopFromArray = function (arr_name, where)
	{
		if(this.isArrayEmpty(arr_name))	return;

		switch(where){
			case 0:
				this.arrays[arr_name].pop();
				break;
			case 1:
				this.arrays[arr_name].shift();
				break;
		}
	};

	Acts.prototype.DeleteFromArray = function (arr_name, index)
	{
		if(this.indexOutOfBounds(arr_name, index)) return;

		this.arrays[arr_name].splice(index, 1);
	};

	Acts.prototype.SetValue = function (arr_name, value, index)
	{
		if(this.indexOutOfBounds(arr_name, index)) return;

		this.arrays[arr_name][index] = value;
	};

	Acts.prototype.ClearArray = function (arr_name)
	{
		this.clearArray(arr_name);
	};

	Acts.prototype.DeleteArray = function (arr_name)
	{
		this.deleteArray(arr_name);
	};

	Acts.prototype.DeleteAll = function (arr_name)
	{
		for(var key in this.arrays){
			this.deleteArray(key);
		}
	};

	Acts.prototype.SortArray = function (arr_name, order, how)
	{
		if(!this.arrayExists(arr_name)) return;

		switch(how){
			case 0:
				this.arrays[arr_name].sort();
				break;
			case 1:
				this.arrays[arr_name].sort(function(a, b){
					a = +a || 9999999999;
					b = +b || 9999999999;
					return a - b;
				});
				break;
		}
		if(order == 1){
			this.arrays[arr_name].reverse();
		}
	};

	Acts.prototype.ShuffleArray = function (arr_name)
	{
		if(!this.arrayExists(arr_name)) return;

		for(var i = 0; i < this.arrays[arr_name].length; i++){
			var rnd = Math.floor(Math.random() * this.arrays[arr_name].length);
			var tmp = this.arrays[arr_name][rnd];
			this.arrays[arr_name][rnd] = this.arrays[arr_name][i];
			this.arrays[arr_name][i] = tmp;
		}
	};

	Acts.prototype.Log = function (arr_name)
	{
		if(this.arrayExists(arr_name))
			console.log("Array " + arr_name + ": " + JSON.stringify(this.arrays[arr_name]));
		else
			console.log("Array " + arr_name + " does not exist.");
	};

	Acts.prototype.Copy = function (arr_original, arr_new)
	{
		if(!this.arrayExists(arr_original)) return;
		if(this.arrayExists(arr_new))
			this.deleteArray(arr_new);

		this.arrays[arr_new] = [];
		for(var i = 0; i < this.arrays[arr_original].length; i++){
			this.arrays[arr_new].push(this.arrays[arr_original][i]);
		}
	};

	Acts.prototype.CopyValues = function (arr_original, arr_target)
	{
		if(this.isArrayEmpty(arr_original)) return;
		if(!this.arrayExists(arr_target)) return;

		for(var i = 0; i < this.arrays[arr_original].length; i++){
			this.arrays[arr_target].push(this.arrays[arr_original][i]);
		}
	};

	Acts.prototype.RemoveItem = function (arr_name, op, item)
	{
		if(this.isArrayEmpty(arr_name)) return;

		var arr = this.arrays[arr_name];
		for(var i = arr.length-1; i >= 0; i--){
			if(this.comparison(op, arr[i], item)){
				arr.splice(i, 1);
			}
		}
	};

	Acts.prototype.AddNumbers = function (arr_name, start, finish, step)
	{
		if(!this.arrayExists(arr_name)) return;
		if(step == 0) return;

		if(finish > start){
			if(step < 0) step *= -1;
		}else if(finish < start){
			if(step > 0) step *= -1;
		}

		var arr = this.arrays[arr_name];
		for(var i = start; step > 0 ? i < finish : i > finish; i+=step){
			arr.push(i);
		}
		arr.push(finish);
	};

	Acts.prototype.AddStrings = function (arr_name, strings, separator)
	{
		if(!this.arrayExists(arr_name)) return;
		if(separator == "" || strings == "") return;

		var arr = this.arrays[arr_name];
		var strings_arr = strings.split(separator);
		for(var i = 0; i < strings_arr.length; i++){
			arr.push(strings_arr[i]);
		}
	};

	Acts.prototype.ReplaceValues = function (arr_name, op, item, replace)
	{
		if(this.isArrayEmpty(arr_name)) return;

		var arr = this.arrays[arr_name];
		for(var i = 0; i < arr.length; i++){
			if(this.comparison(op, arr[i], item))
				arr[i] = replace;
		}
	};

	Acts.prototype.AddItems = function (arr_name, item, times)
	{
		if(!this.arrayExists(arr_name)) return;
		if(times < 1) return;

		var arr = this.arrays[arr_name];
		for(var i = 0; i < times; i++){
			arr.push(item);
		}
	};


	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	Exps.prototype.ArrayToString = function (ret, arr_name)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		if(!this.arrayExists(arr_name)){
			ret.set_string("");
			return;
		}

		ret.set_string(JSON.stringify(this.arrays[arr_name]));				// return our value
	};

	Exps.prototype.Length = function (ret, arr_name)
	{
		if(!this.arrayExists(arr_name)){
			ret.set_int(0);
			return;
		}

		ret.set_int(this.arrays[arr_name].length);
	};

	Exps.prototype.At = function (ret, arr_name, index)
	{
		if(!this.arrayExists(arr_name)){
			ret.set_any("");
			return;
		}

		ret.set_any(this.arrays[arr_name][index]);
	};

	Exps.prototype.Retrieve = function (ret, arr_name, index)
	{
		if(this.indexOutOfBounds(arr_name, index)){
			ret.set_any("");
			return;
		}
		var tmp = this.arrays[arr_name][index];
		this.arrays[arr_name].splice(index, 1);
		ret.set_any(tmp);
	};

	Exps.prototype.Max = function (ret, arr_name)
	{
		if(this.isArrayEmpty(arr_name)){
			ret.set_float(0);
			return;
		}
		var arr = this.arrays[arr_name];
		var max;
		for(var i = 0; i < arr.length; i++){
			var n = arr[i];
			if(typeof n == "number"){
				if(max == null) max = n;
				if(n > max) max = n;
			}
		}
		if(max == null) max = 0;
		ret.set_float(max);
	};

	Exps.prototype.Min = function (ret, arr_name)
	{
		if(this.isArrayEmpty(arr_name)){
			ret.set_float(0);
			return;
		}
		var arr = this.arrays[arr_name];
		var min;
		for(var i = 0; i < arr.length; i++){
			var n = arr[i];
			if(typeof n == "number"){
				if(min == null) min = n;
				if(n < min) min = n;
			}
		}
		if(min == null) min = 0;
		ret.set_float(min);
	};

	Exps.prototype.Pop = function (ret, arr_name)
	{
		if(this.isArrayEmpty(arr_name)){
			ret.set_any("");
			return;
		}
		ret.set_any(this.arrays[arr_name].pop());
	};

	Exps.prototype.Dequeue = function (ret, arr_name)
	{
		if(this.isArrayEmpty(arr_name)){
			ret.set_any("");
			return;
		}
		ret.set_any(this.arrays[arr_name].shift());
	};

	Exps.prototype.Last = function (ret, arr_name)
	{
		if(this.isArrayEmpty(arr_name)){
			ret.set_any("");
			return;
		}
		ret.set_any(this.arrays[arr_name][this.arrays[arr_name].length-1]);
	};

	Exps.prototype.First = function (ret, arr_name)
	{
		if(this.isArrayEmpty(arr_name)){
			ret.set_any("");
			return;
		}
		ret.set_any(this.arrays[arr_name][0]);
	};

	Exps.prototype.Random = function (ret, arr_name)
	{
		if(this.isArrayEmpty(arr_name)){
			ret.set_any("");
			return;
		}
		var rnd = Math.floor(Math.random() * this.arrays[arr_name].length);
		ret.set_any(this.arrays[arr_name][rnd]);
	};

	Exps.prototype.RetrieveRandom = function (ret, arr_name)
	{
		if(this.isArrayEmpty(arr_name)){
			ret.set_any("");
			return;
		}
		var rnd = Math.floor(Math.random() * this.arrays[arr_name].length);
		var tmp = this.arrays[arr_name][rnd];
		this.arrays[arr_name].splice(rnd, 1);
		ret.set_any(tmp);
	};

	Exps.prototype.Count = function (ret, arr_name, item)
	{
		if(this.isArrayEmpty(arr_name)){
			ret.set_int(0);
			return;
		}
		var count = 0;
		for(var i = 0; i < this.arrays[arr_name].length; i++){
			if(this.arrays[arr_name][i] == item){
				count++;
			}
		}
		ret.set_int(count);
	};

	Exps.prototype.Mode = function (ret, arr_name)
	{

		if(this.isArrayEmpty(arr_name)){
			ret.set_any("");
			return;
		}

		var count = {};
		var max = {item: "", count: 0};
		for(var i = 0; i < this.arrays[arr_name].length; i++){
			var currentItem = this.arrays[arr_name][i].toString();
			if(count[currentItem]){
				count[currentItem] += 1;
			}else{
				count[currentItem] = 1;
			}
			if(count[currentItem] > max.count){
				max.item = currentItem;
				max.count = count[currentItem];
			}
		}
		ret.set_any(max.item);
		count = null;
		max = null;
	};

	Exps.prototype.Mean = function (ret, arr_name)
	{
		if(this.isArrayEmpty(arr_name)){
			ret.set_float(0);
			return;
		}
		var arr = this.arrays[arr_name];
		var count = 0;
		var total = 0;
		for(var i = 0; i < arr.length; i++){
			var n = arr[i];
			if(typeof n == "number"){
				total++;
				count+=n;
			}
		}
		ret.set_float(total == 0 ? 0 : count/total);
	};

	Exps.prototype.CurrentArray = function (ret)
	{
		ret.set_string(this.current_arr);
	};

	Exps.prototype.CurrentIndex = function (ret)
	{
		ret.set_int(this.current_index);
	};

	Exps.prototype.CurrentValue = function (ret)
	{
		ret.set_any(this.current_value);
	};


	
	pluginProto.exps = new Exps();

}());