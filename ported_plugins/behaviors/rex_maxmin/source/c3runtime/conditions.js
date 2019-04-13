"use strict";

{
	C3.Behaviors.Rex_maxmin.Cnds =
	{
	    OnValueChanging()
		{
			return this.is_my_call;
		},

		CompareValue(cmp, s)
		{
			return do_cmp(this.value, cmp, s);
		},
		
	    IsValueChanged()
		{
			return (this.pre_value != this.value);
		},	

		CompareDeltaValue(cmp, s)
		{
		    var delta = this.value - this.pre_value;
			return do_cmp(delta, cmp, s);
		},	

		CompareBound(bound_type, cmp, s)
		{
		    var value = (bound_type == 1)? this.max : this.min;
			return do_cmp(value, cmp, s);
		}	
	};
}