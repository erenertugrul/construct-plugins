"use strict";
    var ORDER_TYPES = ["desc", "asec", "logicaldesc", "logical"];
    var COMPARE_TYPES = ["is", "!is", "gt", "lt", "gte", "lte"];
    var CSVToArray = function (strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [
            []
        ];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
            ) {

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);

            }


            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );

            } else {

                // We found a non-quoted value.
                var strMatchedValue = arrMatches[3];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }

        // Return the parsed data.
        return (arrData);
    };
    var getEvalValue = function (v, prefix) {
        if (v == null)
            v = 0;
        else {
            try {
                v = eval("(" + v + ")");
            } catch (e) {
                if (prefix == null)
                    prefix = "";
                console.error("TaffyDB: Eval " + prefix + " : " + v + " failed");
                v = 0;
            }
        }
        return v;
    };
    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); // basic html escaping
        return json
            /*.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'red';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'blue';
                    } else {
                        cls = 'green';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'Sienna';
                } else if (/null/.test(match)) {
                    cls = 'gray';
                }
                return '<span style="color:' + cls + ';">' + match + '</span>';
            })
            .replace(/\t/g, "&nbsp;&nbsp;") // to keep indentation in html
            .replace(/\n/g, "<br/>"); // to keep line break in html*/
    };
    var color_JSON = function (o) {
        var val = syntaxHighlight(JSON.stringify(o));
        //return "<span style=\"cursor:text;-webkit-user-select: text;-khtml-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text;\">" + val + "</style>";
    	return val;
    };
    var clean_table = function (o) {
        for (var k in o)
            delete o[k];
    };

    var is_empty = function (o) {
        for (var k in o)
            return false;

        return true;
    };

    var getValue = function (keys, root) {
        if ((keys == null) || (keys === "") || (keys.length === 0)) {
            return root;
        } else if (typeof (root) != 'object') {
            return root;
        } else {
            if (typeof (keys) === "string"){
                keys = keys.split(".");
            }

            var i, cnt = keys.length,key;
            // todo fix 
            var entry = root;
            for (i = 0; i < cnt; i++) {
                key = keys[i];
                if (entry.hasOwnProperty(key)){
                    entry = entry[key];
                }
                else{
                    return;
                }
            }
            return entry;
        }
    };

    var getItemValue = function (item, k, default_value) {
        return din(getValue(k, item), default_value);
    };

    var din = function (d, default_value) {
        var o;
        if (d === true)
            o = 1;
        else if (d === false)
            o = 0;
        else if (d == null) {
            if (default_value != null)
                o = default_value;
            else
                o = 0;
        } else if (typeof (d) == "object")
            o = JSON.stringify(d);
        else
            o = d;
        return o;
    };
   var process_filters = function (filters) {
        for (var k in filters) {
            if (filters[k].hasOwnProperty("regex")) {
                var regex = filters[k]["regex"];
                filters[k]["regex"] = new RegExp(regex[0], regex[1]);
            }
        }
        return filters;
    };
 var isEmptyTable = function (o) {
        for (var k in o)
            return false;

        return true;
    }
        var create_global_database = function (ownerUID, db_name, db_content) {
        if (C3.Plugins.Rex_taffydb.databases.hasOwnProperty(db_name))
            return;

        var db_ref = {
            db: window["TAFFY"](db_content),
            ownerID: ownerUID
        };
        C3.Plugins.Rex_taffydb.databases[db_name] = db_ref;
    };

    var get_global_database_reference = function (db_name) {
        return C3.Plugins.Rex_taffydb.databases[db_name];
    };

{
	
	C3.Plugins.Rex_taffydb.Instance = class Rex_taffydbInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			this.db_name = null;
			this.order_cond = null;
			if (properties)		// note properties may be null in some cases
			{
				this.LinkToDatabase(properties[0]);
	        	var index_keys_input = properties[1];
			}
			const b = this._runtime.Dispatcher();
       		this._disposables = new C3.CompositeDisposable(C3.Disposable.From(b, "instancedestroy", (a)=>this._OnInstanceDestroyed(a.instance)),C3.Disposable.From(b, "afterload", ()=>this._OnAfterLoad()))
	        if (index_keys_input === "") {
	           // if (!this.recycled)
	                this.indexKeys = [];
	            //else
	                this.indexKeys.length = 0;
	        } else {
	            this.indexKeys = index_keys_input.split(",");
	        }
			
	        // csv
	        this.keyType = {}; // 0=string, 1=number, 2=eval

	        // save
	        this.rowID = "";
	        this.preparedItem = {};
	       /* if (!this.recycled)*/
	            this.preprocessCmd = {};

	        this.preprocessCmd["inc"] = {};
	        this.preprocessCmd["max"] = {};
	        this.preprocessCmd["min"] = {};
	        this.hasPreprocessCmd = false;

	        // query
	        this.CleanFilters();
	        this.query_base = null;
	        this.query_flag = false;
	        this.current_rows = null;
	        this.filter_history = {
	            "flt": {},
	            "ord": ""
	        };
	        this.queriedRows = null;
	        // retrieve
	        this.exp_CurRowID = "";
	        this.exp_CurRowIndex = -1;
	        this.exp_LastSavedRowID = "";

	        // save/load
	        this.__flthis_save = null;
		}
		
		Release()
		{
			this.preprocessCmd = {};
            this.indexKeys = [];
            this.indexKeys.length = 0;
			super.Release();

		}
		SaveToJson()
		{

	        var db_save = null;
	        if (this.db_name === "")
	            db_save = this.db()["get"]();
	        else {
	            var database_ref = get_global_database_reference(this.db_name);
	            if (database_ref.ownerUID === null)
	                database_ref.ownerUID = this._uid;

	            if (database_ref.ownerUID === this._uid)
	                db_save = this.db()["get"]();
	        }

	        var cur_fflt = {
	            "flt": this.filters,
	            "ord": this.order_cond
	        };

	        var qIds = null;
	        if (this.queriedRows) {
	            var rows = this.queriedRows["get"]();
	            var i, cnt = rows.length;
	            qIds = [];
	            for (i = 0; i < cnt; i++)
	                qIds.push(rows[i]["___id"]);
	        }
	        return {
	            "rID": this.rowID,
	            "name": this.db_name,
	            "idxKeys": this.indexKeys,
	            "db": db_save,
	            "fltcur": cur_fflt,
	            "preCmd": this.preprocessCmd,
	            "prepItm": this.preparedItem,
	            "flthis": (this.queriedRows) ? this.filter_history : null,
	            "kt": this.keyType,
	        }
		}
	
		LoadFromJson(o)
		{
		 	this.rowID = o["rID"];
	        this.db_name = o["name"];
	        this.indexKeys = o["idxKeys"];
	        if (this.db_name === ""){
	            this.db = window["TAFFY"](o["db"]);
	        }
	        else {
	            if (o["db"] !== null) {
	                if (C3.Plugins.Rex_taffydb.databases.hasOwnProperty(this.db_name))
	                    delete C3.Plugins.Rex_taffydb.databases[this.db_name];

	                create_global_database(this._uid, this.db_name, o["db"]);
	            }
	        }
	        this.filters = o["fltcur"]["flt"];
	        this.order_cond = o["fltcur"]["ord"];
	        this.preprocessCmd = o["preCmd"];
	        this.preparedItem = o["prepItm"];
	        this.__flthis_save = o["flthis"];
	        this.keyType = o["kt"];
		}

		_OnAfterLoad()
		{
		 	if (this.db_name !== "") {
            	create_global_database(this._uid, this.db_name);
            	this.db = get_global_database_reference(this.db_name).db;
	        }

	        this.queriedRows = null;
	        var flthis = this.__flthis_save;
	        if (flthis) {
	            var q = this.db();
	            var flt = flthis["flt"];
	            if (!isEmptyTable(flt))
	                q = q["filter"](flt);

	            var ord = flthis["ord"];
	            if (ord !== "")
	                q = q["order"](ord);

	            this.queriedRows = q;
	            this.__flthis_save = null;
	        }
		}

		_OnInstanceDestroyed()
		{
	        this.indexKeys.length = 0;

	        clean_table(this.preparedItem);

	        clean_table(this.filters);
	        this.order_cond.length = 0;

	        if (this.db_name === "")
	            this.db()["remove"]();
	        else {
	            var database_ref = get_global_database_reference(this.db_name);
	            if (database_ref.ownerUID === this._uid)
	                database_ref.ownerUID = null;
	        }

	        this.preprocessCmd["inc"] = {};
	        this.preprocessCmd["max"] = {};
	        this.preprocessCmd["min"] = {};
		}



		GetDebuggerProperties() {
	        var prop = [];
	        var self = this,
            rows = this.db(),
            n;
            // 	"value": color_JSON(r),
	        var for_each_row = function (r, i) {
	            prop.push({
	                "name": "$" + i,
	                "value": color_JSON(r),
	                "html": true,
	                "readonly": true
	            });
	        };
	        rows["each"](for_each_row);

			return [
			{
				title: "TaffyDB",
				properties: prop
			}]
		}

	    LinkToDatabase(name) {
	        if (this.db_name === name)
	            return;
	        else if (this.db_name === "") {
	            // private -> public
	            this.db()["remove"]();
	        }

	        this.db_name = name;
	        if (name === "") // private database
	        {
	            this.db = window["TAFFY"]();
	        } else // public database
	        {
	            create_global_database(this._uid, name);
	            this.db = get_global_database_reference(name).db;
	        }
    	}
	    SaveRow(row, indexKeys, rowID, preprocessCmd) {
	        var invalid_rowID = (rowID == null) || (rowID === "");

	        // valid row ID
	        if (!invalid_rowID) {
	            var items = this.db(rowID);
	            var itemOld = items["first"]();
	            if (itemOld) {
	                row = this.buildUpdateItem(itemOld, row, preprocessCmd);
	                items["update"](row);
	            }
	        }

	        // insert a row
	        else if ((indexKeys == null) || (indexKeys.length === 0)) {
	            row = this.buildUpdateItem(null, row, preprocessCmd);
	            this.db["insert"](row);
	        }

	        // has index keys definition
	        else {
	            // build query item
	            var queryKeys = {},
	                keyName;
	            var i, cnt = this.indexKeys.length;
	            for (i = 0; i < cnt; i++) {
	                keyName = this.indexKeys[i];
	                if (row.hasOwnProperty(keyName)) {
	                    queryKeys[keyName] = row[keyName];
	                }
	            }

	            if (!is_empty(queryKeys)) {
	                var items = this.db(queryKeys);
	                var itemOld = items["first"]() || null;
	                row = this.buildUpdateItem(itemOld, row, preprocessCmd);
	                if (itemOld)
	                    items["update"](row);
	                else
	                    this.db["insert"](row);
	            }

	            // no index keys setting
	            else {
	                row = this.buildUpdateItem(null, row, preprocessCmd);
	                this.db["insert"](row);
	            }
	        }


	        if (row["___id"])
	            this.exp_LastSavedRowID = row["___id"];
	    }

	    buildUpdateItem(itemOld, preparedItem, preprocessCmd) {
	        if (!this.hasPreprocessCmd || (preprocessCmd == null))
	            return preparedItem;

	        var keys = preprocessCmd["inc"];
	        for (var k in keys) {
	            preparedItem[k] = getItemValue(itemOld, k, 0) + keys[k];
	            delete keys[k];
	        }

	        var keys = preprocessCmd["max"];
	        for (var k in keys) {
	            preparedItem[k] = Math.max(getItemValue(itemOld, k, 0), keys[k]);
	            delete keys[k];
	        }

	        var keys = preprocessCmd["min"];
	        for (var k in keys) {
	            preparedItem[k] = Math.min(getItemValue(itemOld, k, 0), keys[k]);
	            delete keys[k];
	        }

	        this.hasPreprocessCmd = false;
	        return preparedItem;
	    }

	    CleanFilters() {
	        this.filters = {};

	        if (this.order_cond == null){
	        	this.order_cond = [];
	        }
	        this.order_cond.length = 0;
	    }

	    NewFilters() {
	        this.query_base = null;
	        this.CleanFilters();
	        this.query_flag = true;
	    }
		AddValueComparsion(k, cmp, v) {
	        if (!this.filters.hasOwnProperty(k))
	            this.filters[k] = {};

	        this.filters[k][COMPARE_TYPES[cmp]] = v;
	        this.query_flag = true;
	    }

	    AddValueInclude(k, v) {
	        if (!this.filters.hasOwnProperty(k))
	            this.filters[k] = [];

	        this.filters[k].push(v);
	        this.query_flag = true;
	    }

	    AddRegexTest(k, s, f) {
	        if (!this.filters.hasOwnProperty(k))
	            this.filters[k] = {};

	        this.filters[k]["regex"] = [s, f];
	        this.query_flag = true;
	    }

	    AddOrder(k, order_) {
	        this.order_cond.push(k + " " + ORDER_TYPES[order_]);
	        this.query_flag = true;
	    }
	    
	    GetQueryResult() {
	        if (this.query_base == null) {
	            this.query_base = this.db();
	            this.filter_history["flt"] = {};
	            this.filter_history["ord"] = "";
	        }

	        var query_result = this.query_base;
	        if (!isEmptyTable(this.filters)) {
	            var filter_copy = JSON.parse(JSON.stringify(this.filters));
	            var filters = process_filters(this.filters);
	            query_result = query_result["filter"](filters);

	            for (var k in filter_copy)
	                this.filter_history["flt"][k] = filter_copy[k];
	        }
	        if (this.order_cond.length > 0) {
	            var ord = this.order_cond.join(", ");
	            this.filter_history["ord"] = ord;
	            query_result = query_result["order"](ord);
	        }

	        this.query_base = query_result;
	        this.CleanFilters();
	        return query_result;
	    }

	    GetCurrentQueriedRows() {
	        if (!this.queriedRows || this.query_flag) {
	            this.queriedRows = this.GetQueryResult();
	            this.query_flag = false;
	        }
	        return this.queriedRows;
	    }

	    Index2QueriedRowID(index_, default_value) {
	        var queriedRows = this.GetCurrentQueriedRows();
	        var row = queriedRows["get"]()[index_];
	        return getItemValue(row, "___id", default_value);
	    }
	};
	
}
