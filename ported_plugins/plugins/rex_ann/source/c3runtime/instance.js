"use strict";

{
	C3.Plugins.Rex_ANN.Instance = class Rex_ANNInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this.ann = new C3.Plugins.Rex_ANN.ANNKlass(0,0,0);
		    this.ann.SetRate(properties[0]);  
		    this.ann.SetMoment(properties[1]); 
		    
		    var in_vars = properties[2]; 
		    if (in_vars != "")
		    {
		        if (in_vars.charAt(0) != "[")
		            in_vars = "["+in_vars+"]";        
		        this.ann.DefineInput(JSON.parse(in_vars));         
		    }
		    
		    this.ann.DefineHiddenNode(properties[3]); 
		    
		    var out_vars = properties[4]; 
		    if (out_vars != "")
		    {
		        if (out_vars.charAt(0) != "[")
		            out_vars = "["+out_vars+"]";        
		        this.ann.DefineOutput(JSON.parse(out_vars));         
		    }	     
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"ann": this.ann.saveToJSON(),
			};
		}
		
		LoadFromJson(o)
		{
			this.ann.loadFromJSON(o["ann"]);
		}
	};
}