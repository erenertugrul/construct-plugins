"use strict";
	function GetThisBehavior(inst)
	{
		var i, len;
		for (i = 0, len = inst.GetBehaviorInstances().length; i < len; i++)
		{
			if (inst.GetBehaviorInstances()[i].GetObjectInstance().GetBehaviorInstanceFromCtor(C3.Behaviors.Rex_CameraFollower))
				return inst.GetBehaviorInstances()[i];
		}
		
		return null;
	};
{
	C3.Behaviors.Rex_CameraFollower = class Rex_CameraFollower extends C3.SDKBehaviorBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
		Reset()
		{
	        this.camera_cnt = 0;
	        this.pre_scrollX = null;
	        this.pre_scrollY = null;                
		}         

		AddCamera()
		{
	        this.camera_cnt += 1;
		} 

		RemoveCamera()
		{
	        this.camera_cnt -= 1;
		}     
	    
		HasCamera()
		{
	        return (this.camera_cnt > 0);
		}
	    
		GetPreScrollX()
		{
	        return this.pre_scrollX;
		}    
	    
		GetPreScrollY()
		{
	        return this.pre_scrollY;
		}    
	    
		SetPreScrollXY(scrollX, scrollY)
		{
	        this.pre_scrollX = scrollX;
	        this.pre_scrollY = scrollY;
		}
		    
	};
}