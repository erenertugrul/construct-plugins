"use strict";

{
	C3.Behaviors.Rex_pushOutSolid.Acts =
	{
		SetEnabled(en)
		{
			this.enabled = (en === 1);
		},

		AddObstacle(obj_)
		{
		    if (!obj_)
		        return;
		        
		    debugger
			var obstacleTypes = this.GetSdkType().GetObstacleTypes();
			
			// Check not already a target, we don't want to add twice
			if (obstacleTypes.indexOf(obj_) !== -1)
				return;
			
			// Check obj is not a member of a family that is already a target
			var i, len, t;
			for (i = 0, len = obstacleTypes.length; i < len; i++)
			{
				t = obstacleTypes[i];
				
				if (t.is_family && t.members.indexOf(obj_) !== -1)
					return;
			}
			
			obstacleTypes.push(obj_);
		},    

		ClearObstacles()
		{
			this.GetSdkType().GetObstacleTypes().length = 0;
		},	

		PushOutNearest(maxDist)
		{
		    this.pushOutNearest( this.getCandidates() , maxDist);	    
		},	

		PushOutAngle(a, maxDist)
		{
			a = C3.toRadians(a);
			var ux = Math.cos(a);
			var uy = Math.sin(a);
			this.pushOut(this.getCandidates() , ux, uy, maxDist);
		},    

		PushOutToPos(x, y)
		{        
		    var dx = x - this.inst.GetWorldInfo().GetX();
		    var dy = y - this.inst.GetWorldInfo().GetY();
		    
		    var maxDist = Math.sqrt(dx*dx + dy*dy);       
			var a = Math.atan2(dy, dx);
			var ux = Math.cos(a);
			var uy = Math.sin(a);
			this.pushOut(this.getCandidates() , ux, uy, maxDist);
		}  
	};
}