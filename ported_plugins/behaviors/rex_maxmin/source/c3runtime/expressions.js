"use strict";

{
	C3.Behaviors.Rex_maxmin.Exps =
	{
	 	Value()
		{
			return(this.value);
		}, 	
		
	 	Max()
		{
			return(this.max);
		},	
		
	 	Min()
		{
			return(this.min);
		},
		
	 	Percentage()
		{	   
			return( (this.value - this.min)/(this.max - this.min) );
		},	

	 	PreValue()
		{
			return(this.pre_value);
		} 	
	};
}