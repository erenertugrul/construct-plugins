"use strict";

{
	C3.Behaviors.lunarray_LiteTween.Exps =
	{
		State()
		{
		    var parsed = "N/A"; 
    		switch (this.tween_list["default"].state) {
			  	case 0: parsed = "paused"; break;
				case 1: parsed = "playing"; break;
				case 2: parsed = "reversing"; break;
				case 3: parsed = "seeking"; break;
	      		default:  break;
    		}
    		return parsed;
		},
		Progress()
		{
    		var progress = this.tween_list["default"].progress/this.tween_list["default"].duration; 
    		return progress;
		},
		Duration()
		{
    		return this.tween_list["default"].duration;
		},
		Target()
		{
		    var inst = this.tween_list["default"];
		    var parsed = "N/A"; 
		    switch (inst.tweened) {
		      case 0: parsed = inst.targetparam1; break;
		      case 1: parsed = inst.targetparam2; break;
		      case 2: parsed = inst.targetparam1; break;
		      case 3: parsed = inst.targetparam1; break;
		      case 4: parsed = inst.targetparam1; break;
		      case 5: parsed = inst.targetparam2; break;
		      case 6: parsed = inst.targetparam1; break;
		      default:  break;
	    	}
		    return parsed;
		},
		Value()
		{
   			var tval = this.value; 
    		return tval;
		},
		Tween(a_, b_, x_, easefunc_)
		{
	    	var currX = (x_>1.0?1.0:x_);
	    	var factor = easeFunc(easefunc_, currX<0.0?0.0:currX, 0.0, 1.0, 1.0, false, false);
	   		 return a_ + factor * (b_-a_);
		}
	};
}