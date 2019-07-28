"use strict";

{
	C3.Behaviors.Rex_pushOutSolid.Instance = class Rex_pushOutSolidInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			this.inst= this._inst;
			// Initialise object properties
		    this.enabled = (properties[0] === 1);
		    this.obstacleMode = properties[1];		// 0 = solids, 1 = custom
	        this.maxDist = 100;
	        this._StartTicking();
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			var i, len, obs = [];
			for (i = 0, len = this.GetSdkType().GetObstacleTypes().length; i < len; i++)
			{
				obs.push(this.GetSdkType().GetObstacleTypes()[i]._sid);
			}
				    
			return { "en": this.enabled,
			         "obs": obs };
			}
		
		LoadFromJson(o)
		{
			this.enabled = o["en"];
		
			// Reloaded by each instance but oh well
			C3.clearArray(this.GetSdkType().GetObstacleTypes());
			var obsarr = o["obs"];
			var i, len, t;
			for (i = 0, len = obsarr.length; i < len; i++)
			{
				t = this._runtime.GetObjectClassBySID(obsarr[i]);
				if (t)
					this.GetSdkType().GetObstacleTypes().push(t);
			}	
		}
		Tick()
		{
		    if (!this.enabled)
		        return;

		    this.pushOutNearest( this.getCandidates() , this.maxDist);	    
		}

		getCandidates()
		{
		    __candidates.length = 0; 
		    if (this.obstacleMode === 0)  // use solids
		    {
		        var solid = this._runtime.GetSolidBehavior();
		        if (solid)
			        C3.appendArray(__candidates, solid.GetInstances());
		    }
		    else
		    {
		        var types = this.GetSdkType().GetObstacleTypes();
		        var i, cnt=types.length;
		        for (i=0; i<cnt; i++)
		        {
		            C3.appendArray(__candidates, types[i].GetInstances());
		        }
		    }

		    return __candidates;
		} 
			
		// Find nearest position not overlapping a solid
		pushOutNearest(candidates, max_dist)
		{
		    var inst = this.inst;
			var dist = 0;
			var oldx = inst.GetWorldInfo().GetX();
			var oldy = inst.GetWorldInfo().GetY();

			var dir = 0;
			var dx = 0, dy = 0;
			
			var overlap_inst = this.get_first_overlap_inst(candidates);		
			if (!overlap_inst)
				return true;		// no overlap candidate found
			
			// 8-direction spiral scan
			while (dist <= max_dist)
			{
				switch (dir) {
				case 0:		dx = 0; dy = -1; dist++; break;
				case 1:		dx = 1; dy = -1; break;
				case 2:		dx = 1; dy = 0; break;
				case 3:		dx = 1; dy = 1; break;
				case 4:		dx = 0; dy = 1; break;
				case 5:		dx = -1; dy = 1; break;
				case 6:		dx = -1; dy = 0; break;
				case 7:		dx = -1; dy = -1; break;
				}
				
				dir = (dir + 1) % 8;
				
				inst.GetWorldInfo().SetX(Math.floor(oldx + (dx * dist)));
				inst.GetWorldInfo().SetY(Math.floor(oldy + (dy * dist)));
				inst.GetWorldInfo().SetBboxChanged();
				
		        overlap_inst = this.get_first_overlap_inst(candidates, overlap_inst);
		        if (!overlap_inst)
			        return true;
			}
			
			// Didn't get pushed out: restore old position and return false
			inst.GetWorldInfo().SetX(oldx);
			inst.GetWorldInfo().SetY(oldy);
			inst.GetWorldInfo().SetBboxChanged();
			return false;
		}	

			
		// Find nearest position not overlapping a solid
		pushOut(candidates, ux, uy, max_dist)
		{
		    var inst = this.inst;
			var dist = 0;
			var oldx = inst.GetWorldInfo().GetX();
			var oldy = inst.GetWorldInfo().GetY();
		    var testx, testy;

			var overlap_inst = this.get_first_overlap_inst(candidates);		
			if (!overlap_inst)
				return true;		// no overlap candidate found

			while (dist <= max_dist)
			{
		        dist++;
		        testx = Math.floor(oldx + (ux * dist));
		        testy = Math.floor(oldy + (uy * dist));
		        if ((inst.GetWorldInfo().GetX() === testx) && (inst.GetWorldInfo().GetY() === testy))
		            continue;
		        
				inst.GetWorldInfo().SetX(testx);
				inst.GetWorldInfo().SetY(testy);
				inst.GetWorldInfo().SetBboxChanged();
				
		        overlap_inst = this.get_first_overlap_inst(candidates, overlap_inst);
		        if (!overlap_inst)
			        return true;
			}
			
			// Didn't get pushed out: restore old position and return false
			inst.GetWorldInfo().SetX(oldx);
			inst.GetWorldInfo().SetX(oldy);
			inst.GetWorldInfo().SetBboxChanged();
			return false;
		}	

		get_first_overlap_inst(candidates, overlap_inst)
		{
		    if (overlap_inst && this._runtime.GetCollisionEngine().TestOverlap(this.inst, overlap_inst))
		        return overlap_inst;
		    
		    var i,cnt=candidates.length;
		    for (i=0; i<cnt; i++)
		    {
		        if (this._runtime.GetCollisionEngine().TestOverlap(this.inst, candidates[i]))
		            return candidates[i];
		    }
		    return null;
		} 

	};
}