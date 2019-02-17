"use strict";
var __candidates = [];
{
	C3.Behaviors.Rex_light.Instance = class Rex_lightInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			
				this.enabled = 0;
				this.max_width = 0;
				this.obstacleMode = 0;		
				this.exp_HitUID = 0;
				this.inst = this._inst;
			
			if (properties)
			{
				this.enabled = (properties[0] !== 0);
				this.max_width = properties[1];
				this.obstacleMode = properties[2];		
				this.exp_HitUID = -1;
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
			return {
				// data to store for savegames
			};
		}

		LoadFromJson(o)
		{
			// load state for savegames
		}
		
		width_set(w)
		{
	        if (w == this.inst.GetWorldInfo().GetWidth())
	            return;
	            
	        this.inst.GetWorldInfo().SetWidth(w);
	        this.inst.GetWorldInfo().SetBboxChanged();    
		}     

	    
		get_candidates(types) // later
		{
	        __candidates.length = 0;    
	        if (types == null)  // use solids
	        {
	            var solid = this._runtime.GetSolidBehavior();
	            if (solid)
			        C3.appendArray(__candidates, solid.GetInstances());
	        }
	        else
	        {
	            var i, cnt=types.length;
	            for (i=0; i<cnt; i++)
	            {
	                C3.appendArray(__candidates, types[i].GetInstances());
	            }
	        }
	        
	        var width_save = this.inst.GetWorldInfo().GetWidth();
	        // remove overlap at start
	        this.width_set(1);         
	        var i,cnt=__candidates.length;
	        for (i=cnt-1; i>=0; i--)
	        {
	            if (this._runtime.GetCollisionEngine().TestOverlap(this.inst, __candidates[i]))

	            {                
	                C3.arrayRemove(__candidates, i);
	            }
	        }
	        this.width_set(width_save);
	        return __candidates;
		}
	   
		test_hit(candidates)
		{
	        var i,cnt=candidates.length;
	        for (i=0; i<cnt; i++)
	        {
	            if (this._runtime.GetCollisionEngine().TestOverlap(this.inst, candidates[i]))
	                return candidates[i].GetUID(); //dikkat
	        }
	        return null;
		}
		PointTo(types)
		{
	        var candidates = this.get_candidates(types);
	        if (candidates.length === 0)
	        {
	            this.width_set(this.max_width);
	            this.exp_HitUID = -1;
	            return;
	        }
	        
	        this.dec_approach(candidates);
	        this.inc_approach(candidates);
		} 
	    
		dec_approach(candidates)
		{
	        if (this.test_hit(candidates) === null)
	            return;
	            
	        var w=this.inst.GetWorldInfo().GetWidth(), dw=1;        
	        var out_of_range;
	        while (1)
	        {
	            w -= dw;
	            out_of_range = (w < 0);
	            this.width_set((out_of_range)? 0:w);
	            if (out_of_range)     
	                return;
	            if (this.test_hit(candidates) == null)  // dec until miss
	                return;
	            else
	                dw *= 2;   
	        }
		}  

		inc_approach(candidates)
		{     
	        var w=this.inst.GetWorldInfo().GetWidth(), dw=1, next_width;        
	        var out_of_range, hit_uid;    
	        while(1)
	        {
	            w += dw;    
	            out_of_range = (w > this.max_width);
	            this.width_set((out_of_range)? this.max_width:w);
	            if (out_of_range)
	            {
	                this.exp_HitUID = -1;
	                return;
	            }
	            hit_uid = this.test_hit(candidates);
	            //log(w + " :" + dw);            
	            if (hit_uid != null)
	            {
	                if (dw === 1)  // hit
	                {
	                    // done
	                    //log("Hit");
	                    this.exp_HitUID = hit_uid;   
	                    return;
	                }
	                else    // overshot
	                {
	                    //log("Hit - overshot: w is between "+ (w-dw).toString() + " - " + w.toString());
	                    w -= dw;
	                    dw = 1;
	                }
	            }
	            else
	            {
	                dw *= 2;                
	                while ((w + dw) > this.max_width)  // overshot
	                {
	                    //log("Inc - overshot");
	                    dw /= 2;
	                    if (dw === 1)
	                        break;
	                }
	            }
	        } 
		}   

		get_box_noraml(box_uid, hit_x, hit_y, to_angle)
		{    
			var box_inst = this._runtime.GetInstanceByUID(box_uid);
			if (box_inst == null)
			    return 0;
			    
			var abs_angle_hit = C3.angleTo(box_inst.GetWorldInfo().GetX(), box_inst.GetWorldInfo().GetY(), hit_x, hit_y) - box_inst.GetWorldInfo().GetAngle();
			abs_angle_hit = C3.clampAngle(abs_angle_hit);
			var _a = Math.atan2(box_inst.GetWorldInfo().GetHeight() , box_inst.GetWorldInfo().GetWidth());
			_a = C3.clampAngle(_a);
			var in_low_bound = (abs_angle_hit > _a) && (abs_angle_hit < (3.141592653589793 - _a));
			var in_up_bound = (abs_angle_hit > (3.141592653589793 + _a)) && (abs_angle_hit < (6.283185307179586 - _a));
			var normal = box_inst.GetWorldInfo().GetAngle();
			if (in_low_bound || in_up_bound)
			    normal += 1.5707963268;
			    
			 if (to_angle)
			     normal = to_clamped_degrees(normal);
			
			return normal;
		}
	
		Tick()
		{
			const dt = this._runtime.GetDt(this._inst);
			const wi = this._inst.GetWorldInfo();
			
	        if (!this.enabled){
            	return;
	        }
        
	        if (this.obstacleMode === 0)  // 0 = solids
	        {
	            this.PointTo();
	        }
	        else  // 1 = custom
	        {
	            this.PointTo(this.GetSdkType().GetObstacleTypes());
	        }
		}
		
	};
}


