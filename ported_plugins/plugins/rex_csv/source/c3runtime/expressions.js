"use strict";

{
	C3.Plugins.Rex_CSV.Exps =
	{

	    At(col, row, page, default_value)
	    {  
	        if (page != null)        
	            this.TurnPage(page);  
	        
	        if (typeof (col) === "number")
	        {
	            var cols = this.currentTable.keys;
	            col = cols[col];
	        }
	        if (typeof (row) === "number")
	        {
	            var rows = this.currentTable.items;
	            row = rows[row];
	        }        
	        
	        var value = this.Get(col, row, page);
	        if (value == null)
	            value = (default_value == null)? 0 : default_value;        
	        return(value);
	    }, 
	    
	    CurCol()
	    {
	        return(this.currentTable.forCol);
	    },
	    
	    CurRow()
	    {
	        return(this.currentTable.forRow);
	    },
	    
	    CurValue()
	    {
	        return(this.currentTable.At( this.currentTable.forCol, this.currentTable.forRow ));
	    }, 

	    AtCol()
	    {
	        return(this.atCol);
	    },
	    
	    AtRow()
	    {
	        return(this.atRow);
	    },   
	    
	    AtPage()
	    {
	        return(this.atPage);
	    }, 
	    
	    CurPage()
	    {
	        return(this.forPage);
	    },
	    
	    TableToString(page)
	    { 
	        return(this.TableToString(page));
	    },    
	    
	    ColCnt(page)
	    {
	        return(this.GetColCnt(page));
	    },
	    
	    RowCnt(page)
	    { 
	        return(this.GetRowCnt(page));
	    }, 
	    
	    Delimiter()
	    { 
	        return(this.strDelimiter);
	    }, 
	    
	    AllTalbesToString()
	    { 
	        var page, table2string={};
	        for (page in this.tables)       
	            table2string[page] = this.TableToString(page);        
	        return(JSON.stringify(table2string));
	    },
	    
	    TableToCSV()
	    { 
	        return(this.currentTable.ToCSVString());
	    },  
	    
	    NextCol(col)
	    { 
	        if (col == null) 
	            col = this.atCol;
	        
	        var cols = this.currentTable.keys;
	        var idx = cols.indexOf(col);
	        var next_col;
	        if (idx !== -1)
	            next_col = cols[idx+1];
	        
	        return(next_col || "");
	    },  
	    
	    PreviousCol(col)
	    { 
	        if (col == null) 
	            col = this.atCol;
	        
	        var cols = this.currentTable.keys;
	        var idx = cols.indexOf(col);
	        var next_col;
	        if (idx !== -1)
	            next_col = cols[idx-1];
	        
	        return(next_col || "");
	    },
	    
	    NextRow(row)
	    { 
	        if (row == null) 
	            row = this.atRow;
	        
	        var rows = this.currentTable.items;
	        var idx = rows.indexOf(row);
	        var next_row;
	        if (idx !== -1)
	            next_row = rows[idx+1];
	        
	        return(next_row || "");
	    },  
	    
	    PreviousRow(row)
	    { 
	        if (row == null) 
	            row = this.atRow;
	        
	        var rows = this.currentTable.items;
	        var idx = rows.indexOf(row);
	        var next_row;
	        if (idx !== -1)
	            next_row = rows[idx-1];
	        
	        return(next_row || "");
	    }
	};
}