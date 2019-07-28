"use strict";

{
	C3.Plugins.Rex_ANN.Exps =
	{
		Output(var_name)
		{
			return(this.ann.GetOutput(var_name));
		}, 

		TrainErr()
		{
			return(this.ann.TrainErr);
		},

		Input(var_name)
		{
			return(this.ann.GetInput(var_name));
		},	

		AsJSON()
		{
			return(JSON.stringify(this.SaveToJson()));
		}
	};
}