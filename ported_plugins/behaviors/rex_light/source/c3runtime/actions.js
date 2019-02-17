"use strict";
var types = [];
{
	C3.Behaviors.Rex_light.Acts =
	{
	    PointToSolid()
	    {
	        this.PointTo();
	    },  
	    
	    PointToObject(obj_)
	    {
	        types.length = 0;    
	        if (obj_)
	        {
	            types.push(obj_);
	        }
	        this.PointTo(types);
	    },  
	    
	    SetMaxWidth(w)
	    {
	        if (w < 0)
	            w = 0;
	        this.max_width = w;
	    },  
	    
	    SetEnabled(en)
	    {
	        this.enabled = (en === 1);
	    },    

	    AddObstacle(obj_)
	    {
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
	    }  
	};
}