"use strict";

{
	C3.Behaviors.lunarray_LiteTween.Cnds =
	{
		IsActive()
		{
			return (this.tween_list["default"].state !== 0);
		},
		IsReversing()
		{
			return (this.tween_list["default"].state == 2);
		},
		CompareProgress(cmp, v)
		{
			var inst = this.tween_list["default"];
			return do_cmp((inst.progress / inst.duration), cmp, v);
		},
		OnThreshold(cmp, v)
		{
			var inst = this.tween_list["default"];
			this.threshold = (do_cmp((inst.progress / inst.duration), cmp, v)); 
			var ret = (this.oldthreshold != this.threshold) && (this.threshold); 
			if (ret) { 
			  this.oldthreshold = this.threshold;
			}
				return ret;
		},
		OnStart()
		{
			if (this.tween_list["default"] === undefined) 
 			return false;
			return this.tween_list["default"].onStart;  
		},
		OnReverseStart()
		{
			if (this.tween_list["default"] === undefined) 
  			return false;
			return this.tween_list["default"].onReverseStart; 
		},
		OnEnd()
		{
			if (this.tween_list["default"] === undefined) 
  			return false;
			return this.tween_list["default"].onEnd; 
		},
		OnReverseEnd()
		{
			if (this.tween_list["default"] === undefined) 
  			return false;
			return this.tween_list["default"].onReverseEnd;    
		}
	};
}