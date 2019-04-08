"use strict";

{
	C3.Plugins.Rex_CSV = class Rex_CSVPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
                        (function ()
            {
                C3.Plugins.Rex_CSV.CSVKlass = function(plugin)
                {
                    this.plugin = plugin;  
                    this.table = {};
                    this.keys = [];    // col name
                    this.items = [];   // row name
                    this.forCol = "";
                    this.forRow = "";        
                };
                var CSVKlassProto = C3.Plugins.Rex_CSV.CSVKlass.prototype;
                 
                CSVKlassProto.Clear = function()
                {        
                    var key;
                    for (key in this.table)
                        delete this.table[key];
                    this.keys.length = 0;
                    this.items.length = 0;
                };  
                
                CSVKlassProto.ToString = function()
                {
                    var save_data = {"table":this.table,
                                     "keys":this.keys,
                                     "items":this.items};
                    return JSON.stringify(save_data);   
                };
                
                CSVKlassProto.JSONString2Page = function(JSON_string)
                {
                    var save_data = JSON.parse(JSON_string);
                    try
                    {
                        this.table = save_data["table"];
                        this.keys = save_data["keys"];
                        this.items = save_data["items"];  
                    }
                    catch(err)  // compatible with older version
                    {
                        this.table = save_data;
                    }
                };

                CSVKlassProto._create_keys = function()
                {
                    var keys = this.keys;
                    var key_cnt = this.keys.length;        
                    var i, key;
                    for (i=0; i<key_cnt; i++)
                    {
                        key = keys[i];
                        if (this.table[key] == null)
                            this.table[key] = {};         
                    }
                };
                
                CSVKlassProto._create_items = function(values)
                {
                    var item_name = values.shift();
                    var keys = this.keys;
                    var key_cnt = this.keys.length;   
                    var table = this.table;
                    var i, v;
                    for (i=0; i<key_cnt; i++)
                    {
                        v = this.plugin.getValue(values[i]);
                        table[keys[i]][item_name] = v;        
                    }
                    this.items.push(item_name);
                }; 
                
                CSVKlassProto._parsing = function(csv_string)
                {
                    if (csv_string == "")
                        return;
                                   
                    var read_array = CSVToArray(csv_string, this.plugin.strDelimiter); 
                    
                    this.keys = read_array.shift();      
                    this._create_keys();
                    var item_cnt = read_array.length;
                    var i;
                    for (i=0; i<item_cnt; i++)
                    {
                        this._create_items(read_array[i]);
                    }      
                };  

                CSVKlassProto.At = function(col, row)
                {
                    var cell;
                    cell = this.table[col];
                    if (cell == null)
                    {
                        console.log("[CSV] Expression:At - Can not find col index '" +col+"' in table.");
                        return null;
                    }
                    cell = cell[row];
                    if (cell == null)
                    {
                        console.log("[CSV] Expression:At - Can not find row index " +row+" in table.");
                        return null;     
                    }
                    return cell;   
                };
                
                CSVKlassProto.SetCell = function (col, row, val)
                {
                    var cell;
                    cell = this.table[col];
                    if (cell == null)
                    {
                        console.log("[CSV] Action:SetCell - Can not find col index " +col+" in table.");
                        return;
                    }
                    cell = cell[row];
                    if (cell == null)
                    {
                        console.log("[CSV] Action:SetCell - Can not find row index " +row+" in table.");
                        return;     
                    }
                    this.table[col][row] = val;        
                };
                
                CSVKlassProto.ConvertCol = function (col, to_type)
                {
                    var handler = (to_type==0)? parseInt:
                                                parseFloat;
                    var items = this.items;
                    var item_cnt = items.length;
                    var table = this.table;
                    var i, val;
                    for (i=0; i<item_cnt; i++)
                    {
                        val = table[col][items[i]];
                        table[col][items[i]] = handler(val);        
                    }                    
                };      
                
                CSVKlassProto.ConvertRow = function (row, to_type)
                {
                    var handler = (to_type==0)? parseInt:
                                                parseFloat;
                    var keys = this.keys;
                    var key_cnt = keys.length;
                    var table = this.table;
                    var i, val;
                    for (i=0; i<key_cnt; i++)
                    {
                        val = table[keys[i]][row];
                        table[keys[i]][row] = handler(val);        
                    }                    
                };     
                
                CSVKlassProto.AppendCol = function (col, init_value)
                {
                    if (this.keys.indexOf(col) != (-1))
                        return;
                        
                    var has_ref = false;
                    if (this.keys.length > 0)
                    {
                        var ref_col = this.table[this.keys[0]];
                        has_ref = true;
                    }
                    var col_data = {};
                    var items = this.items;
                    var item_cnt = items.length;        
                    var i;
                    for (i=0; i<item_cnt; i++)
                    {
                        if (has_ref)
                        {
                            if (typeof ref_col[items[i]] == "number")
                                col_data[items[i]] = 0;
                            else
                                 col_data[items[i]] = "";
                        }
                        else
                            col_data[items[i]] = init_value;
                    }        
                    this.table[col] = col_data;
                    this.keys.push(col);
                };
                
                CSVKlassProto.AppendRow = function (row, init_value)
                {
                    if (this.items.indexOf(row) != (-1))
                        return;
                        
                    var keys = this.keys;
                    var key_cnt = keys.length;
                    var table = this.table;
                    var i;
                    for (i=0; i<key_cnt; i++)
                    {
                        table[keys[i]][row] = init_value;        
                    }   
                    this.items.push(row);
                };
                
                CSVKlassProto.RemoveCol = function (col)
                {
                    var col_index = this.keys.indexOf(col);
                    if (col_index == (-1))
                        return;

                    delete this.table[col]; 
                    this.keys.splice(col_index, 1);
                };
                
                CSVKlassProto.RemoveRow = function (row)
                {
                    var row_index = this.items.indexOf(row);
                    if (row_index == (-1))
                        return;
                        
                    var keys = this.keys;
                    var key_cnt = keys.length;
                    var table = this.table;
                    var i;
                    for (i=0; i<key_cnt; i++)
                    {
                        delete table[keys[i]][row];        
                    }   
                    this.items.splice(row_index, 1);
                };
                
                CSVKlassProto.ForEachCol = function ()
                {   
                    var current_frame = this.plugin._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
                    var current_event = current_frame.GetCurrentEvent();
                    var solmod = current_event.GetSolModifiers();
                    var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
                    var c = this.plugin._runtime.GetEventSheetManager().GetEventStack();
                    var p = this.plugin._runtime.GetEventStack(); 
                    var h = c.Push(current_event);
                            
                    this.forCol = "";
                    
                    var keys = this.keys;
                    var key_cnt = keys.length;
                    var i;
                    for (i=0; i<key_cnt; i++ )
                    {
                        if (solModifierAfterCnds)
                            this.plugin._runtime.GetEventSheetManager().PushCopySol(solmod);
                            
                        this.forCol = keys[i];              
                        current_event.Retrigger(current_frame,h);
                            
                        if (solModifierAfterCnds)
                            this.plugin._runtime.GetEventSheetManager().PopSol(solmod);
                    }
                    p.Pop();
                    this.forCol = "";
                };

                CSVKlassProto.ForEachRowInCol = function (col)
                {
                    var has_col_index = (this.keys.indexOf(col)!=(-1));
                    if (!has_col_index)
                    {
                        console.log("[CSV] Condition:For each row in col - Can not find col index " + col+" in table.");
                        return;     
                    }
                    this.forCol = col;
                        
                    // current_cell is valid
                    var current_frame = this.plugin._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
                    var current_event = current_frame.GetCurrentEvent();
                    var solmod = current_event.GetSolModifiers();
                    var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
                    var c = this.plugin._runtime.GetEventSheetManager().GetEventStack();
                    var p = this.plugin._runtime.GetEventStack(); 
                    var h = c.Push(current_event);

                    this.forRow = "";
                    
                    var items = this.items;
                    var item_cnt = items.length;
                    var i;
                    for (i=0; i<item_cnt; i++ )
                    {
                        if (solModifierAfterCnds)
                            this.plugin._runtime.GetEventSheetManager().PushCopySol(solmod);

                        this.forRow = items[i];             
                        current_event.Retrigger(current_frame,h);

                        if (solModifierAfterCnds)
                            this.plugin._runtime.GetEventSheetManager().PopSol(solmod);
                    }
                    p.Pop();
                    this.forRow = "";
                };   
                
                CSVKlassProto.ForEachRow = function ()
                {   
                    var current_frame = this.plugin._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
                    var current_event = current_frame.GetCurrentEvent();
                    var solmod = current_event.GetSolModifiers();
                    var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
                    var c = this.plugin._runtime.GetEventSheetManager().GetEventStack();
                    var p = this.plugin._runtime.GetEventStack(); 
                    var h = c.Push(current_event);
                    this.forRow = "";
                    
                    var items = this.items;
                    var item_cnt = items.length;
                    var i;
                    for (i=0; i<item_cnt; i++ )
                    {
                        if (solModifierAfterCnds)
                            this.plugin._runtime.GetEventSheetManager().PushCopySol(solmod);
                            
                        this.forRow = items[i];             
                        current_event.Retrigger(current_frame,h);   
                        if (solModifierAfterCnds)
                            this.plugin._runtime.GetEventSheetManager().PopSol(solmod);
                   }
                   p.Pop();       
                    this.forRow = "";
                }; 

                CSVKlassProto.ForEachColInRow = function (row)
                {
                    var has_row_index = (this.items.indexOf(row)!=(-1));
                    if (!has_row_index)
                    {
                        console.log("[CSV] Condition:For each row in col - Can not find row index "+row+" in table.");
                        return;         
                    }
                    this.forRow = row;
                        
                    // current_cell is valid
                    var current_frame = this.plugin._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
                    var current_event = current_frame.GetCurrentEvent();
                    var solmod = current_event.GetSolModifiers();
                    var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
                    var c = this.plugin._runtime.GetEventSheetManager().GetEventStack();
                    var p = this.plugin._runtime.GetEventStack(); 
                    var h = c.Push(current_event);
                    
                    this.forCol = "";
                    
                    var keys = this.keys;
                    var key_cnt = keys.length;
                    var i;
                    
                    for (i=0; i<key_cnt; i++ )
                    {        
                        if (solModifierAfterCnds)        
                            this.plugin._runtime.GetEventSheetManager().PushCopySol(solmod);
                            
                        this.forCol = keys[i];
                        current_event.Retrigger(current_frame,h);
                            
                        if (solModifierAfterCnds)                
                            this.plugin._runtime.GetEventSheetManager().PopSol(solmod);
                    }
                    p.Pop();
                    this.forCol = "";
                };
                    
                CSVKlassProto.GetColCnt = function()
                {
                    return this.keys.length;
                };
                    
                CSVKlassProto.GetRowCnt = function()
                {
                    return this.items.length;
                };
             
                var _row_sort = function(col0, col1)
                {        
                    var item0 = _sort_table[col0][_sort_row_name];
                    var item1 = _sort_table[col1][_sort_row_name]; 
                    return (item0 > item1) ? (_sort_is_increasing? 1:-1):
                           (item0 < item1) ? (_sort_is_increasing? -1:1):
                                             0;
                };
                CSVKlassProto.SortCol = function (col, sortMode_)  // 0=a, 1=d, 2=la, 3=ld
                {
                    var has_col_index = (this.keys.indexOf(col)!=(-1));
                    if (!has_col_index)
                    {
                        console.log("[CSV] Action:Sort Col - Can not find col index " + col+" in table.");
                        return;
                    }
                    
                    var self=this;
                    var sortFn = function (row0, row1)
                    {
                        var sortMode = sortMode_;
                        var v0 =  self.table[col][row0];
                        var v1 =  self.table[col][row1];
                        if (sortMode > 1)  // 2=la, 3=ld
                        {
                            v0 = parseFloat(v0);
                            v1 = parseFloat(v1);
                            sortMode -= 2;
                        }

                        return (v0 > v1) ? (sortMode? -1:1):
                                   (v0 < v1) ? (sortMode? 1:-1):
                                                     0;
                    }
                    this.items.sort(sortFn);
                };
                    
                CSVKlassProto.SortRow = function (row, sortMode_)
                {
                    var has_row_index = (this.items.indexOf(row)!=(-1));
                    if (!has_row_index)
                    {
                        console.log("[CSV] Action:Sort Row - Can not find row index "+row+" in table.");
                        return;        
                    }
                    var self=this;
                    var sortFn = function (col0, col1)
                    {
                        var sortMode = sortMode_;
                        var v0 = self.table[col0][row];
                        var v1 = self.table[col1][row]; 
                        if (sortMode > 1)  // 2=la, 3=ld
                        {
                            v0 = parseFloat(v0);
                            v1 = parseFloat(v1);
                            sortMode -= 2;
                        }

                        return (v0 > v1) ? (sortMode? -1:1):
                               (v0 < v1) ? (sortMode? 1:-1):
                                                     0;
                    }
                    this.keys.sort(sortFn); 
                };  
                
                var dump_lines = [];
                CSVKlassProto.ToCSVString = function ()
                {
                    var strDelimiter = this.plugin.strDelimiter;
                    var isEvalMode = this.plugin.isEvalMode;
                    
                    // first line = col name        
                    var l = "";
                    var k, kcnt = this.keys.length;        
                    for (k=0; k<kcnt; k++)
                    {
                        l += (strDelimiter + cell_string_get(this.keys[k], false, strDelimiter));
                    }
                    dump_lines.push(l);
                    
                    // other lines
                    var i, icnt = this.items.length;
                    for (i=0; i<icnt; i++)
                    {
                        l = cell_string_get(this.items[i], false, strDelimiter);
                        for (k=0; k<kcnt; k++)
                        {
                            l += (strDelimiter + cell_string_get(this.table[this.keys[k]][this.items[i]], isEvalMode, strDelimiter));
                        }
                        dump_lines.push(l);
                    }
                    
                    var csvString = dump_lines.join("\n");
                    dump_lines.length = 0;
                    return csvString;
                };  
                
                var cell_string_get = function (value_, isEvalMode, strDelimiter)
                {
                    if (typeof(value_) == "number")
                        value_ = value_.toString();
                    else
                    {
                        if (isEvalMode)
                            value_ = '"' + value_ + '"';
                            
                        if (strDelimiter == null)
                            strDelimiter = ",";
                            
                        var need_add_quotes = (value_.indexOf(strDelimiter) != (-1)) ||
                                              (value_.indexOf("\n") != (-1));
                        // replace " to ""
                        if (value_.indexOf('"') != (-1))
                        {
                            var re = new RegExp('"', 'g');
                            value_ = value_.replace(re, '""');
                            need_add_quotes = true;
                        }
                        
                        // add ".." in these cases
                        if ( need_add_quotes)
                        {
                            value_ = '"' + value_ + '"';
                        }
                    }
                    
                    return value_;
                };        
                
                
                // copy from    
                // http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
                
                // This will parse a delimited string into an array of
                // arrays. The default delimiter is the comma, but this
                // can be overriden in the second argument.
                var CSVToArray = function ( strData, strDelimiter ){
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
                    var arrData = [[]];

                    // Create an array to hold our individual pattern
                    // matching groups.
                    var arrMatches = null;


                    // Keep looping over the regular expression matches
                    // until we can no longer find a match.
                    while (arrMatches = objPattern.exec( strData )){

                            // Get the delimiter that was found.
                            var strMatchedDelimiter = arrMatches[ 1 ];

                            // Check to see if the given delimiter has a length
                            // (is not the start of string) and if it matches
                            // field delimiter. If id does not, then we know
                            // that this delimiter is a row delimiter.
                            if (
                                    strMatchedDelimiter.length &&
                                    (strMatchedDelimiter != strDelimiter)
                                    ){

                                    // Since we have reached a new row of data,
                                    // add an empty row to our data array.
                                    arrData.push( [] );

                            }


                            // Now that we have our delimiter out of the way,
                            // let's check to see which kind of value we
                            // captured (quoted or unquoted).
                            if (arrMatches[ 2 ]){

                                    // We found a quoted value. When we capture
                                    // this value, unescape any double quotes.
                                    var strMatchedValue = arrMatches[ 2 ].replace(
                                            new RegExp( "\"\"", "g" ),
                                            "\""
                                            );

                            } else {

                                    // We found a non-quoted value.
                                    var strMatchedValue = arrMatches[ 3 ];

                            }


                            // Now that we have our value string, let's add
                            // it to the data array.
                            arrData[ arrData.length - 1 ].push( strMatchedValue );
                    }

                    // Return the parsed data.
                    return( arrData );
                };  
                
            }()); 
		}
		
		Release()
		{
			super.Release();

		}
	};
}