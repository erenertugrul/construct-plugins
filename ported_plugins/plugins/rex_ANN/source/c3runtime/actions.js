"use strict";

{
	C3.Plugins.Rex_ANN.Acts =
	{
		SetRateMoment(r, m)
		{
		    this.ann.SetRate(r);  
		    this.ann.SetMoment(m);           
		},

		DefineInput(names_)
		{
			var a = names_.split(",");
		    this.ann.DefineInput(a);           
		},

		DefineOutput(names_)
		{
			var a = names_.split(",");
		    this.ann.DefineOutput(a);                                  
		},	

		DefineHiddenNode(n)
		{
		    this.ann.DefineHiddenNode(n);                        
		},

		SetInput(name_, value_)
		{
		    this.ann.SetInput(name_, value_);    
		},	

		SetTarget(name_, value_)
		{    
		    this.ann.SetTarget(name_, value_);    	                                 
		},	

		Train()
		{
		    this.ann.Train(); 	               
		},	

		Recall()
		{   
		    this.ann.Recall(); 	                                  
		},	

		ResetWeight()
		{   
		    this.ann.ResetWeight(); 	                                  
		},	

		JSONLoad(json_)
		{
			var o;
			
			try {
				o = JSON.parse(json_);
			}
			catch(e) { return; }
			
			this.LoadFromJson(o);
		},

		DefineInputByDict(dict_objs)
		{
		    this.ann.DefineInput(_dict2names(dict_objs));           
		},

		DefineOutputByDict(dict_objs)
		{
		    this.ann.DefineOutput(_dict2names(dict_objs));                                  
		}
	};
}