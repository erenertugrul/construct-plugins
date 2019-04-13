"use strict";

{
	C3.Behaviors.Rex_maxmin.Acts =
	{
	    SetValue(v)
		{
	        this.set_value( v );
		},
		
	    SetMax(v)
		{
		    this.max = v;
	        this.value = this.set_value( this.value );
		},	
		
	    SetMin(v)
		{
		    this.min = v;
	        this.set_value( this.value );
		},
		
	    AddTo(v)
		{
	        this.set_value( this.value + v );
		},	
		
	    SubtractFrom(v)
		{
	        this.set_value( this.value - v );
		}	
	};
}