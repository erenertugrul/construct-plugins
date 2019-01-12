"use strict";

{
	C3.Behaviors.lunarray_LiteTween.Acts =
	{
		Start(startmode, current)
		{
	   	 	this.threshold = false;
   			this.oldthreshold = false;
    		this.useCurrent = (current == 1);
    		this.startTween(startmode);
		},
		Stop(stopmode)
		{
			this.stopTween(stopmode);
		},
		Reverse(revMode)
		{
		    this.threshold = false;
		    this.oldthreshold = false;
		    this.reverseTween(revMode);
		},
		ProgressTo(progress)
		{
			this.setProgressTo(progress);
		},
		SetDuration(x)
		{
			if (isNaN(x)) return;
		 	if (x < 0) return;
    		if (this.tween_list["default"] === undefined) return;
			this.tween_list["default"].duration = x;
		},
		SetEnforce(x)
		{
		    if (this.tween_list["default"] === undefined) return;
			this.tween_list["default"].enforce = (x===1);
		},
		SetInitial(x)
		{
	    	if (this.tween_list["default"] === undefined) return;
	    	var init = this.parseCurrent(this.tween_list["default"].tweened, x);
			this.tween_list["default"].setInitial(init);
		},
		SetTarget(targettype, absrel, x)
		{
		    if (this.tween_list["default"] === undefined) return;
		    if (isNaN(x)) return;
		    var inst = this.tween_list["default"];
		    var parsed = x + "";
		    this.targetmode = absrel;
		    var x1 = "";
		    var x2 = "";
		    if (absrel === 1) {
		      //relative
		      this.target = "relative(" + parsed + ")";
		      switch (targettype) {
		        case 0: x1 = (this.inst.GetX() + x); x2 = inst.targetparam2; break;
		        case 1: x1 = inst.targetparam1; x2 = (this.inst.GetY() + x); break;
		        case 2: x1 = "" + C3.toDegrees(this.inst.GetAngle() + C3.toRadians(x)); x2 = x1; break; //angle
		        case 3: x1 = "" + (this.inst.GetOpacity()*100) + x; x2 = x1; break; //opacity
		        case 4: x1 = (this.inst.GetWidth() + x); x2 = inst.targetparam2; break; //width
		        case 5: x1 = inst.targetparam1; x2 = (this.inst.GetHeight() + x); break; //height
		        case 6: x1 = x; x2 = x; break; //value
		        default:  break;
		      }
		      parsed = x1 + "," + x2;
		    } else {
		      switch (targettype) {
		        case 0: x1 = x; x2 = inst.targetparam2; break;
		        case 1: x1 = inst.targetparam1; x2 = x; break;
		        case 2: x1 = x; x2 = x; break; //angle
		        case 3: x1 = x; x2 = x; break; //opacity
		        case 4: x1 = x; x2 = inst.targetparam2; break; //width
		        case 5: x1 = inst.targetparam1; x2 = x; break; //height
		        case 6: x1 = x; x2 = x; break; //value
		        default:  break;
		      }
		      parsed = x1 + "," + x2;
		      this.target = parsed;
		    }
		    var init = this.parseCurrent(this.tween_list["default"].tweened, "current");
		    var targ = this.parseCurrent(this.tween_list["default"].tweened, parsed);
		 		inst.setInitial(init);
		 		inst.setTarget(targ);
		},
		SetTweenedProperty(x)
		{
	    	if (this.tween_list["default"] === undefined) return;
			this.tween_list["default"].tweened = x;
		},
		SetEasing(x)
		{
	    	if (this.tween_list["default"] === undefined) return;
			this.tween_list["default"].easefunc = x;
		},
	 	SetEasingParam(x, a, p, t, s)
		{
		    if (this.tween_list["default"] === undefined) return;
		    this.tween_list["default"].easingparam[x].optimized = false;
			this.tween_list["default"].easingparam[x].a = a;
			this.tween_list["default"].easingparam[x].p = p;
			this.tween_list["default"].easingparam[x].t = t;
			this.tween_list["default"].easingparam[x].s = s;
		},
	 	ResetEasingParam()
		{
    		if (this.tween_list["default"] === undefined) return;
    		this.tween_list["default"].optimized = true;
		},
	 	SetValue(x)
		{
    		var inst = this.tween_list["default"];
			this.value = x;
    		if (inst.tweened === 6)
      		inst.setInitial( this.parseCurrent(inst.tweened, "current") );
		},
		SetParameter(tweened, easefunction, target, duration, enforce)
		{
	    	if (this.tween_list["default"] === undefined) {
	      		this.addToTweenList("default", tweened, easefunction, initial, target, duration, enforce, 0);
	    	} 
	    	else {
		      var inst = this.tween_list["default"];
		      inst.tweened = tweened; 
		  		inst.easefunc = easefunction;
		      inst.setInitial( this.parseCurrent(tweened, "current") );
		      inst.setTarget( this.parseCurrent(tweened, target) );
		      inst.duration = duration; 
		      inst.enforce = (enforce === 1); 
	   		 }
		}
	};
}