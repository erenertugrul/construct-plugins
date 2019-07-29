"use strict";

{
	C3.Plugins.trblsm_storage.Acts =
	{
		// the example action
		SetListGroup(table, list, id) 
		{
			if (isset(this.tags[id]) === false) {
			    this.tags[id] = {}
			}
			this.tags[id][table + list] = {
			    table: table,
			    list: list
			}
		},
		SetValue(table, list, field, value) 
		{
			this.SetValue(table, list, field, value);
		},
		AddToValue(table, list, field, value) 
		{
			if (isset(this.storage[table]) && isset(this.storage[table][list]) && isset(this.storage[table][list][field])) {
			    this.storage[table][list][field] = this.storage[table][list][field] + value;
			} else {
			    this.SetValue(table, list, field, value);
			}
		},
		SubFromValue(table, list, field, value) 
		{
			if (isset(this.storage[table]) && isset(this.storage[table][list]) && isset(this.storage[table][list][field])) {
			    this.storage[table][list][field] = this.storage[table][list][field] - value;
			} else {
			    this.SetValue(table, list, field, -value);
			}
		},
		DeleteField(table, list, field) 
		{
			if (isset(this.storage[table]) && isset(this.storage[table][list]) && isset(this.storage[table][list][field])) {
			    this.storage[table][list][field] = null;
			    this.tableAttr[table][list]['fieldCount']--;
			}
		},
		DeleteList(table, list) 
		{
			if (isset(this.storage[table]) && isset(this.storage[table][list])) {
			    this.storage[table][list] = null
			    this.tableAttr[table]['listCount']--;
			}
		},
		ClearList(table, list) 
		{
			this.ClearList(table, list);
		},
		DeleteTable(table) 
		{
			if (isset(this.storage[table])) {
			    this.storage[table] = null;
			    this.table_count--;
			}
		},
		DeleteStorage() 
		{
			this.storage = {};
		},
		MergeToStorage(JSONString) 
		{
			this.Merge(JSONString);
		},
		MergeToTable(JSONString, table) 
		{
			this.Merge(JSONString, table);
		},
		MergeToList(JSONString, table, list) 
		{
			this.Merge(JSONString, table, list);
		},
		MergeDictionaryToList(JSONString, table, list) 
		{
			var data = json_decode(JSONString);
			this.Merge(json_encode(data['data']), table, list);
		},
		MergeC2DEArray(JSONString,table) 
		{

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

		},
		DebugStorage() 
		{
			this.debugStorage = true;
		},
		DebugTable(table) 
		{
			this.debugTable[table] = true;
		},
		DebugTableDisabled(table) 
		{
			this.debugTableDisabled[table] = true;
		},
		DebugList(table, list) 
		{
			this.debugList[table + list] = true;
		},
		StopLoop() 
		{
			this.cur_for.stopLoop = true;
		},
		SetCurrFieldValue(value) 
		{
			var table = this.cur_for.table;
			var list = this.cur_for.listName;
			var field = this.cur_for.field;
			this.SetValue(table, list, field, value);
		},
		SetCurrListValueAt(field, value) 
		{
			var table = this.cur_for.table;
			var list = this.cur_for.listName;
			this.SetValue(table, list, field, value);
		},
		SortList(table, list, ASC) 
		{
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
		},
		SortTable(table, field, ASC) 
		{
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
		},
		CreateListFromFields(field, FromTable, ToList, ToTable) 
		{
			var tableObject = this.GetTableObject(FromTable);
			var newList = new Array;
			for (var i in tableObject) {
			    newList[i] = tableObject[i][field];
			}
			this.Merge(json_encode(newList), ToTable, ToList);
		},
		//ReturnValue Functions
		Get(table, list, field) 
		{
			this.cur_get = this.Get(table, list, field);
		},
		ListAsDictionaryJSON(table, list) 
		{
			this.cur_get = json_encode({"c2dictionary": true, "data": this.GetListObject(table, list)});
		}

	};
}