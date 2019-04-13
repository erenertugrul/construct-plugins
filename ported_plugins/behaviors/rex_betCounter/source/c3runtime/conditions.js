"use strict";

{
	C3.Behaviors.Rex_betCounter.Cnds =
	{
		CompareBetCount(cmp, c)
		{
			return do_cmp(this.beat_recorder.length, cmp, c);
		},
	    
		OnValueChanged(from_, to_)
		{
	        if (from_ == null)
	            return true;
	        else 
	            return (from_ == this.pre_value) && (to_ == this.beat_recorder.length);
		}    
	};
}