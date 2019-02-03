"use strict";
{
	C3.Behaviors.Rex_RotateTo.Instance = class Rex_RotateToInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);

			this.inst = this._inst.GetWorldInfo() //this._inst;
			if (properties)
			{
	        	this.activated = (properties[0] == 1);
       			this.move = {"max":properties[1],"acc":properties[2],"dec":properties[3]};
		        this.target = {"a":0, "cw":true};  
		        this.is_rotating = false;  
		        this.current_speed = 0;       
		        this.remain_distance = 0;
        		this.is_my_call = false;
			}

			this._StartTicking();
		}

		Release()
		{
			super.Release();
		}
		
		SetCurrentSpeed(speed)
		{
	        if (speed != null)
	        {
	            this.current_speed = (speed > this.move["max"])? 
	                                 this.move["max"]: speed;
	        }        
	        else if (this.move["acc"]==0)
	        {
	            this.current_speed = this.move["max"];
	        }
		}
	
		SetTargetAngle(target_angle_radians, clockwise_mode)  // in radians
		{
	        this.is_rotating = true;
	        var cur_angle_radians = this.inst.GetAngle();

	        this.target["cw"] = (clockwise_mode == 2)? C3.angleClockwise(target_angle_radians, cur_angle_radians) :
	                                                   (clockwise_mode == 1);
	        var remain_distance = (clockwise_mode == 2)? C3.angleDiff(cur_angle_radians, target_angle_radians) :
	                              (clockwise_mode == 1)? (target_angle_radians - cur_angle_radians) :
	                                                     (cur_angle_radians - target_angle_radians);
	        this.remain_distance = to_clamped_degrees(remain_distance);

	        this.target["a"] = to_clamped_degrees(target_angle_radians);
	        this.SetCurrentSpeed(null); 
		}
		SaveToJson()
		{
			return {
				"en": this.activated,
             	"v": this.move,
             	"t": this.target,
             	"ir": this.is_rotating,
             	"cs": this.current_speed,
             	"rd": this.remain_distance
			};
		}

		LoadFromJson(o)
		{
	        this.activated = o["en"];
	        this.move = o["v"];
	        this.target = o["t"];
	        this.is_rotating = o["ir"];
	        this.current_speed = o["cs"];     
	        this.remain_distance = o["rd"];
		}
		Tick()
		{
			const dt = this._runtime.GetDt(this._inst);
			const wi = this._inst.GetWorldInfo();
			// ... code to run every tick for this behavior ...
			if ( (!this.activated) || (!this.is_rotating) ) 
	        {
	            return;
	        }
	        
			//var dt = this.runtime.getDt(this.inst);
	        if (dt==0)   // can not move if dt == 0
	            return;

	        // assign speed
	        var is_slow_down = false;
	        if (this.move["dec"] != 0)
	        {
	            // is time to deceleration?                
	            var _speed = this.current_speed;
	            var _distance = (_speed*_speed)/(2*this.move["dec"]); // (v*v)/(2*a)
	            is_slow_down = (_distance >= this.remain_distance);
	        }
	        var acc = (is_slow_down)? (-this.move["dec"]):this.move["acc"];
	        if (acc != 0)
	        {
	            this.SetCurrentSpeed( this.current_speed + (acc * dt) );    
	        }

			// Apply movement to the object     
	        var distance = this.current_speed * dt;
	        this.remain_distance -= distance;   
	        
	        var is_hit_target = false;        
	        // is hit to target at next tick?
	        if ( (this.remain_distance <= 0) || (this.current_speed <= 0) )
	        {
	            this.is_rotating = false;
	            this.inst.SetAngle(to_clamped_radians(this.target["a"]));
	            this.SetCurrentSpeed(0);
	            is_hit_target = true;
	        }
	        else
	        {
	            if (this.target["cw"])
	                this.inst.SetAngle(this.inst.GetAngle()+to_clamped_radians(distance));
	            else
	                this.inst.SetAngle(this.inst.GetAngle()-to_clamped_radians(distance));
	        } 
			this.inst.SetBboxChanged();
			
	        if (is_hit_target)
	        {
	            this.is_my_call = true;
	            this.Trigger(C3.Behaviors.Rex_RotateTo.Cnds.OnHitTarget, this.inst);
	            this.is_my_call = false;
	        }		  
			
		}
	};
}
