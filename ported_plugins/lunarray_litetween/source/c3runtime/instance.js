"use strict";

{
	C3.Behaviors.lunarray_LiteTween.Instance = class lunarray_LiteTweenInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			
			this.i = 0;		// progress
			this.inst = this._inst.GetWorldInfo() //this._inst;
			if (properties)
			{
				//this._myProperty = properties[0];
						// Load properties
			    this.playmode = properties[0];
			    this.active = (this.playmode == 1) || (this.playmode == 2) || (this.playmode == 3) || (this.playmode == 4);
				this.tweened = properties[1]; // 0=Position|1=Size|2=Width|3=Height|4=Angle|5=Opacity|6=Value only|7=Horizontal|8=Vertical|9=Scale
				this.easing = properties[2];
				this.target = properties[3];
				this.targetmode = properties[4];
			    this.useCurrent = false;
			    if (this.targetmode === 1) this.target = "relative("+this.target+")";
				this.duration = properties[5];
				this.enforce = (properties[6] === 1);
			    this.value = 0;
			    
			    this.tween_list = {};
			    this.addToTweenList("default", this.tweened, this.easing, "current", this.target, this.duration, this.enforce);
			    
			    if (properties[0] === 1) this.startTween(0)
			    if (properties[0] === 2) this.startTween(2)
			    if (properties[0] === 3) this.startTween(3)
			    if (properties[0] === 4) this.startTween(4)
			}
			
			// Opt-in to getting calls to Tick()
			this._StartTicking();
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
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
		}

		LoadFromJson(o)
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
		}
		
		parseCurrent(tweened, parseText)
		{
			if (parseText === undefined) parseText = "current";
			  var parsed = trim(parseText);
			  parseText = trim(parseText);
			  var value = this.value;
			  
			  if (parseText === "current") {
			    switch (tweened) {
			      case 0: parsed = this.inst.GetX() + "," + this.inst.GetY(); break;
			      case 1: parsed = this.inst.GetWidth() + "," + this.inst.GetHeight(); break;
			      case 2: parsed = this.inst.GetWidth() + "," + this.inst.GetHeight(); break;
			      case 3: parsed = this.inst.GetWidth() + "," + this.inst.GetHeight(); break;
			      case 4: parsed = C3.toDegrees(this.inst.GetAngle()) + "," + C3.toDegrees(this.inst.GetAngle()); break;
			      case 5: parsed = (this.inst.GetOpacity()*100) + "," + (this.inst.GetOpacity()*100); break;
			      case 6: parsed = value + "," + value; break;
			      case 7: parsed = this.inst.GetX() + "," + this.inst.GetY(); break;
			      case 8: parsed = this.inst.GetX() + "," + this.inst.GetY(); break;
			      case 9: 
			        /*if  (this._inst.GetObjectClass().GetFirstAnimationFrame() !== undefined) todo fix it. 
			          parsed = (this.inst.GetWidth()/this._inst.GetWorldInfo().GetInstance().GetCurrentImageInfo().GetWidth()) + "," +(this.inst.GetHeight()/this._inst.GetWorldInfo().GetInstance().GetCurrentImageInfo().GetHeight())
			        else */
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
			      case 0: parsed = (this.inst.GetX()+relativex) + "," + (this.inst.GetY()+relativey); break;
			      case 1: parsed = (this.inst.GetWidth()+relativex) + "," + (this.inst.GetHeight()+relativey); break;
			      case 2: parsed = (this.inst.GetWidth()+relativex) + "," + (this.inst.GetHeight()+relativey); break;
			      case 3: parsed = (this.inst.GetWidth()+relativex) + "," + (this.inst.GetHeight()+relativey); break;
			      case 4: parsed = (C3.toDegrees(this.inst.GetAngle())+relativex) + "," + (C3.toDegrees(this.inst.GetAngle())+relativey); break;
			      case 5: parsed = (this.inst.GetOpacity()*100+relativex) + "," + (this.inst.GetOpacity()*100+relativey); break;
			      case 6: parsed = value+relativex + "," + value+relativex; break;
			      case 7: parsed = (this.inst.GetX()+relativex) + "," + (this.inst.GetY()); break;
			      case 8: parsed = (this.inst.GetX()) + "," + (this.inst.GetY()+relativex); break;
			      case 9: parsed = (relativex) + "," + (relativey); break;
			      default:  break;
			    }
			  }
			  return parsed;
		}
		
		addToTweenList(tname, tweened, easing, init, targ, duration, enforce)
		{
		    init = this.parseCurrent(tweened, init);
		    targ = this.parseCurrent(tweened, targ);

		    if (this.tween_list[tname] !== undefined) {
		      delete this.tween_list[tname]
		    } 
		    this.tween_list[tname] = new TweenObject(tname, tweened, easing, init, targ, duration, enforce);
		    this.tween_list[tname].dt = 0;
		}

		setProgressTo(mark)
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

		startTween(startMode)
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

		stopTween(stopMode)
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

		reverseTween(reverseMode)
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

		updateTween(inst, factor)
		{
			//var isMirrored = 1;
		    //var isFlipped = 1;
		    //if (this.inst.width < 0) isMirrored = -1; 
		    //if (this.inst.height < 0) isFlipped = -1;
		    if (inst.tweened === 0) {
		      //if tweening position
		    	if (inst.enforce) {
		        	//enforce new coordinate
			      	this.inst.SetX(inst.initialparam1 + (inst.targetparam1 - inst.initialparam1) * factor);
		        	this.inst.SetY(inst.initialparam2 + (inst.targetparam2 - inst.initialparam2) * factor);
		      	} 
		      	else {
		        	//compromise coordinate change
		        	this.inst.SetX(this.inst.GetX()+((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue);
		        	this.inst.SetY(this.inst.GetY()+((inst.targetparam2 - inst.initialparam2) * factor) - inst.lastKnownValue2);
		        	inst.lastKnownValue = ((inst.targetparam1 - inst.initialparam1) * factor); 
		        	inst.lastKnownValue2 = ((inst.targetparam2 - inst.initialparam2) * factor);
		     	}
		    } 
		    else if (inst.tweened === 1) {
		      //if tweening size
	      		if (inst.enforce) {
	  				this.inst.SetWidth((inst.initialparam1 + ((inst.targetparam1 - inst.initialparam1) * (factor))));
		   			this.inst.SetHeight((inst.initialparam2 + ((inst.targetparam2 - inst.initialparam2) * (factor))));
		      	} 
		      	else {
	       			this.inst.SetWidth(this.inst.GetWidth()+((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue);
	      			this.inst.SetHeight(this.inst.GetHeight()+((inst.targetparam2 - inst.initialparam2) * factor) - inst.lastKnownValue2);
	        		inst.lastKnownValue = ((inst.targetparam1 - inst.initialparam1) * factor); 
	        		inst.lastKnownValue2 = ((inst.targetparam2 - inst.initialparam2) * factor); 
		      	}
		    } 
		    else if (inst.tweened === 2) {
		      //if tweening size width only
	      		if (inst.enforce) {
	  				this.inst.SetWidth((inst.initialparam1 + ((inst.targetparam1 - inst.initialparam1) * (factor))));
		      	} 
		      	else {
	      			this.inst.SetWidth(this.inst.GetWidth()+((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue);
	        		inst.lastKnownValue = ((inst.targetparam1 - inst.initialparam1) * factor); 
		      	}
		    } 
		    else if (inst.tweened === 3) {
		      //if tweening size height only
	      		if (inst.enforce) {  
		   			this.inst.SetHeight((inst.initialparam2 + ((inst.targetparam2 - inst.initialparam2) * (factor))));
		      	} 
	     	 	else {
	      			this.inst.SetHeight(this.inst.GetHeight()+((inst.targetparam2 - inst.initialparam2) * factor) - inst.lastKnownValue2);
	        		inst.lastKnownValue2 = ((inst.targetparam2 - inst.initialparam2) * factor); 
		      	}
		    } 
		    else if (inst.tweened === 4) {
		      //if tweening angle
		      if (inst.enforce) {
	  		  	var tangle = inst.initialparam1 + (inst.targetparam1 - inst.initialparam1) * factor;
	  		 	this.inst.SetAngle(C3.clampAngle(C3.toRadians(tangle))) ;
		      } 
		      else {
	  		  	var tangle = ((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue;
	  		  	this.inst.SetAngle(C3.clampAngle(this.inst.angle + C3.toRadians(tangle)));
	        	inst.lastKnownValue = (inst.targetparam1 - inst.initialparam1) * factor; 
		      }
		    } 
		    else if (inst.tweened === 5) {
		      //if tweening opacity
		      if (inst.enforce) {
		  		  this.inst.SetOpacity((inst.initialparam1 + (inst.targetparam1 - inst.initialparam1) * factor) / 100);
		      } 
		      else {
		  		  this.inst.SetOpacity(this.inst.GetOpacity() + (((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue) / 100);
		        inst.lastKnownValue = ((inst.targetparam1 - inst.initialparam1) * factor);
		      }
		    } 
		    else if (inst.tweened === 6) {
		      //if tweening value
		      if (inst.enforce) {
		  		  this.value = (inst.initialparam1 + (inst.targetparam1 - inst.initialparam1) * factor);
		      } 
		      else {
		  		  this.value += (((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue);
		        inst.lastKnownValue = ((inst.targetparam1 - inst.initialparam1) * factor);
		      }
		    } 
		    else if (inst.tweened === 7) {
		      //if tweening position X only
		      if (inst.enforce) {
		        //enforce new coordinate
			      this.inst.SetX(inst.initialparam1 + (inst.targetparam1 - inst.initialparam1) * factor);
		      } 
		      else {
		        //compromise coordinate change
		        this.inst.SetX(this.inst.GetX()+ ((inst.targetparam1 - inst.initialparam1) * factor) - inst.lastKnownValue);
		        inst.lastKnownValue = ((inst.targetparam1 - inst.initialparam1) * factor); 
		      }
		    } 
		    else if (inst.tweened === 8) {
		      //if tweening position Y only
		      if (inst.enforce) {
		        //enforce new coordinate
		        this.inst.SetY(inst.initialparam2 + (inst.targetparam2 - inst.initialparam2) * factor);
		      } 
		      else {
		        //compromise coordinate change
		        this.inst.SetY(this.inst.GetY()+ ((inst.targetparam2 - inst.initialparam2) * factor) - inst.lastKnownValue2);
		        inst.lastKnownValue2 = ((inst.targetparam2 - inst.initialparam2) * factor);
		      }
		    } 
		    else if (inst.tweened === 9) {
		      //if tweening scale
		      var scalex = inst.initialparam1 + (inst.targetparam1 - inst.initialparam1) * factor;
		      var scaley = inst.initialparam2 + (inst.targetparam2 - inst.initialparam2) * factor;
		      if (this.inst.GetWidth() < 0) scalex = inst.initialparam1 + (inst.targetparam1 + inst.initialparam1) * -factor;
		      if (this.inst.GetHeight() < 0)  scaley = inst.initialparam2 + (inst.targetparam2 + inst.initialparam2) * -factor;
		      if (inst.enforce) {
		       this.inst.SetWidth(this._inst.GetWorldInfo().GetInstance().GetCurrentImageInfo().GetWidth() * scalex);
		       this.inst.SetHeight(this._inst.GetWorldInfo().GetInstance().GetCurrentImageInfo().GetHeight() * scaley);

		      } 
		      else {
		        if (this.inst.GetWidth() < 0) { 
		      	  this.inst.SetWidth(scalex * (this.inst.GetWidth() / (-1+inst.lastKnownValue))); 
		          inst.lastKnownValue = scalex + 1 
		        } 
		        else { 
		      	  this.inst.SetWidth(scalex * (this.inst.GetWidth() / (1+inst.lastKnownValue))); 
		          inst.lastKnownValue = scalex - 1;
		        }
		        if (this.inst.GetHeight() < 0) {
		          this.inst.SetHeight(scaley * (this.inst.GetHeight() / (-1+inst.lastKnownValue2)));
		          inst.lastKnownValue2 = scaley + 1 
		        } 
		        else {
		          this.inst.SetHeight(scaley * (this.inst.GetHeight() / (1+inst.lastKnownValue2)));
		          inst.lastKnownValue2 = scaley - 1;
		        } 
		      }
		    }

		    this.inst.SetBboxChanged();
		}
		Tick()
		{
			const dt = this._runtime.GetDt(this._inst);
			const wi = this._inst.GetWorldInfo();
			// ... code to run every tick for this behavior ...
			var inst = this.tween_list["default"];

		    if (inst.state !== 0) {
		      if (inst.onStart) {
					this.Trigger(C3.Behaviors.lunarray_LiteTween.Cnds.OnStart, this.inst);
		        	inst.onStart = false;
		      	}
		  
		      if (inst.onReverseStart) {
		  		  this.Trigger(C3.Behaviors.lunarray_LiteTween.Cnds.OnReverseStart, this.inst);
		        inst.onReverseStart = false;
		      }

		      this.active = (inst.state == 1) || (inst.state == 2) || (inst.state == 4) || (inst.state == 5) || (inst.state == 6);
		      var factor = inst.OnTick(dt);
		      this.updateTween(inst, factor);

		      if (inst.onEnd) {
		  		  this.Trigger(C3.Behaviors.lunarray_LiteTween.Cnds.OnEnd, this.inst);
		        inst.onEnd = false;
		      }
		  
		      if (inst.onReverseEnd) {
		  		  this.Trigger(C3.Behaviors.lunarray_LiteTween.Cnds.OnReverseEnd, this.inst);
		        inst.onReverseEnd = false;
		      }
		  	}
		}

	};
}