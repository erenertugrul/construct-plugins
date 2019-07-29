"use strict";

{
	C3.Plugins.trblsm_storage.Exps =
	{
		// the example expression
		Get(table, list, field) 
		{
			return(this.Get(table, list, field));
		},
		ReturnValue() 
		{
			return(this.cur_get);
		},
		CurrTable() 
		{
			return(this.cur_for.table);
		},
		CurrListKey() 
		{
			return(this.cur_for.listName);
		},
		CurrListValueAt(field) {
			var table = this.cur_for.table;
			var listName = this.cur_for.listName;

			return(isset(this.storage[table][listName][field]) ? this.storage[table][listName][field] : 0);
		},
		CurrFieldKey() 
		{
			return(this.cur_for.field);
		},
		CurrFieldValue() 
		{
			return(this.cur_for.fieldValue);
		},
		LoopIndex() 
		{
			return(this.cur_for.loopIndex);
		},
		TableCount() 
		{
			return(this.table_count);
		},
		ListCount(table) 
		{
			if (isset(this.tableAttr[table])) {
			    return(this.tableAttr[table]['listCount']);
			} else {
			    return(0);
			}
		},
		FieldCount(table, list) 
		{
			if (isset(this.tableAttr[table]) && isset(this.tableAttr[table][list])) {
			    return(this.tableAttr[table][list]['fieldCount']);
			} else {
			    return(0);
			}
		},
		AsJSON() 
		{
			return(json_encode(this.storage));
		},
		TableAsJSON(table) 
		{
			return(json_encode(this.GetTableObject(table)));
		},
		ListAsJSON(table, list) 
		{
			return(json_encode(this.GetListObject(table, list)));
		},
		ListAsDictionaryJSON(table, list) 
		{
			return(json_encode({"c2dictionary": true, "data": this.GetListObject(table, list)}));
		}	
	};
}