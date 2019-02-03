"use strict";

{
	C3.Plugins.Rex_taffydb.Exps =
	{
	    At() {
	        var primary_keys = {},
	            keyName;
	        var i, cnt = this.indexKeys.length;
	        for (i = 0; i < cnt; i++) {
	            keyName = this.indexKeys[i];
	            primary_keys[keyName] = arguments[i + 1];
	        }
	        var row = this.db(primary_keys)["first"]();
	        var k = arguments[cnt + 1];
	        var default_value = arguments[cnt + 2];
	        return getItemValue(row, k, default_value);
	    },

	    CurRowContent(k, default_value) {
	        var row = this.db(this.exp_CurRowID)["get"]()[0];
	        return getItemValue(row, k, default_value);
	    },

	    Index2QueriedRowContent(i, k, default_value) {
	        var queriedRows = this.GetCurrentQueriedRows();
	        var row = queriedRows["get"]()[i];
	        return getItemValue(row, k, default_value);
	    },

	    QueriedRowsCount() {
	        var queriedRows = this.GetCurrentQueriedRows();
	        return queriedRows["count"]();
	    },

	    QueriedSum(k) {
	        var queriedRows = this.GetCurrentQueriedRows();
	        return queriedRows["sum"](k);
	    },

	    QueriedMin(k) {
	        var queriedRows = this.GetCurrentQueriedRows();
	        return queriedRows["min"](k);
	    },

	    QueriedMax(k) {
	        var queriedRows = this.GetCurrentQueriedRows();
	        return queriedRows["max"](k);
	    },
	    QueriedRowsAsJSON() {
	        var queriedRows = this.GetCurrentQueriedRows();
	        return queriedRows["stringify"]();
	    },
	    KeyRowID() {
	        return "___id";
	    },
	    LastSavedRowID() {
	        return this.exp_LastSavedRowID;
	    },
	    ID2RowContent(rowID, k, default_value) {
	        var row = this.db(rowID)["get"]()[0];
	        return getItemValue(row, k, default_value);
	    },
	    QueriedRowsIndex2RowID(index_) {
	        return this.Index2QueriedRowID(index_, "");
	    },
	    CurRowIndex() {
	        return this.exp_CurRowIndex;
	    },

	    CurRowID() {
	        return this.exp_CurRowID;
	    },

	    Index2QueriedRowID(index_) {
	        return this.Index2QueriedRowID(index_, "");
	    },


	    AllRowsAsJSON() {
	        return this.db()["stringify"]();
	    },
	    AllRowsCount() {
	        return this.db()["count"]();
	    },

	    DatabaseName() {
	        return this.db_name;
	    }

	};
	
}
