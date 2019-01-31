"use strict";

{
	C3.Plugins.Rex_taffydb.Acts =
	{
    	InsertCSV(csv_string, is_eval, delimiter) {
	        is_eval = (is_eval === 1);
	        var csv_data = CSVToArray(csv_string, delimiter);
	        var col_keys = csv_data.shift(),
	            col_key;
	        var csv_row, row, cell_value;
	        var r, row_cnt = csv_data.length;
	        var c, col_cnt = col_keys.length;
	        var prefix; // for debug
	        for (r = 0; r < row_cnt; r++) {
	            csv_row = csv_data[r];
	            row = {};
	            for (c = 0; c < col_cnt; c++) {
	                col_key = col_keys[c];
	                cell_value = csv_row[c]; // string
	                prefix = " (" + r + "," + c + ") ";
	                if (is_eval)
	                    row[col_key] = getEvalValue(cell_value, prefix);
	                else {
	                    if (this.keyType.hasOwnProperty(col_key)) {
	                        var type = this.keyType[col_key];
	                        switch (type) {
	                            // case 0: // string
	                            case 1: // number
	                                cell_value = parseFloat(cell_value);
	                                break;
	                            case 2: // eval
	                                cell_value = getEvalValue(cell_value, prefix);
	                                break;
	                        }
	                    }

	                    row[col_key] = cell_value;
	                }
	            }
	            this.SaveRow(row, this.indexKeys);
	        }

	        clean_table(this.keyType);
    	},

	    InsertJSON(json_string) {
	        var rows;
	        try {
	            rows = JSON.parse(json_string);
	        } catch (err) {
	            return;
	        }

	        var i, cnt = rows.length;
	        for (i = 0; i < cnt; i++)
	            this.SaveRow(rows[i], this.indexKeys);
	    },

	    RemoveByRowID(rowID) {
	        this.db(rowID)["remove"]();
	    },

	    RemoveByRowIndex(index_) {
	        var rowID = this.Index2QueriedRowID(index_, null);
	        if (rowID === null)
	            return;

	        this.db(rowID)["remove"]();
	    },

	    SetIndexKeys(params_) {
	        C3.shallowAssignArray(this.indexKeys, params_.split(","));
	    },

	    RemoveAll() {
	        this.db()["remove"]();
	    },

	    SetValue(key_, value_, cond) {
	        if (cond === 0)
	            this.preparedItem[key_] = value_;
	        else {
	            var cmdName = (cond === 1) ? "max" : "min";
	            this.preprocessCmd[cmdName][key_] = value_;
	            this.hasPreprocessCmd = true;
	        }
	    },

	    SetBooleanValue(key_, is_true) {
	        this.preparedItem[key_] = (is_true === 1);
	    },

	    Save() {
	        this.SaveRow(this.preparedItem, this.indexKeys, this.rowID, this.preprocessCmd);

	        this.rowID = "";
	        this.preparedItem = {};
	    },

	    UpdateQueriedRows(key_, value_) {
	        var queriedRows = this.GetCurrentQueriedRows();
	        var item = {};
	        item[key_] = value_;
	        queriedRows["update"](item);
	    },

	    UpdateQueriedRows_BooleanValue(key_, is_true) {
	        var queriedRows = this.GetCurrentQueriedRows();
	        var item = {};
	        item[key_] = (is_true === 1);
	        queriedRows["update"](item);
	    },

	    SetRowID(rowID) {
	        this.rowID = rowID;
	    },

	    SetRowIndex(index_) {
	        this.rowID = this.Index2QueriedRowID(index_, null);
	    },

	    IncValue(key_, value_) {
	        this.preprocessCmd["inc"][key_] = value_;
	        this.hasPreprocessCmd = true;
	    },

	    SetJSON(key_, value_) {
	        this.preparedItem[key_] = JSON.parse(value_);
	    },

	    NewFilters() {
	        this.NewFilters();
	    },

	    AddValueComparsion(k, cmp, v) {
	        this.AddValueComparsion(k, cmp, v);
	    },

	    AddBooleanValueComparsion(k, v) {
	        this.AddValueComparsion(k, 0, (v === 1));
	    },

	    AddValueInclude(k, v) {
	        this.AddValueInclude(k, v);
	    },

	    AddRegexTest(k, s, f) {
	        this.AddRegexTest(k, s, f);
	    },

	    AddOrder(k, order_) {
	        this.AddOrder(k, order_);
	    },

	    RemoveQueriedRows() {
	        var queriedRows = this.queriedRows;
	        if (queriedRows == null)
	            queriedRows = this.db(this.filters);

	        queriedRows["remove"]();

	        this.queriedRows = null;
	        this.CleanFilters();
	    },

	    InsertCSV_DefineType(key_, type_) {
	        this.keyType[key_] = type_;
	    },

	    LinkToDatabase(name) {
	        this.LinkToDatabase(name);
	    }

	};
}
