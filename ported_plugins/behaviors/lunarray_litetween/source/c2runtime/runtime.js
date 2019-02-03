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

// common.js stop
// runtime.js start

// ECMAScript 5 strict mode
"use strict";
assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

function trim (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

// Behavior class
cr.behaviors.lunarray_LiteTween = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.lunarray_LiteTween.prototype;
		

	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};


	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		this.i = 0;		// progress
	};
	
	var behinstProto = behaviorProto.Instance.prototype;
	
	behinstProto.onCreate = function()
	{
		// Load properties
    this.playmode = this.properties[0];
    this.active = (this.playmode == 1) || (this.playmode == 2) || (this.playmode == 3) || (this.playmode == 4);
		this.tweened = this.properties[1]; // 0=Position|1=Size|2=Width|3=Height|4=Angle|5=Opacity|6=Value only|7=Horizontal|8=Vertical|9=Scale
		this.easing = this.properties[2];
		this.target = this.properties[3];
		this.targetmode = this.properties[4];
    this.useCurrent = false;
    if (this.targetmode === 1) this.target = "relative("+this.target+")";
		this.duration = this.properties[5];
		this.enforce = (this.properties[6] === 1);
    this.value = 0;
    
    this.tween_list = {};
    this.addToTweenList("default", this.tweened, this.easing, "current", this.target, this.duration, this.enforce);
    
    if (this.properties[0] === 1) this.startTween(0)
    if (this.properties[0] === 2) this.startTween(2)
    if (this.properties[0] === 3) this.startTween(3)
    if (this.properties[0] === 4) this.startTween(4)
	};

	behinstProto.parseCurrent = function(tweened, parseText)
  {
    if (parseText === undefined) parseText = "current";
    var parsed = trim(parseText);
    parseText = trim(parseText);
    var value = this.value;
    
    if (parseText === "current") {
      switch (tweened) {
        case 0: parsed = this.inst.x + "," + this.inst.y; break;
        case 1: parsed = this.inst.width + "," + this.inst.height; break;
        case 2: parsed = this.inst.width + "," + this.inst.height; break;
        case 3: parsed = this.inst.width + "," + this.inst.height; break;
        case 4: parsed = cr.to_degrees(this.inst.angle) + "," + cr.to_degrees(this.inst.angle); break;
        case 5: parsed = (this.inst.opacity*100) + "," + (this.inst.opacity*100); break;
        case 6: parsed = value + "," + value; break;
        case 7: parsed = this.inst.x + "," + this.inst.y; break;
        case 8: parsed = this.inst.x + "," + this.inst.y; break;
        case 9: 
          if (this.inst.curFrame !== undefined)
            parsed = (this.inst.width/this.inst.curFrame.width) + "," +(this.inst.height/this.inst.curFrame.height)
          else 
            parsed = "1,1"; 
          break;
        default:  break;
      }
    }
    if (parseText.substring(0,8) === "relative") {
      var param1 = parseText.match(/\((.*?)\)/);
      if (param1) {
        var relativex = parseFloat(param1[1].split(",")[0]);
        var relativey = parseFloat(param1[1].split(",")[1]);
      }
      if (isNaN(relativex)) relativex = 0; 
      if (isNaN(relativey)) relativey = 0; 
      switch (tweened) {
        case 0: parsed = (this.inst.x+relativex) + "," + (this.inst.y+relativey); break;
        case 1: parsed = (this.inst.width+relativex) + "," + (this.inst.height+relativey); break;
        case 2: parsed = (this.inst.width+relativex) + "," + (this.inst.height+relativey); break;
        case 3: parsed = (this.inst.width+relativex) + "," + (this.inst.height+relativey); break;
        case 4: parsed = (cr.to_degrees(this.inst.angle)+relativex) + "," + (cr.to_degrees(this.inst.angle)+relativey); break;
        case 5: parsed = (this.inst.opacity*100+relativex) + "," + (this.inst.opacity*100+relativey); break;
        case 6: parsed = value+relativex + "," + value+relativex; break;
        case 7: parsed = (this.inst.x+relativex) + "," + (this.inst.y); break;
        case 8: parsed = (this.inst.x) + "," + (this.inst.y+relativex); break;
        case 9: parsed = (relativex) + "," + (relativey); break;
        default:  break;
      }
    }
    return parsed;
  };
  
	behinstProto.addToTweenList = function(tname, tweened, easing, init, targ, duration, enforce)
  {
    init = this.parseCurrent(tweened, init);
    targ = this.parseCurrent(tweened, targ);

    if (this.tween_list[tname] !== undefined) {
      delete this.tween_list[tname]
    } 
    this.tween_list[tname] = new TweenObject(tname, tweened, easing, init, targ, duration, enforce);
    this.tween_list[tname].dt = 0;
  };

  //initialize all needed parameter for tweening
	behinstProto.saveToJSON = function ()
	{
    var v = JSON.stringify(this.tween_list["default"]);
		return {
			"playmode": this.playmode,
			"active": this.active,
			"tweened": this.tweened,
			"easing": this.easing,
			"target": this.target,
			"targetmode": this.targetmode,
			"useCurrent": this.useCurrent,
			"duration": this.duration,
			"enforce": this.enforce,
			"value": this.value,
			"tweenlist": JSON.stringify(this.tween_list["default"])
		};
	};

  TweenObject.Load = function(rawObj, tname, tweened, easing, init, targ, duration, enforce)
  {
    var obj = new TweenObject(tname, tweened, easing, init, targ, duration, enforce);
    for(var i in rawObj)
        obj[i] = rawObj[i];
    return obj;
  };
	
	// called when loading the full state of the game
	behinstProto.loadFromJSON = function (o)
	{
    var x = JSON.parse(o["tweenlist"]);
    var tempObj = TweenObject.Load(x, x.name, x.tweened, x.easefunc, x.initialparam1+","+x.initialparam2, x.targetparam1+","+x.targetparam2, x.duration, x.enforce);
		this.tween_list["default"] = tempObj;
	  this.playmode = o["playmode"];
		this.active = o["active"];
		this.movement = o["tweened"];
		this.easing = o["easing"];
		this.target = o["target"];
		this.targetmode = o["targetmode"];
		this.useCurrent = o["useCurrent"];
		this.duration = o["duration"];
		this.enforce = o["enforce"];
		this.value = o["value"];
	};

	behinstProto.setProgressTo = function (mark)
	{
    if (mark > 1.0) mark = 1.0;
    if (mark < 0.0) mark = 0.0;

    for (var i in this.tween_list) { 
      var inst = this.tween_list[i];
      inst.lastKnownValue = 0;
      inst.lastKnownValue2 = 0;
      inst.state = 3;
      inst.progress = mark * inst.duration;
      var factor = inst.OnTick(0);
      this.updateTween(inst, factor);
    }
  }

	behinstProto.startTween = function (startMode)
	{
    for (var i in this.tween_list) {
      var inst = this.tween_list[i];
      if (this.useCurrent) {
        var init = this.parseCurrent(inst.tweened, "current");
        var target = this.parseCurrent(inst.tweened, this.target);
        inst.setInitial(init);
        inst.setTarget(target);
      }
      if (startMode === 0) {
        inst.progress = 0.000001;
        inst.lastKnownValue = 0;
        inst.lastKnownValue2 = 0;
        inst.onStart = true;
        inst.state = 1;
      }
      if (startMode === 1) {
        inst.state = inst.lastState;
      }
      if ((startMode === 2) || (startMode === 4)) {
        inst.progress = 0.000001;
        inst.lastKnownValue = 0;
        inst.lastKnownValue2 = 0;
        inst.onStart = true;
        if (startMode == 2) inst.state = 4; //state ping pong
        if (startMode == 4) inst.state = 6; //state flip flop
      }
      if (startMode === 3) {
        inst.progress = 0.000001;
        inst.lastKnownValue = 0;
        inst.lastKnownValue2 = 0;
        inst.onStart = true;
        inst.state = 5;
      }
    }
  }

	behinstProto.stopTween = function (stopMode)
	{
    for (var i in this.tween_list) {
      var inst = this.tween_list[i];
      if ((inst.state != 3) && (inst.state != 0)) //don't save paused/seek state
        inst.lastState = inst.state;
      if (stopMode === 1) inst.progress = 0.0; 
      if (stopMode === 2) inst.progress = inst.duration;
      inst.state = 3;
      var factor = inst.OnTick(0);
      this.updateTween(inst, factor);
    }
  }

	behinstProto.reverseTween = function(reverseMode)
	{
    for (var i in this.tween_list) {
      var inst = this.tween_list[i];
      if (reverseMode === 1) {
        inst.progress = inst.duration;
        inst.lastKnownValue = 0;
        inst.lastKnownValue2 = 0;
        inst.onReverseStart = true;
      } 
      inst.state = 2;
    }
  }
	
	behinstProto.updateTween = function (inst, factor)
	{
    //var isMirrored = 1;
    //var isFlipped = 1;
    //if (this.inst.width < 0) isMirrored = -1; 
    //if (this.inst.height < 0) isFlipped = -1;
    if (inst.tweened === 0) {
      //if tweening position
      if (inst.enforce) {
        //enforce new coordinate
	      this.inst.x = inst.initialparam1 + (inst.targetparam1 - inst.initialparam1) * factor;
        this.inst.y = inst.initialparam2 + (inst.targetparam2 - inst.initialparam2) * factor;
      } else {
        //compromise coordinate change
        this.inst.x += ((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue;
        this.inst.y += ((inst.targetparam2 - inst.initialparam2) * factor) - inst.lastKnownValue2;
        inst.lastKnownValue = ((inst.targetparam1 - inst.initialparam1) * factor); 
        inst.lastKnownValue2 = ((inst.targetparam2 - inst.initialparam2) * factor);
      }
    } else if (inst.tweened === 1) {
      //if tweening size
      if (inst.enforce) {
  			this.inst.width = (inst.initialparam1 + ((inst.targetparam1 - inst.initialparam1) * (factor)));
	   		this.inst.height = (inst.initialparam2 + ((inst.targetparam2 - inst.initialparam2) * (factor)));
      } else {
       	this.inst.width +=  ((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue;
      	this.inst.height += ((inst.targetparam2 - inst.initialparam2) * factor) - inst.lastKnownValue2;
        inst.lastKnownValue = ((inst.targetparam1 - inst.initialparam1) * factor); 
        inst.lastKnownValue2 = ((inst.targetparam2 - inst.initialparam2) * factor); 
      }
    } else if (inst.tweened === 2) {
      //if tweening size width only
      if (inst.enforce) {
  			this.inst.width = (inst.initialparam1 + ((inst.targetparam1 - inst.initialparam1) * (factor)));
      } else {
      	this.inst.width += ((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue;
        inst.lastKnownValue = ((inst.targetparam1 - inst.initialparam1) * factor); 
      }
    } else if (inst.tweened === 3) {
      //if tweening size height only
      if (inst.enforce) {  
	   		this.inst.height = (inst.initialparam2 + ((inst.targetparam2 - inst.initialparam2) * (factor)));
      } else {
      	this.inst.height += ((inst.targetparam2 - inst.initialparam2) * factor) - inst.lastKnownValue2;
        inst.lastKnownValue2 = ((inst.targetparam2 - inst.initialparam2) * factor); 
      }
    } else if (inst.tweened === 4) {
      //if tweening angle
      if (inst.enforce) {
  		  var tangle = inst.initialparam1 + (inst.targetparam1 - inst.initialparam1) * factor;
  		  this.inst.angle = cr.clamp_angle(cr.to_radians(tangle));
      } else {
  		  var tangle = ((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue;
  		  this.inst.angle = cr.clamp_angle(this.inst.angle + cr.to_radians(tangle));
        inst.lastKnownValue = (inst.targetparam1 - inst.initialparam1) * factor; 
      }
    } else if (inst.tweened === 5) {
      //if tweening opacity
      if (inst.enforce) {
  		  this.inst.opacity = (inst.initialparam1 + (inst.targetparam1 - inst.initialparam1) * factor) / 100;
      } else {
  		  this.inst.opacity += (((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue) / 100;
        inst.lastKnownValue = ((inst.targetparam1 - inst.initialparam1) * factor);
      }
    } else if (inst.tweened === 6) {
      //if tweening value
      if (inst.enforce) {
  		  this.value = (inst.initialparam1 + (inst.targetparam1 - inst.initialparam1) * factor);
      } else {
  		  this.value += (((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue);
        inst.lastKnownValue = ((inst.targetparam1 - inst.initialparam1) * factor);
      }
    } else if (inst.tweened === 7) {
      //if tweening position X only
      if (inst.enforce) {
        //enforce new coordinate
	      this.inst.x = inst.initialparam1 + (inst.targetparam1 - inst.initialparam1) * factor;
      } else {
        //compromise coordinate change
        this.inst.x += ((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue;
        inst.lastKnownValue = ((inst.targetparam1 - inst.initialparam1) * factor); 
      }
    } else if (inst.tweened === 8) {
      //if tweening position Y only
      if (inst.enforce) {
        //enforce new coordinate
        this.inst.y = inst.initialparam2 + (inst.targetparam2 - inst.initialparam2) * factor;
      } else {
        //compromise coordinate change
        this.inst.y += ((inst.targetparam2 - inst.initialparam2) * factor) - inst.lastKnownValue2;
        inst.lastKnownValue2 = ((inst.targetparam2 - inst.initialparam2) * factor);
      }
    } else if (inst.tweened === 9) {
      //if tweening scale
      var scalex = inst.initialparam1 + (inst.targetparam1 - inst.initialparam1) * factor;
      var scaley = inst.initialparam2 + (inst.targetparam2 - inst.initialparam2) * factor;
      if (this.inst.width < 0) scalex = inst.initialparam1 + (inst.targetparam1 + inst.initialparam1) * -factor;
      if (this.inst.height < 0)  scaley = inst.initialparam2 + (inst.targetparam2 + inst.initialparam2) * -factor;
      if (inst.enforce) {
        this.inst.width = this.inst.curFrame.width * scalex;
        this.inst.height = this.inst.curFrame.height * scaley;
      } else {
        if (this.inst.width < 0) { 
      	  this.inst.width = scalex * (this.inst.width / (-1+inst.lastKnownValue)); 
          inst.lastKnownValue = scalex + 1 
        } else { 
      	  this.inst.width = scalex * (this.inst.width / (1+inst.lastKnownValue)); 
          inst.lastKnownValue = scalex - 1;
        }
        if (this.inst.height < 0) {
          this.inst.height = scaley * (this.inst.height / (-1+inst.lastKnownValue2));
          inst.lastKnownValue2 = scaley + 1 
        } else {
          this.inst.height = scaley * (this.inst.height / (1+inst.lastKnownValue2));
          inst.lastKnownValue2 = scaley - 1;
        } 
      }
    }

    this.inst.set_bbox_changed();
  }
  
	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);

    var inst = this.tween_list["default"];

    if (inst.state !== 0) {
      if (inst.onStart) {
  			this.runtime.trigger(cr.behaviors.lunarray_LiteTween.prototype.cnds.OnStart, this.inst);
        inst.onStart = false;
      }
  
      if (inst.onReverseStart) {
  		  this.runtime.trigger(cr.behaviors.lunarray_LiteTween.prototype.cnds.OnReverseStart, this.inst);
        inst.onReverseStart = false;
      }

      this.active = (inst.state == 1) || (inst.state == 2) || (inst.state == 4) || (inst.state == 5) || (inst.state == 6);
      var factor = inst.OnTick(dt);
      this.updateTween(inst, factor);

      if (inst.onEnd) {
  		  this.runtime.trigger(cr.behaviors.lunarray_LiteTween.prototype.cnds.OnEnd, this.inst);
        inst.onEnd = false;
      }
  
      if (inst.onReverseEnd) {
  		  this.runtime.trigger(cr.behaviors.lunarray_LiteTween.prototype.cnds.OnReverseEnd, this.inst);
        inst.onReverseEnd = false;
      }
    }
	};


	// Conditions
	behaviorProto.cnds = {};
	var cnds = behaviorProto.cnds;
	
	cnds.IsActive = function ()
	{
		return (this.tween_list["default"].state !== 0);
	};

	cnds.IsReversing = function ()
	{
		return (this.tween_list["default"].state == 2);
	};

	cnds.CompareProgress = function (cmp, v)
	{
    var inst = this.tween_list["default"];
		return cr.do_cmp((inst.progress / inst.duration), cmp, v);
	};

	cnds.OnThreshold = function (cmp, v)
	{
    var inst = this.tween_list["default"];
    this.threshold = (cr.do_cmp((inst.progress / inst.duration), cmp, v)); 
    var ret = (this.oldthreshold != this.threshold) && (this.threshold); 
    if (ret) { 
      this.oldthreshold = this.threshold;
    }
		return ret;
	};

	cnds.OnStart = function ()
	{
    if (this.tween_list["default"] === undefined) 
      return false;

    return this.tween_list["default"].onStart;    
	};

	cnds.OnReverseStart = function ()
	{
    if (this.tween_list["default"] === undefined) 
      return false;

    return this.tween_list["default"].onReverseStart;    
	};

  cnds.OnEnd = function ()
	{
    if (this.tween_list["default"] === undefined) 
      return false;
      
    return this.tween_list["default"].onEnd;    
	};

  cnds.OnReverseEnd = function ()
	{
    if (this.tween_list["default"] === undefined) 
      return false;

    return this.tween_list["default"].onReverseEnd;    
	};

	// Actions
	behaviorProto.acts = {};
	var acts = behaviorProto.acts;
	
	acts.Start = function (startmode, current)
	{
    this.threshold = false;
    this.oldthreshold = false;

    this.useCurrent = (current == 1);
    this.startTween(startmode);
	};

	acts.Stop = function (stopmode)
	{
    this.stopTween(stopmode);
	};

	acts.Reverse = function (revMode)
	{
    this.threshold = false;
    this.oldthreshold = false;

    this.reverseTween(revMode);
	};

 	acts.ProgressTo = function (progress)
	{
    this.setProgressTo(progress);
	};
	
	acts.SetDuration = function (x)
	{
    if (isNaN(x)) return;
    if (x < 0) return;
    if (this.tween_list["default"] === undefined) return;
		this.tween_list["default"].duration = x;
	};

	acts.SetEnforce = function (x)
	{
    if (this.tween_list["default"] === undefined) return;
		this.tween_list["default"].enforce = (x===1);
	};

	acts.SetInitial = function (x)
	{
    if (this.tween_list["default"] === undefined) return;
    var init = this.parseCurrent(this.tween_list["default"].tweened, x);
		this.tween_list["default"].setInitial(init);
	};

	acts.SetTarget = function (targettype, absrel, x)
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
        case 0: x1 = (this.inst.x + x); x2 = inst.targetparam2; break;
        case 1: x1 = inst.targetparam1; x2 = (this.inst.y + x); break;
        case 2: x1 = "" + cr.to_degrees(this.inst.angle + cr.to_radians(x)); x2 = x1; break; //angle
        case 3: x1 = "" + (this.inst.opacity*100) + x; x2 = x1; break; //opacity
        case 4: x1 = (this.inst.width + x); x2 = inst.targetparam2; break; //width
        case 5: x1 = inst.targetparam1; x2 = (this.inst.height + x); break; //height
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
	};              

	acts.SetTweenedProperty = function (x)
	{
    if (this.tween_list["default"] === undefined) return;
		this.tween_list["default"].tweened = x;
	};

	acts.SetEasing = function (x)
	{
    if (this.tween_list["default"] === undefined) return;
		this.tween_list["default"].easefunc = x;
	};

 	acts.SetEasingParam = function (x, a, p, t, s)
	{
    if (this.tween_list["default"] === undefined) return;
    this.tween_list["default"].easingparam[x].optimized = false;
		this.tween_list["default"].easingparam[x].a = a;
		this.tween_list["default"].easingparam[x].p = p;
		this.tween_list["default"].easingparam[x].t = t;
		this.tween_list["default"].easingparam[x].s = s;
	};

 	acts.ResetEasingParam = function ()
	{
    if (this.tween_list["default"] === undefined) return;
    this.tween_list["default"].optimized = true;
	};

 	acts.SetValue = function (x)
	{
    var inst = this.tween_list["default"];
		this.value = x;
    if (inst.tweened === 6)
      inst.setInitial( this.parseCurrent(inst.tweened, "current") );
	};

	acts.SetParameter = function (tweened, easefunction, target, duration, enforce)
	{
    if (this.tween_list["default"] === undefined) {
      this.addToTweenList("default", tweened, easefunction, initial, target, duration, enforce, 0);
    } else {
      var inst = this.tween_list["default"];
      inst.tweened = tweened; 
  		inst.easefunc = easefunction;
      inst.setInitial( this.parseCurrent(tweened, "current") );
      inst.setTarget( this.parseCurrent(tweened, target) );
      inst.duration = duration; 
      inst.enforce = (enforce === 1); 
    }
	};
  
	// Expressions
	behaviorProto.exps = {};
	var exps = behaviorProto.exps;
	exps.State = function (ret)
	{
    var parsed = "N/A"; 
    switch (this.tween_list["default"].state) {
      case 0: parsed = "paused"; break;
      case 1: parsed = "playing"; break;
      case 2: parsed = "reversing"; break;
      case 3: parsed = "seeking"; break;
      default:  break;
    }
    ret.set_string(parsed);
	};

	exps.Progress = function (ret)
	{
    var progress = this.tween_list["default"].progress/this.tween_list["default"].duration; 
    ret.set_float(progress);
	};

	exps.Duration = function (ret)
	{
    ret.set_float(this.tween_list["default"].duration);
	};

	exps.Target = function (ret)
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
    ret.set_float(parsed);
	};

	exps.Value = function (ret)
	{
    var tval = this.value; 
    ret.set_float(tval);
	};

	exps.Tween = function (ret, a_, b_, x_, easefunc_)
	{
    var currX = (x_>1.0?1.0:x_);
    var factor = easeFunc(easefunc_, currX<0.0?0.0:currX, 0.0, 1.0, 1.0, false, false);
    ret.set_float(a_ + factor * (b_-a_));
	};
  
}());
