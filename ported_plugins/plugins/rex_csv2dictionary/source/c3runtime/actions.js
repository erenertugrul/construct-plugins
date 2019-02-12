"use strict";

{
	C3.Plugins.Rex_CSV2Dictionary.Acts =
	{
		CSV2Dictionary(csv_string, dict_objs)
		{  
		    	    
		    var dict_obj = dict_objs.GetFirstPicked().GetSdkInstance();
		    console.log(dict_obj);
		    var table = CSVToArray(csv_string, this.strDelimiter);        
			var i, cnt = table.length;
			if (cnt == 0){
			    return;	
			}
			    
			var entry, k, v;
			var add_key = C3.Plugins.Dictionary.Acts.AddKey;
			for (i=0; i<cnt; i++)
			{
			    entry = table[i];
			    k = entry[0];
			    v = this.value_get(entry[1]);
			    add_key.apply(dict_obj, [k, v]);
			}
		},
		SetDelimiter(s)
		{
	        this.strDelimiter = s;
		}
	};
}