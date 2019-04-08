"use strict";

{
	C3.Plugins.Rex_CSV.Acts =
	{
		LoadCSV(csv_string)
		{         
	        this.currentTable._parsing(csv_string);
		},
	    
		SetCell(col, row, val)
		{
	        this.currentTable.SetCell(col, row, val);       
		},
	    
		Clear()
		{
			 this.currentTable.Clear();
		},    
	    
		ConvertRow(row, to_type)
		{
	         this.currentTable.ConvertRow(row, to_type);
		},   
	    
		TurnPage(page)
		{
	         this.TurnPage(page);
		},
	    
		StringToPage(JSON_string)
		{
	        this.currentTable.JSONString2Page(JSON_string);
		},    
	    
		StringToPage(JSON_string)
		{
	        this.currentTable.JSONString2Page(JSON_string);
		},   
	    
		AppendCol(col, init_value)
		{
	        this.currentTable.AppendCol(col, init_value);
		}, 
	    
		AppendRow(row, init_value)
		{
	        this.currentTable.AppendRow(row, init_value);
		}, 
	    
		RemoveCol(col)
		{
	        if (typeof (col) === "number")
	        {
	            var cols = this.currentTable.keys;
	            col = cols[col];
	        }
	        
	        this.currentTable.RemoveCol(col);
		}, 
	    
		RemoveRow(row)
		{
	        if (typeof (row) === "number")
	        {
	            var rows = this.currentTable.items;
	            row = rows[row];
	        }  
	        
	        this.currentTable.RemoveRow(row);
		},     
	    
		SetDelimiter(s)
		{
	        this.strDelimiter = s;
		}, 

		StringToAllTables(JSON_string)
		{   
		    var page;
		    var tables=JSON.parse(JSON_string);
		    for (page in tables)
		    {
		        this.TurnPage(page);
		        this.currentTable.JSONString2Page(tables[page]);
		    }
		},
	    
		SortCol(col, is_increasing)
		{
	        this.currentTable.SortCol(col, is_increasing);
		},
	    
		SortRow(row, is_increasing)
		{
	        this.currentTable.SortRow(row, is_increasing);
		}, 
	    
		SetCellAtPage(col, row, page, val)
		{
	        this.TurnPage(page);
	        this.currentTable.SetCell(col, row, val);       
		},
	    
		AddToCell(col, row, val)
		{
	        var value = this.Get(col, row) || 0;        
	        this.currentTable.SetCell(col, row, value + val);       
		},
	    
		AddToCellAtPage(col, row, page, val)
		{
	        var value = this.Get(col, row, page) || 0;  
	        this.TurnPage(page);
	        this.currentTable.SetCell(col, row, value + val);       
		},

		ConvertCol(col, to_type)
		{
	         this.currentTable.ConvertCol(col, to_type);
		}
	};
}