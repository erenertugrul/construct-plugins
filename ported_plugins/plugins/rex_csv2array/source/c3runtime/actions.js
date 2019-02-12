"use strict";

{
	C3.Plugins.Rex_CSV2Array.Acts =
	{
	    CSV2Array(csv_string, array_objs, map_mode, z_index)
		{ 
		    	    
	        var array_obj = array_objs.GetFirstPicked().GetSdkInstance();
	        console.log(array_obj);
	        var table = CSVToArray(csv_string, this.strDelimiter);        
			var x_cnt = table.length;
			var y_cnt = table[0].length;
			
			if (z_index == null)
			{
			    z_index = 0;
			    if (map_mode == 0){
			        array_obj.SetSize(x_cnt,y_cnt,z_index+1);
			    }
		        else{
			        array_obj.SetSize(y_cnt,x_cnt,z_index+1);
		        }
			}
			else
			{
			    if (z_index < 0){
			        z_index = 0;
			    }
			    C3.Plugins.Arr.Exps.Depth.call(array_obj, fake_ret);	    
			    var z_cnt = Math.max(fake_ret.value, z_index+1);
			    if (map_mode == 0){
			        array_obj.SetSize(x_cnt,y_cnt,z_cnt);
			    }
		        else{
			        array_obj.SetSize(y_cnt,x_cnt,z_cnt);
		        }
			}
			    
	        var i,j,v;
			
			if (map_mode == 0)
			{
			    for(j=0;j<y_cnt;j++)
			    {
			        for(i=0;i<x_cnt;i++)
				    {
				        v = this.value_get(table[i][j]);
				        array_obj.Set(i,j,z_index,v);
				    }
			    }
	        }	
	        else
	        {
			    for(j=0;j<y_cnt;j++)
			    {
			        for(i=0;i<x_cnt;i++)
				    {
				        v = this.value_get(table[i][j]);
				        array_obj.Set(j,i,z_index,v);
				    }
			    }
	        }		
		},
    
		SetDelimiter(s)
		{
	        this.strDelimiter = s;
		}
	};
}