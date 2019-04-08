"use strict";

{
	C3.Plugins.Rex_CSV.Instance = class Rex_CSVInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			
			if (properties)		// note properties may be null in some cases
			{
				this.strDelimiter = properties[0];
	        	this.isEvalMode = (properties[1] == 1);
			}
		    //this.isInPreview = (typeof cr_is_preview !== "undefined");  

	        this.tables = {};
	        this.currentPageName = null;
	        this.currentTable = null;
	        this.forPage = "";
	        this.atCol = "";
	        this.atRow = "";  
	        this.atPage = "";  
	        
	        // turn to default page "_"
	        this.TurnPage("_");          
	        this.checkName = "CSV";   
	        
	        /**BEGIN-PREVIEWONLY**/
	        this.dbg = {
	            "pageName": "_",
	            "colName" : ""
	        };      
	        /**END-PREVIEWONLY**/  
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
		    var page, tables={};
		    for (page in this.tables)	   
	        {
	            this.TurnPage(page);
		        tables[page] = {"d":this.currentTable.table, 
				                "k":this.currentTable.keys, 
								"i":this.currentTable.items}
			}
			return {
				"d": tables,
         		"delimiter": this.strDelimiter,
			};
		}
		
		LoadFromJson(o)
		{
		    var tables = o["d"], table;
			var page;
			for (page in tables)
			{
			    this.TurnPage(page);
			    table = tables[page];
				this.currentTable.table = table["d"];
				this.currentTable.keys = table["k"];
				this.currentTable.items = table["i"];
			}
	        
	        this.strDelimiter = o["delimiter"];
		}
		getValue(v)
		{
		    if (v == null)
		        v = 0;
		    else if (this.isEvalMode)
		        v = eval("("+v+")");
	        
	        return v;
		}	

		HasPage(page)
		{  
		    return (this.tables[page] != null);     
		}
		
		TurnPage(page)
		{  
	        if (this.currentPageName === page)
	            return;
	        
	        if (!this.HasPage(page))
	        {
	            this.tables[page] = new C3.Plugins.Rex_CSV.CSVKlass(this);
	        }    
	        this.currentPageName = page;
	        this.currentTable = this.tables[page];       
		}

		Get (col, row, page)
		{
	        this.atCol = col;
	        this.atRow = row;
	        if (page != null)
	        {
	            this.TurnPage(page);
	        }
	        this.atPage = this.currentPageName;  
	        return this.currentTable.At(col,row);
		}

		Set (value, col, row, page)
		{
	        this.atCol = col;
	        this.atRow = row;
	        if (page != null)
	        {
	            this.TurnPage(page);
	        }
	        this.atPage = this.currentPageName;  
	        this.currentTable.SetCell(col, row, value);       
		}

		GetColCnt (page)
		{
	        if (page != null)
	        {
	            this.TurnPage(page);
	        }
	        this.atPage = this.currentPageName;  
	        return this.currentTable.GetColCnt();   
		}

		GetRowCnt (page)
		{
	        if (page != null)
	        {
	            this.TurnPage(page);
	        }
	        this.atPage = this.currentPageName;  
	        return this.currentTable.GetRowCnt();   
		} 

		TableToString (page)
		{
	        if (page != null)
	        {
	            this.TurnPage(page);
	        }
	        return this.currentTable.ToString();   
		}

	};
}