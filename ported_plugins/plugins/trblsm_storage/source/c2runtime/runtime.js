
assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.trblsm_storage = function (runtime) {
    this.runtime = runtime;
};

(function () {

    Extend(cr.plugins_.trblsm_storage.prototype, new PluginClass());

    function Extend(child, parent) {
	//BECAUSE PROTOTYPE IS UGLY.
	for (var i in parent) {
	    child[i] = parent[i];
	}
    }

    function PluginClass() {

	//Each instance uses this for refencing ACE objects global to this plugin
	var plugin = this;

	this.Instance = function (type) {

	    this.type = type;
	    this.runtime = type.runtime;

	    this.onCreate = function () {
		Extend(this, new plugin.InstanceObject());
	    }
	    this.onDestroy = function () {
		// called whenever an instance is destroyed
		// note the runtime may keep the object after this call for recycling; be sure
		// to release/recycle/reset any references to other objects in this function.
	    }
	    this.saveToJSON = function () {
		// called when saving the full state of the game
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
		    // e.g.
		    //"myValue": this.myValue
		};
	    }
	    this.loadFromJSON = function (o) {
		//called when loading the full state of the game
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	    }
	    this.draw = function (ctx) {
		// only called if a layout object - draw to a canvas 2D context
	    }
	    this.drawGL = function (glw) {
		// only called if a layout object in WebGL mode - draw to the WebGL context
		// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
		// directory or just copy what other plugins do.
	    };

	    // The comments around these functions ensure they are removed when exporting, since the
	    // debugger code is no longer relevant after publishing.
	    /**BEGIN-PREVIEWONLY**/
	    this.getDebuggerValues = function (propsections) {
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.

		for (var table in this.storage) {

		    for (var list in this.storage[table]) {
			var prop = new Array;
			var x = 0;
			for (var field in this.storage[table][list]) {
			    prop.push({"name": field, "value": this.storage[table][list][field]})
			    ++x;
			}
			if (this.debugStorage || (typeof this.debugTable[table] != 'undefined' && this.debugTable[table] === true) || (typeof this.debugList[table + list] != 'undefined' && this.debugList[table + list] === true)) {
			    if (typeof this.debugTableDisabled[table] == 'undefined') {
				propsections.push({"title": table + " - " + list, "properties": prop});
			    }
			}
		    }

		}
		return;
		propsections.push({
		    "title": "ActiveStorage",
		    "properties":
			    [{"name": "test", "value": 5, "more": 6}]
			    // Each property entry can use the following values:
			    // "name" (required): name of the property (must be unique within this section)
			    // "value" (required): a boolean, number or string for the value
			    // "html" (optional, default false): set to true to interpret the name and value
			    //									 as HTML strings rather than simple plain text
			    // "readonly" (optional, default false): set to true to disable editing the property

			    // Example:
			    // {"name": "My property", "value": this.myValue}

		});
	    };
	    this.onDebugValueEdited = function (header, name, value) {
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
		    this.myProperty = value;
	    };
	    /**END-PREVIEWONLY**/

	}
	this.Type = function (plugin) {

	    this.plugin = plugin;
	    this.runtime = plugin.runtime;

	    this.onCreate = function () {
	    };
	}

	//Common Helper Functions
	function json_encode(object) {
	    return JSON.stringify(object);
	}

	function json_decode(JSONstring) {
	    return JSON.parse(JSONstring);
	}

	function isset(object) {
	    if (typeof object !== 'undefined' && object !== null) {
		return true;
	    }
	    return false;
	}

	function is_array(object) {
	    if (typeof object === 'array' || typeof object === 'object') {
		return true;
	    }
	    return false;
	}

	function is_int(object, valueCheck) {

	    if (is_bool(valueCheck) == false) {
		valueCheck = false;
	    }
	    if (valueCheck) {
		var num = /^-?[0-9]+$/;
		if (num.test(object.toString())) {
		    return true;
		} else {
		    return false;
		}
	    }
	    if (typeof object == 'number' && object.toString() != 'NaN' && object.toString() != 'Infinity') {
		return true;
	    }
	    return false;
	}

	function is_string(object) {
	    if (typeof object == 'string') {
		return true;
	    }
	    return false;
	}

	function is_bool(object) {
	    if (typeof object == 'boolean') {
		return true;
	    }
	    return false;
	}

	function count(object) {

	    //I dont like relying on .length as it doesnt always work as expected

	    var x = 0;

	    if (is_array(object)) {
		for (var i in object) {
		    ++x;
		}
	    }

	    var charArray = new Array;

	    if (is_string(object)) {
		charArray = object.split('');
		for (var i in charArray) {
		    ++x;
		}
	    }

	    if (is_int(object)) {
		var string = object.toString();
		charArray = string.split('');
		for (var i in charArray) {
		    ++x;
		}
	    }

	    return x;
	}

	//Extension of the this.Instance() object. it helps to keeps custom code separate
	//Custom Objects, Functions and Variables local to each instance get placed in here. 
	this.InstanceObject = function () {

	    //Main Storage
	    this.storage = {};

	    //Properties
	    this.table_count = 0;
	    this.tableAttr = {};
	    this.debugStorage = false;
	    this.debugTable = {};
	    this.debugTableDisabled = {};
	    this.debugList = {};
	    this.cur_get = 0;
	    this.tags = {};

	    //Help Objects
	    this.cur_for = new function () {

		var cur_for_self = this;

		this.stopLoop = false;
		this.listName = "";
		this.table = "";
		this.field = "";
		this.value = "";
		this.stopLoopDisable = false;

		this.clear = function () {
		    cur_for_self.listName = "";
		    cur_for_self.fields = {};
		    cur_for_self.field = "";
		    cur_for_self.fieldValue = 0;
		    cur_for_self.stopLoop = false;
		    cur_for_self.stopLoopDisable = false;
		    cur_for_self.table = "";
		}
	    }

	    //HELPER FUNCTIONS
	    this.sort = function (list, key, ASC) {

		var sortASC = function (a, b) {

		    var aFilter = '';
		    var bFilter = '';

		    if (typeof a[key] === 'string' && typeof b[key] === 'string') {
			aFilter = a[key].toLowerCase();
			bFilter = b[key].toLowerCase();
		    } else {
			aFilter = a[key];
			bFilter = b[key];
		    }

		    return ((aFilter < bFilter) ? -1 : ((aFilter > bFilter) ? 1 : 0));
		}
		var sortDESC = function (a, b) {
		    var aFilter = '';
		    var bFilter = '';

		    if (typeof a[key] === 'string' && typeof b[key] === 'string') {
			aFilter = a[key].toLowerCase();
			bFilter = b[key].toLowerCase();
		    } else {
			aFilter = a[key];
			bFilter = b[key];
		    }
		    return ((aFilter > bFilter) ? -1 : ((aFilter < bFilter) ? 1 : 0));
		}

		var sortASCSingle = function (a, b) {
		    var aFilter = '';
		    var bFilter = '';

		    if (typeof a === 'string' && typeof b === 'string') {
			aFilter = a.toLowerCase();
			bFilter = b.toLowerCase();
		    } else {
			aFilter = a;
			bFilter = b;
		    }
		    return ((aFilter < bFilter) ? -1 : ((aFilter > bFilter) ? 1 : 0));
		}
		var sortDESCSingle = function (a, b) {
		    var aFilter = '';
		    var bFilter = '';

		    if (typeof a === 'string' && typeof b === 'string') {
			aFilter = a.toLowerCase();
			bFilter = b.toLowerCase();
		    } else {
			aFilter = a;
			bFilter = b;
		    }
		    return ((aFilter > bFilter) ? -1 : ((aFilter < bFilter) ? 1 : 0));
		}

		var sortArray = [];
		for (var i in list) {
		    sortArray.push(list[i]);
		}

		if (typeof ASC !== 'boolean') {
		    ASC = true;
		}

		if (ASC) {
		    if (key !== false) {
			sortArray.sort(sortASC);
		    } else {
			sortArray.sort(sortASCSingle);
		    }
		} else {
		    if (key !== false) {
			sortArray.sort(sortDESC);
		    } else {
			sortArray.sort(sortDESCSingle);
		    }
		}

		return sortArray;

	    }
	    this.compareValue = function (valueToCompare, expression, compareTo) {
		if (expression === 0) {
		    return valueToCompare == compareTo;
		} else if (expression === 1) {
		    return valueToCompare != compareTo;
		} else if (expression === 2) {
		    return valueToCompare < compareTo;
		} else if (expression === 3) {
		    return valueToCompare <= compareTo;
		} else if (expression === 4) {
		    return valueToCompare > compareTo;
		} else if (expression === 5) {
		    return valueToCompare >= compareTo;
		} else {
		    return false;
		}
	    }

	    //COMMON ACE FUNCTIONS
	    this.Get = function (table, list, field) {
		if (isset(this.storage[table]) && isset(this.storage[table][list]) && isset(this.storage[table][list][field])) {
		    return(this.storage[table][list][field]);
		} else {
		    return(0);
		}
	    }
	    this.SetValue = function (table, list, field, value) {

		if (isset(this.storage[table]) === false) {
		    this.storage[table] = {};
		    this.table_count++;
		    this.tableAttr[table] = {};
		    this.tableAttr[table]['listCount'] = 0;
		}

		if (isset(this.storage[table][list]) === false) {
		    this.storage[table][list] = {};
		    this.tableAttr[table]['listCount']++;
		    this.tableAttr[table][list] = {};
		    this.tableAttr[table][list]['fieldCount'] = 0;
		}

		if (isset(this.storage[table][list][field]) === false) {
		    this.tableAttr[table][list]['fieldCount']++;
		}

		this.storage[table][list][field] = value;
	    }
	    this.Merge = function (JSONString, table, list) {

		var data = json_decode(JSONString);

		if (typeof table === 'undefined') {
		    table = 'default';
		}
		if (typeof list === 'undefined') {
		    list = 'default';
		}

		for (var x in data) {

		    if (is_array(data[x])) {
			for (var y in data[x]) {
			    if (is_array(data[x][y])) {
				for (var z in data[x][y]) {
				    var value = data[x][y][z];
				    this.SetValue(x, y, z, value);
				}
			    } else {
				var value = data[x][y];
				this.SetValue(table, x, y, value);
			    }
			}
		    } else {
			var value = data[x];
			this.SetValue(table, list, x, value);
		    }
		}
	    }
	    this.ClearList = function (table, list) {
		if (isset(this.storage[table]) && isset(this.storage[table][list])) {
		    this.storage[table][list] = {}
		    this.tableAttr[table][list]['fieldCount'] = 0;
		}
	    }
	    this.ClearTable = function (table) {
		if (isset(this.storage[table])) {
		    this.storage[table] = {}
		    this.tableAttr[table]['listCount'] = 0;
		}
	    }
	    this.GetListObject = function (table, list) {
		if (isset(this.storage[table]) && isset(this.storage[table][list])) {
		    return(this.storage[table][list]);
		} else {
		    return({});
		}
	    }
	    this.GetTableObject = function (table) {
		if (isset(this.storage[table])) {
		    return(this.storage[table]);
		} else {
		    return({});
		}
	    }

	}

	//Plugin ACE's
	this.cnds = new function () {
	    this.ForEachList = function (table) {

		var current_event = this.runtime.getCurrentEventStack().current_event;
		var x = 1;

		for (var i in this.storage[table]) {

		    if (this.cur_for.stopLoop) {
			break;
		    }

		    if (isset(this.storage[table][i]) === false) {
			continue;
		    }

		    this.cur_for.table = table;
		    this.cur_for.listName = i;
		    this.cur_for.loopIndex = x++;

		    this.runtime.pushCopySol(current_event.solModifiers);
		    current_event.retrigger();
		    this.runtime.popSol(current_event.solModifiers);
		}

		this.cur_for.clear();

		return false;
	    }
	    this.ForEachListWhere = function (table, field, expression, value) {

//		if (isset(this.storage[table]) == false) {
//		    this.cur_for.clear();
//		    return false;
//		}

		var current_event = this.runtime.getCurrentEventStack().current_event;
		var x = 1;

		for (var i in this.storage[table]) {

		    if (this.cur_for.stopLoop) {
			break;
		    }

		    if (isset(this.storage[table][i]) === false) {
			continue;
		    }

		    if (this.compareValue(this.storage[table][i][field], expression, value) === false) {
			continue;
		    }

		    this.cur_for.table = table;
		    this.cur_for.listName = i;
		    this.cur_for.loopIndex = x++;
		    this.runtime.pushCopySol(current_event.solModifiers);
		    current_event.retrigger();
		    this.runtime.popSol(current_event.solModifiers);
		}

		this.cur_for.clear();
		return false;
	    }
	    this.ForEachListCompareValue = function (field, expression, value) {
		var table = this.cur_for.table;
		var list = this.cur_for.listName;
		return this.compareValue(this.Get(table, list, field), expression, value);
	    }
	    this.ForEachField = function (table, list) {

		if (isset(this.storage[table]) === false || isset(this.storage[table][list]) === false) {
		    this.cur_for.clear();
		    return false;
		}

		var x = 1;
		var current_event = this.runtime.getCurrentEventStack().current_event;
		this.cur_for.table = table;
		this.cur_for.listName = list;
		for (var i in this.storage[table][list]) {

		    if (this.cur_for.stopLoop) {
			this.cur_for.clear();
			break;
		    }

		    if (this.storage[table][list][i] === null) {
			this.cur_for.clear();
			continue;
		    }

		    this.cur_for.loopIndex = x++;
		    this.cur_for.field = i;
		    this.cur_for.fieldValue = this.storage[table][list][i];
		    this.runtime.pushCopySol(current_event.solModifiers);
		    current_event.retrigger();
		    this.runtime.popSol(current_event.solModifiers);
		}
		this.cur_for.clear();
		return false;
	    }
	    this.ForEachFieldWhere = function (table, list, expression, value) {

		if (isset(this.storage[table]) === false || isset(this.storage[table][list]) === false) {
		    this.cur_for.clear();
		    return false;
		}

		var x = 1;
		var current_event = this.runtime.getCurrentEventStack().current_event;
		for (var i in this.storage[table][list]) {
		    if (this.cur_for.stopLoop) {
			this.cur_for.clear();
			break;
		    }
		    if (this.storage[table][list][i] === null) {
			continue;
		    }
		    if (this.compareValue(this.storage[table][list][i], expression, value) === false) {
			continue;
		    }
		    this.cur_for.loopIndex = x++;
		    this.cur_for.field = i;
		    this.cur_for.fieldValue = this.storage[table][list][i];
		    this.runtime.pushCopySol(current_event.solModifiers);
		    current_event.retrigger();
		    this.runtime.popSol(current_event.solModifiers);
		}
		this.cur_for.clear();
		return false;
	    }
	    this.CompareTableCount = function (expression, count) {
		return this.compareValue(this.table_count, expression, count)
	    }
	    this.CompareListCount = function (table, expression, count) {
		if (isset(this.tableAttr[table]) && isset(this.tableAttr[table]['listCount'])) {
		    return this.compareValue(this.tableAttr[table]['listCount'], expression, count);
		} else {
		    return this.compareValue(0, expression, count);
		}
	    }
	    this.CompareFieldCount = function (table, list, expression, count) {
		if (isset(this.tableAttr[table]) && isset(this.tableAttr[table][list]) && isset(this.tableAttr[table][list]['fieldCount'])) {
		    return this.compareValue(this.tableAttr[table][list]['fieldCount'], expression, count);
		} else {
		    return this.compareValue(0, expression, count);
		}
	    }
	    this.CompareValue = function (table, list, field, expression, value) {
		return this.compareValue(this.Get(table, list, field), expression, value);
	    }
	    this.PickListByGroup = function (id) {
		if (isset(this.tags[id])) {

		    var current_event = this.runtime.getCurrentEventStack().current_event;
		    var x = 1;
		    for (var i in this.tags[id]) {
			var table = this.tags[id][i]['table'];
			var list = this.tags[id][i]['list'];

			for (var loopList in this.storage[table]) {
			    if (loopList == list) {
				if (this.cur_for.stopLoop) {
				    break;
				}

				if (isset(this.storage[table][loopList]) === false) {
				    continue;
				}
				this.cur_for.table = table;
				this.cur_for.listName = loopList;
				this.cur_for.loopIndex = x++;

				this.runtime.pushCopySol(current_event.solModifiers);
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			    }
			}
		    }
		}
		this.cur_for.clear();
		return false;
	    }
	    this.PickMinMaxField = function (table, list, minMax) {
		var listObject = this.GetListObject(table, list);
		var current_event = this.runtime.getCurrentEventStack().current_event;
		this.cur_for.table = table;
		this.cur_for.listName = list;
		this.cur_for.loopIndex = 1;
		//alert(table+" "+list);
		if (minMax == 0) {
		    var minValue = 999999;
		    for (var i in this.storage[table][list]) {

			if (this.storage[table][list][i] !== null && this.storage[table][list][i] < minValue) {
			    minValue = listObject[i];
			    this.cur_for.field = i;
			    this.cur_for.fieldValue = minValue;

			}
		    }
		}
		if (minMax == 1) {
		    var maxValue = -999999;
		    for (var i in listObject) {
			if (listObject[i] !== null && listObject[i] > maxValue) {
			    maxValue = listObject[i];
			    this.cur_for.field = i;
			    this.cur_for.fieldValue = maxValue;
			}
		    }
		}
		return true;
	    }
	}
	this.acts = new function () {
	    this.SetListGroup = function (table, list, id) {
		if (isset(this.tags[id]) === false) {
		    this.tags[id] = {}
		}
		this.tags[id][table + list] = {
		    table: table,
		    list: list
		}
	    }
	    this.SetValue = function (table, list, field, value) {
		this.SetValue(table, list, field, value);
	    }
	    this.AddToValue = function (table, list, field, value) {
		if (isset(this.storage[table]) && isset(this.storage[table][list]) && isset(this.storage[table][list][field])) {
		    this.storage[table][list][field] = this.storage[table][list][field] + value;
		} else {
		    this.SetValue(table, list, field, value);
		}
	    }
	    this.SubFromValue = function (table, list, field, value) {
		if (isset(this.storage[table]) && isset(this.storage[table][list]) && isset(this.storage[table][list][field])) {
		    this.storage[table][list][field] = this.storage[table][list][field] - value;
		} else {
		    this.SetValue(table, list, field, -value);
		}
	    }
	    this.DeleteField = function (table, list, field) {
		if (isset(this.storage[table]) && isset(this.storage[table][list]) && isset(this.storage[table][list][field])) {
		    this.storage[table][list][field] = null;
		    delete this.storage[table][list][field];
		    this.tableAttr[table][list]['fieldCount']--;
		}
	    }
	    this.DeleteList = function (table, list) {
		if (isset(this.storage[table]) && isset(this.storage[table][list])) {
		    this.storage[table][list] = null;
		    delete this.storage[table][list];
		    this.tableAttr[table]['listCount']--;
		}
	    }
	    this.ClearList = function (table, list) {
		this.ClearList(table, list);
	    }
	    this.DeleteTable = function (table) {
		if (isset(this.storage[table])) {
		    this.storage[table] = null;
		    delete this.storage[table];
		    this.table_count--;
		}
	    }
	    this.DeleteStorage = function () {
		this.storage = {};
	    }
	    this.MergeToStorage = function (JSONString) {
		this.Merge(JSONString);
	    }
	    this.MergeToTable = function (JSONString, table) {
		this.Merge(JSONString, table);
	    }
	    this.MergeToList = function (JSONString, table, list) {
		this.Merge(JSONString, table, list);
	    }
	    this.MergeDictionaryToList = function (JSONString, table, list) {
		var data = json_decode(JSONString);
		this.Merge(json_encode(data['data']), table, list);
	    }
	    this.MergeC2DEArray = function (JSONString,table) {
	
		var ob = json_decode(JSONString);

		if (isset(ob['firstRowIsColumnNames'])) {

		    var keys = {};
		    for (var i in ob['data'][0]) {
			keys[i] = ob['data'][0][i][0];
		    }
		    var x = 1;
		    var y = 0;
		    var object = {};

		    while (x < count(ob['data'])) {
			object[y] = {};
			for (var i in ob['data'][x]) {
			    object[y.toString()][keys[i].toString()] = ob['data'][x][i][0]
			}
			++y;
			++x;
		    }
		    this.Merge(json_encode(object),table);

		}

	    }
	    this.DebugStorage = function () {
		this.debugStorage = true;
	    }
	    this.DebugTable = function (table) {
		this.debugTable[table] = true;
	    }
	    this.DebugTableDisabled = function (table) {
		this.debugTableDisabled[table] = true;
	    }
	    this.DebugList = function (table, list) {
		this.debugList[table + list] = true;
	    }
	    this.StopLoop = function () {
		this.cur_for.stopLoop = true;
	    }
	    this.SetCurrFieldValue = function (value) {
		var table = this.cur_for.table;
		var list = this.cur_for.listName;
		var field = this.cur_for.field;
		this.SetValue(table, list, field, value);
	    }
	    this.SetCurrListValueAt = function (field, value) {
		var table = this.cur_for.table;
		var list = this.cur_for.listName;
		this.SetValue(table, list, field, value);
	    }
	    this.SortList = function (table, list, ASC) {
		ASC = ASC == 0 ? true : false;
		var listObject = this.GetListObject(table, list);

		var sortObject = {}
		var x = 0;
		for (var i in listObject) {
		    sortObject[x] = {};
		    sortObject[x]['key'] = i;
		    sortObject[x]['value'] = listObject[i];
		    ++x;
		}

		listObject = this.sort(sortObject, 'value', ASC);
		this.ClearList(table, list);
		for (var i in listObject) {
		    this.SetValue(table, list, listObject[i]['key'], listObject[i]['value']);
		}
	    }
	    this.SortTable = function (table, field, ASC) {
		ASC = ASC == 0 ? true : false;
		var tableObject = this.GetTableObject(table);
		var sortObject = {}
		var x = 0;
		for (var i in tableObject) {
		    sortObject[x] = {};
		    sortObject[x]['key'] = i;
		    sortObject[x]['value'] = tableObject[i][field];
		    sortObject[x]['data'] = json_encode(tableObject[i]);
		    ++x;
		}
		tableObject = this.sort(sortObject, 'value', ASC);
		this.ClearTable(table);
		for (var i in tableObject) {
		    this.Merge(tableObject[i]['data'], table, tableObject[i]['key'])
		}
	    }
	    this.CreateListFromFields = function (field, FromTable, ToList, ToTable) {
		var tableObject = this.GetTableObject(FromTable);
		var newList = new Array;
		for (var i in tableObject) {
		    newList[i] = tableObject[i][field];
		}
		this.Merge(json_encode(newList), ToTable, ToList);
	    }
	    //ReturnValue Functions
	    this.Get = function (table, list, field) {
		this.cur_get = this.Get(table, list, field);
	    }
	    this.ListAsDictionaryJSON = function (table, list) {
		this.cur_get = json_encode({"c2dictionary": true, "data": this.GetListObject(table, list)});
	    }
	}
	this.exps = new function () {
	    this.Get = function (ret, table, list, field) {
		ret.set_any(this.Get(table, list, field));
	    }
	    this.ReturnValue = function (ret) {
		ret.set_any(this.cur_get);
	    }
	    this.CurrTable = function (ret) {
		ret.set_string(this.cur_for.table);
	    }
	    this.CurrListKey = function (ret) {
		ret.set_string(this.cur_for.listName);
	    };
	    this.CurrListValueAt = function (ret, field) {
		var table = this.cur_for.table;
		var listName = this.cur_for.listName;

		ret.set_any(isset(this.storage[table][listName][field]) ? this.storage[table][listName][field] : 0);
	    };
	    this.CurrFieldKey = function (ret) {
		ret.set_string(this.cur_for.field);
	    };
	    this.CurrFieldValue = function (ret) {
		ret.set_any(this.cur_for.fieldValue);
	    };
	    this.LoopIndex = function (ret) {
		ret.set_int(this.cur_for.loopIndex);
	    };
	    this.TableCount = function (ret) {
		ret.set_int(this.table_count);
	    };
	    this.ListCount = function (ret, table) {
		if (isset(this.tableAttr[table])) {
		    ret.set_int(this.tableAttr[table]['listCount']);
		} else {
		    ret.set_int(0);
		}
	    };
	    this.FieldCount = function (ret, table, list) {
		if (isset(this.tableAttr[table]) && isset(this.tableAttr[table][list])) {
		    ret.set_int(this.tableAttr[table][list]['fieldCount']);
		} else {
		    ret.set_int(0);
		}
	    };
	    this.AsJSON = function (ret) {
		ret.set_string(json_encode(this.storage));
	    };
	    this.TableAsJSON = function (ret, table) {
		ret.set_string(json_encode(this.GetTableObject(table)));
	    };
	    this.ListAsJSON = function (ret, table, list) {
		ret.set_string(json_encode(this.GetListObject(table, list)));
	    };
	    this.ListAsDictionaryJSON = function (ret, table, list) {
		ret.set_string(json_encode({"c2dictionary": true, "data": this.GetListObject(table, list)}));
	    }
	}
    }

}());