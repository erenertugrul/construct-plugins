"use strict";

{
	C3.Plugins.trblsm_storage.Instance = class trblsm_storageInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
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
		    this.cur_for = {}
			this.cur_for.stopLoop = false;
			this.cur_for.listName = "";
			this.cur_for.table = "";
			this.cur_for.field = "";
			this.cur_for.value = "";
			this.cur_for.stopLoopDisable = false;
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				// data to be saved for savegames
			};
		}
		
		LoadFromJson(o)
		{
			// load state for savegames
		}
		GetDebuggerProperties()
		{
			const a =  [];
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
							a.push({"title": table + " - " + list, "properties": prop});
					    }
					}
			    }
			};
			return a;
		}
		cur_for_clear() 
		{
		    this.cur_for.listName = "";
		    this.cur_for.fields = {};
		    this.cur_for.field = "";
		    this.cur_for.fieldValue = 0;
		    this.cur_for.stopLoop = false;
		    this.cur_for.stopLoopDisable = false;
		    this.cur_for.table = "";
		}
		sort(list, key, ASC) 
		{

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
		compareValue(valueToCompare, expression, compareTo) 
		{
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

		Get(table, list, field) 
		{
			if (isset(this.storage[table]) && isset(this.storage[table][list]) && isset(this.storage[table][list][field])) {
			    return(this.storage[table][list][field]);
			} else {
			    return(0);
			}
		}
		SetValue(table, list, field, value) 
		{

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
		Merge(JSONString, table, list) 
		{

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
		ClearList(table, list) 
		{
			if (isset(this.storage[table]) && isset(this.storage[table][list])) {
			    this.storage[table][list] = {}
			    this.tableAttr[table][list]['fieldCount'] = 0;
			}
		}
		ClearTable(table) 
		{
			if (isset(this.storage[table])) {
			    this.storage[table] = {}
			    this.tableAttr[table]['listCount'] = 0;
			}
		}
		GetListObject(table, list) 
		{
			if (isset(this.storage[table]) && isset(this.storage[table][list])) {
			    return(this.storage[table][list]);
			} else {
			    return({});
			}
		}
		GetTableObject(table) 
		{
			if (isset(this.storage[table])) {
			    return(this.storage[table]);
			} else {
			    return({});
			}
		}
	};
}