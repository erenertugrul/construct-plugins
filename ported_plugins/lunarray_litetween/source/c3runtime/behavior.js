"use strict";
// common.js start

var easeOutBounceArray = [];
var easeInElasticArray = [];
var easeOutElasticArray = [];
var easeInOutElasticArray = [];
var easeInCircle = [];
var easeOutCircle = [];
var easeInOutCircle = [];
var easeInBack = [];
var easeOutBack = [];
var easeInOutBack = [];
var litetween_precision = 10000;
var updateLimit = 0; //0.0165;
function easeOutBouncefunc(t) {
  var b=0.0;
  var c=1.0;
  var d=1.0;
	if ((t/=d) < (1/2.75)) {
		result = c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		result = c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	} else if (t < (2.5/2.75)) {
		result = c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	} else {
		result = c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}		
  return result;
}

function do_cmp(x, cmp, y)
{
  if (typeof x === "undefined" || typeof y === "undefined")
    return false;
  switch (cmp)
  {
    case 0:     // equal
      return x === y;
    case 1:     // not equal
      return x !== y;
    case 2:     // less
      return x < y;
    case 3:     // less/equal
      return x <= y;
    case 4:     // greater
      return x > y;
    case 5:     // greater/equal
      return x >= y;
    default:
      return false;
  }
}
function integerize(t, d)
{
  return Math.round(t/d*litetween_precision);
}

function easeFunc(easing, t, b, c, d, flip, param)
{
  var ret_ease = 0;

  switch (easing) {
	case 0:		// linear
		ret_ease = c*t/d + b;
    break;
	case 1:		// easeInQuad
		ret_ease = c*(t/=d)*t + b;
    break;
	case 2:		// easeOutQuad
		ret_ease = -c *(t/=d)*(t-2) + b;
    break;
	case 3:		// easeInOutQuad
		if ((t/=d/2) < 1) 
      ret_ease = c/2*t*t + b
    else
		  ret_ease = -c/2 * ((--t)*(t-2) - 1) + b;
    break;
	case 4:		// easeInCubic
		ret_ease = c*(t/=d)*t*t + b;
    break;
	case 5:		// easeOutCubic
		ret_ease = c*((t=t/d-1)*t*t + 1) + b;
    break;
	case 6:		// easeInOutCubic
		if ((t/=d/2) < 1) 
			ret_ease = c/2*t*t*t + b
    else
		  ret_ease = c/2*((t-=2)*t*t + 2) + b;
    break;
	case 7:		// easeInQuart
		ret_ease = c*(t/=d)*t*t*t + b;
    break;
	case 8:		// easeOutQuart
		ret_ease = -c * ((t=t/d-1)*t*t*t - 1) + b;
    break;
	case 9:		// easeInOutQuart
		if ((t/=d/2) < 1) 
      ret_ease = c/2*t*t*t*t + b
    else
		  ret_ease = -c/2 * ((t-=2)*t*t*t - 2) + b;
    break;
	case 10:		// easeInQuint
		ret_ease = c*(t/=d)*t*t*t*t + b;
    break;
	case 11:		// easeOutQuint
		ret_ease = c*((t=t/d-1)*t*t*t*t + 1) + b;
    break;
	case 12:		// easeInOutQuint
		if ((t/=d/2) < 1) 
      ret_ease = c/2*t*t*t*t*t + b
    else
		  ret_ease = c/2*((t-=2)*t*t*t*t + 2) + b;
    break;
	case 13:		// easeInCircle
    if (param.optimized) {
		  ret_ease = easeInCircle[integerize(t,d)];
    } else {
      ret_ease = -(Math.sqrt(1-t*t) - 1);
    }
    break;
	case 14:		// easeOutCircle
    if (param.optimized) {
  		ret_ease = easeOutCircle[integerize(t,d)];
    } else {
      ret_ease = Math.sqrt(1 - ((t-1)*(t-1)));
    }
    break;
	case 15:		// easeInOutCircle
    if (param.optimized) {
  		ret_ease = easeInOutCircle[integerize(t,d)];
    } else {
  		if ((t/=d/2) < 1) ret_ease = -c/2 * (Math.sqrt(1 - t*t) - 1) + b
      else ret_ease = c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    } 
    break;
	case 16:		// easeInBack
    if (param.optimized) {
		  ret_ease = easeInBack[integerize(t,d)];
    } else {
  		var s = param.s;
	  	ret_ease = c*(t/=d)*t*((s+1)*t - s) + b;
    }
    break;
	case 17:		// easeOutBack
    if (param.optimized) {
		  ret_ease = easeOutBack[integerize(t,d)];
    } else {
   		var s = param.s;
	  	ret_ease = c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    }
    break;
	case 18:		// easeInOutBack
    if (param.optimized) {
		  ret_ease = easeInOutBack[integerize(t,d)];
    } else {
      var s = param.s
  		if ((t/=d/2) < 1) 
        ret_ease = c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b
      else
  		  ret_ease = c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    }
    break;
	case 19:	//easeInElastic
    if (param.optimized) {
  		ret_ease = easeInElasticArray[integerize(t, d)];
    } else {
      var a = param.a;
      var p = param.p;
      var s = 0;
      if (t==0) ret_ease = b; if ((t/=d)==1) ret_ease = b+c; 
      if (p==0) p=d*.3;	if (a==0 || a < Math.abs(c)) { a=c; s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (c/a);
  		ret_ease = -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    }
    break;
	case 20:	//easeOutElastic
    if (param.optimized) {
      ret_ease = easeOutElasticArray[integerize(t,d)];
    } else {
      var a = param.a;
      var p = param.p;
      var s = 0;
  		if (t==0) ret_ease= b;  if ((t/=d)==1) ret_ease= b+c;  if (p == 0) p=d*.3;
  		if (a==0 || a < Math.abs(c)) { a=c; var s=p/4; }
  		else var s = p/(2*Math.PI) * Math.asin (c/a);
  		ret_ease= (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
    }
    break;
	case 21:	//easeInOutElastic
    if (param.optimized) {
      ret_ease = easeInOutElasticArray[integerize(t,d)];
    } else {
      var a = param.a;
      var p = param.p;
      var s = 0;
  		if (t==0) ret_ease = b; 
  		if ((t/=d/2)==2) ret_ease = b+c;  
  		if (p==0) p=d*(.3*1.5);
  		if (a==0 || a < Math.abs(c)) { a=c; var s=p/4; }
  		else var s = p/(2*Math.PI) * Math.asin (c/a);
  		if (t < 1) 
        ret_ease = -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b
      else
  		  ret_ease = a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    }
    break;
	case 22:	//easeInBounce
    if (param.optimized) {
  		ret_ease = c - easeOutBounceArray[integerize(d-t, d)] + b;
    } else {
  		ret_ease = c - easeOutBouncefunc(d-t/d) + b;
    }
    break;
	case 23:	//easeOutBounce
    if (param.optimized) {
  		ret_ease = easeOutBounceArray[integerize(t, d)];
    } else {
  		ret_ease = easeOutBouncefunc(t/d);
    }
    break;
	case 24:	//easeInOutBounce
    if (param.optimized) {
  		if (t < d/2) 
        ret_ease = (c - easeOutBounceArray[integerize(d-(t*2), d)] + b) * 0.5 +b;
  		else 
        ret_ease = easeOutBounceArray[integerize(t*2-d, d)] * .5 + c*.5 + b;
    } else {
  		if (t < d/2) 
        ret_ease = (c - easeOutBouncefunc(d-(t*2)) + b) * 0.5 +b;
  		else 
        ret_ease = easeOutBouncefunc((t*2-d)/d) * .5 + c *.5 + b;
    }
    break;
	case 25:	//easeInSmoothstep
		var mt = (t/d) / 2;
		ret_ease = (2*(mt * mt * (3 - 2*mt)));
    break;
	case 26:	//easeOutSmoothstep
		var mt = ((t/d) + 1) / 2;
		ret_ease = ((2*(mt * mt * (3 - 2*mt))) - 1);
    break;
	case 27:	//easeInOutSmoothstep
		var mt = (t / d);
		ret_ease = (mt * mt * (3 - 2*mt));
    break;
	};
	
  if (flip)
    return (c - b) - ret_ease
  else
    return ret_ease;
};

(function preCalculateArray() {
  var d = 1.0;
  var b = 0.0;
  var c = 1.0;
  var result = 0.0;
  var a = 0.0;
  var p = 0.0;
  var t = 0.0;
  var s = 0.0;

  for (var ti = 0; ti <= litetween_precision; ti++) {
    t = ti/litetween_precision; 
  	if ((t/=d) < (1/2.75)) {
  		result = c*(7.5625*t*t) + b;
  	} else if (t < (2/2.75)) {
  		result = c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
  	} else if (t < (2.5/2.75)) {
  		result = c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
  	} else {
  		result = c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
  	}		
    easeOutBounceArray[ti] = result;

    t = ti/litetween_precision; a = 0; p = 0;
    if (t==0) result = b; if ((t/=d)==1) result = b+c; 
    if (p==0) p=d*.3;	if (a==0 || a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
		result = -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    easeInElasticArray[ti] = result;

    t = ti/litetween_precision; a = 0; p = 0;
		if (t==0) result= b;  if ((t/=d)==1) result= b+c;  if (p == 0) p=d*.3;
		if (a==0 || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		result= (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
    easeOutElasticArray[ti] = result;

    t = ti/litetween_precision; a = 0; p = 0;
		if (t==0) result = b; 
		if ((t/=d/2)==2) result = b+c;  
		if (p==0) p=d*(.3*1.5);
		if (a==0 || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) 
      result = -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b
    else
		  result = a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    easeInOutElasticArray[ti] = result;
    
    t = ti/litetween_precision; easeInCircle[ti] = -(Math.sqrt(1-t*t) - 1);
    t = ti/litetween_precision; easeOutCircle[ti] = Math.sqrt(1 - ((t-1)*(t-1)));

    t = ti/litetween_precision; 
		if ((t/=d/2) < 1) result = -c/2 * (Math.sqrt(1 - t*t) - 1) + b
    else result = c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    easeInOutCircle[ti] = result;

    t = ti/litetween_precision; s = 0;
		if (s==0) s = 1.70158;
		result = c*(t/=d)*t*((s+1)*t - s) + b;
    easeInBack[ti] = result;

    t = ti/litetween_precision; s = 0;
		if (s==0) s = 1.70158;
		result = c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    easeOutBack[ti] = result;

    t = ti/litetween_precision; s = 0; if (s==0) s = 1.70158;
		if ((t/=d/2) < 1) 
      result = c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b
    else
		  result = c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    easeInOutBack[ti] = result;
	}	
}());

var TweenObject = function() 
{
	var constructor = function (tname, tweened, easefunc, initial, target, duration, enforce) 
	{
		//0=Position|1=Size|2=Width|3=Height|4=Angle|5=Opacity|6=Value only
    //state -> 0=paused | 1=playing | 2=reversing | 3=seek only
    this.name = tname;
    this.value = 0; 
    this.setInitial(initial);
    this.setTarget(target);
    this.easefunc = easefunc;
    this.tweened = tweened;
    this.duration = duration;
    this.progress = 0;
    this.state = 0;
    this.onStart = false;
    this.onEnd = false;
    this.onReverseStart = false;
    this.onReverseEnd = false;
    this.lastKnownValue = 0; 
    this.lastKnownValue2 = 0;
    this.enforce = enforce; 
    this.pingpong = 1.0;
    this.flipEase = false;
    this.easingparam = [];
    this.lastState = 1;
    for (var i=0; i<28; i++) {
      this.easingparam[i] = {}; 
      this.easingparam[i].a = 0.0;
      this.easingparam[i].p = 0.0;
      this.easingparam[i].t = 0.0;
      this.easingparam[i].s = 0.0;
      this.easingparam[i].optimized = true;
    }
	}
	
	return constructor;
}();
(function () {
	TweenObject.prototype = {
	};

  TweenObject.prototype.flipTarget = function ()
  {
    var x1 = this.initialparam1;
    var x2 = this.initialparam2;
    this.initialparam1 = this.targetparam1; 
    this.initialparam2 = this.targetparam2;
    this.targetparam1 = x1;
    this.targetparam2 = x2;
    this.lastKnownValue = 0;
    this.lastKnownValue2 = 0;
  }

  TweenObject.prototype.setInitial = function (initial)
  {
    this.initialparam1 = parseFloat(initial.split(",")[0]); 
    this.initialparam2 = parseFloat(initial.split(",")[1]);
		this.lastKnownValue = 0;
		this.lastKnownValue2 = 0;
  } 
  
  TweenObject.prototype.setTarget = function (target)
  {
    this.targetparam1 = parseFloat(target.split(",")[0]);
    this.targetparam2 = parseFloat(target.split(",")[1]);
    if (isNaN(this.targetparam2)) this.targetparam2 = this.targetparam1;
  }

  TweenObject.prototype.OnTick = function(dt) 
  {
    //stopped
    if (this.state === 0) return -1.0;
     
    //if starting
    if (this.state === 1) 
      this.progress += dt;
    
    //if reversing
    if (this.state === 2) 
      this.progress -= dt;

    //seek
    if (this.state === 3) {
      this.state = 0;
    } 

    //ping pong
    if ((this.state === 4) || (this.state === 6)) {
      this.progress += dt * this.pingpong;
    } 

    //loop
    if (this.state === 5) {
      this.progress += dt * this.pingpong;
    } 

    if (this.progress < 0) {
      //it has reached negative timeline due to reversing, pausing
      this.progress = 0;
      //if it's ping pong, don't stop
      if (this.state === 4) {
        this.pingpong = 1;
      } else if (this.state === 6) {
        this.pingpong = 1;
        this.flipEase = false;
      } else {
        this.state = 0;
      }
      this.onReverseEnd = true;
      return 0.0;
    } else if (this.progress > this.duration) {
      //it has reached more than duration, pausing
      this.progress = this.duration;
      if (this.state === 4) {
        this.pingpong = -1;
      } else if (this.state === 6) {
        this.pingpong = -1;
        this.flipEase = true;
      } else if (this.state === 5) {
        this.progress = 0.0;
      } else {
        this.state = 0;
      }
      this.onEnd = true;
      return 1.0;
    } else {
      if (this.flipEase) {
        var factor = easeFunc(this.easefunc, this.duration - this.progress, 0, 1, this.duration, this.flipEase, this.easingparam[this.easefunc]);
      } else {
        var factor = easeFunc(this.easefunc, this.progress, 0, 1, this.duration, this.flipEase, this.easingparam[this.easefunc]);
      }
      return factor;
    }
  };  
}());
function trim (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
TweenObject.Load = function(rawObj, tname, tweened, easing, init, targ, duration, enforce){
	var obj = new TweenObject(tname, tweened, easing, init, targ, duration, enforce);
	for(var i in rawObj)
	    obj[i] = rawObj[i];
	return obj;
};
{
	C3.Behaviors.lunarray_LiteTween = class lunarray_LiteTween extends C3.SDKBehaviorBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}