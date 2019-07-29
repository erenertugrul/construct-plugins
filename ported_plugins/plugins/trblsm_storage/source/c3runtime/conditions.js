"use strict";

{
	C3.Plugins.trblsm_storage.Cnds =
	{
		ForEachList(table) 
		{
			var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
			var current_event = current_frame.GetCurrentEvent();
			var solmod = current_event.GetSolModifiers();
			var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
			var c = this._runtime.GetEventSheetManager().GetEventStack();
			var p = this._runtime.GetEventStack(); 
			var h = c.Push(current_event);
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

			    this._runtime.GetEventSheetManager().PushCopySol(solmod);
		        current_event.Retrigger(current_frame,h);          
		        this._runtime.GetEventSheetManager().PopSol(solmod);
			}

			this.cur_for_clear();
			p.Pop();
			return false;
		},
		ForEachListWhere(table, field, expression, value) 
		{
			var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
			var current_event = current_frame.GetCurrentEvent();
			var solmod = current_event.GetSolModifiers();
			var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
			var c = this._runtime.GetEventSheetManager().GetEventStack();
			var p = this._runtime.GetEventStack(); 
			var h = c.Push(current_event);
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
			    this._runtime.GetEventSheetManager().PushCopySol(solmod);
		        current_event.Retrigger(current_frame,h);          
		        this._runtime.GetEventSheetManager().PopSol(solmod);
			}

			this.cur_for_clear();
			p.Pop();
			return false;
		},
		ForEachListCompareValue(field, expression, value) 
		{
			var table = this.cur_for.table;
			var list = this.cur_for.listName;
			return this.compareValue(this.Get(table, list, field), expression, value);
		},
		ForEachField(table, list) 
		{

			if (isset(this.storage[table]) === false || isset(this.storage[table][list]) === false) {
			    this.cur_for_clear();
			    return false;
			}

			var x = 1;
			var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
			var current_event = current_frame.GetCurrentEvent();
			var solmod = current_event.GetSolModifiers();
			var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
			var c = this._runtime.GetEventSheetManager().GetEventStack();
			var p = this._runtime.GetEventStack(); 
			var h = c.Push(current_event);
			this.cur_for.table = table;
			this.cur_for.listName = list;
			for (var i in this.storage[table][list]) {

			    if (this.cur_for.stopLoop) {
				this.cur_for_clear();
				break;
			    }

			    if (this.storage[table][list][i] === null) {
				this.cur_for_clear();
				continue;
			    }

			    this.cur_for.loopIndex = x++;
			    this.cur_for.field = i;
			    this.cur_for.fieldValue = this.storage[table][list][i];
			    this._runtime.GetEventSheetManager().PushCopySol(solmod);
		        current_event.Retrigger(current_frame,h);          
		        this._runtime.GetEventSheetManager().PopSol(solmod);
			}
			this.cur_for_clear();
			p.Pop();
			return false;
		},
		ForEachFieldWhere(table, list, expression, value) 
		{

			if (isset(this.storage[table]) === false || isset(this.storage[table][list]) === false) {
			    this.cur_for_clear();
			    return false;
			}

			var x = 1;
			var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
			var current_event = current_frame.GetCurrentEvent();
			var solmod = current_event.GetSolModifiers();
			var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
			var c = this._runtime.GetEventSheetManager().GetEventStack();
			var p = this._runtime.GetEventStack(); 
			var h = c.Push(current_event);
			for (var i in this.storage[table][list]) {
			    if (this.cur_for.stopLoop) {
				this.cur_for_clear();
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
			    this._runtime.GetEventSheetManager().PushCopySol(solmod);
		        current_event.Retrigger(current_frame,h);          
		        this._runtime.GetEventSheetManager().PopSol(solmod);
			}
			this.cur_for_clear();
			p.Pop();
			return false;
		},
		CompareTableCount(expression, count) 
		{
			return this.compareValue(this.table_count, expression, count)
		},
		CompareListCount(table, expression, count) 
		{
			if (isset(this.tableAttr[table]) && isset(this.tableAttr[table]['listCount'])) {
			    return this.compareValue(this.tableAttr[table]['listCount'], expression, count);
			} else {
			    return this.compareValue(0, expression, count);
			}
		},
		CompareFieldCount(table, list, expression, count) 
		{
			if (isset(this.tableAttr[table]) && isset(this.tableAttr[table][list]) && isset(this.tableAttr[table][list]['fieldCount'])) {
			    return this.compareValue(this.tableAttr[table][list]['fieldCount'], expression, count);
			} else {
			    return this.compareValue(0, expression, count);
			}
		},
		CompareValue(table, list, field, expression, value) 
		{
			return this.compareValue(this.Get(table, list, field), expression, value);
		},
		PickListByGroup(id) 
		{
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
			this.cur_for_clear();
			return false;
		},
		PickMinMaxField(table, list, minMax) 
		{
			var listObject = this.GetListObject(table, list);
			var current_event = current_frame.GetCurrentEvent();
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

	};
}