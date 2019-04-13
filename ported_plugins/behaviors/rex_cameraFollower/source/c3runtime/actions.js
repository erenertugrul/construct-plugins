"use strict";

{
	C3.Behaviors.Rex_CameraFollower.Acts =
	{
		SetMovingRatioX(ratio)
		{
			this.ratioX = ratio;
		}, 
		SetMovingRatioY(ratio)
		{
			this.ratioY = ratio;
		},    
	    
		SetFollowingEnable(s)
		{
	        if (!this.isCamera)        
			    this.enabled = (s !== 0);
		}
	};
}