"use strict";

{
	C3.Behaviors.PinPlus.Exps =
	{
		PinnedUID()
		{
			return(this.pinObject ? this.pinObject.GetUID() : -1);
		},
		
		isPinnedX()
		{
			return(this.pinObject ? this.x : -1);
		},
		isPinnedY()
		{
			return(this.pinObject ? this.y : -1);
		},
		isPinnedZindex()
		{
			return(this.pinObject ? this.zIndex : -1);
		},
		isPinnedAngle()
		{
			return(this.pinObject ? this.angle : -1);
		},
		isPinnedWidth()
		{
			return(this.pinObject ? this.width : -1);
		},
		isPinnedHeight()
		{
			return(this.pinObject ? this.height : -1);
		},
		isPinnedOpacity()
		{
			return(this.pinObject ? this.opacity : -1);
		},
		isPinnedVisibility()
		{
			return(this.pinObject ? this.visibility : -1);
		},
		isPinnedCollisionEnabled()
		{
			return(this.pinObject ? this.collisions : -1);
		},
		isPinnedTimescale()
		{
			return(this.pinObject ? this.timescale : -1);
		},
		isPinnedHotspotX()
		{
			return(this.pinObject ? this.hotspotX : -1);
		},
		isPinnedHotspotY()
		{
			return(this.pinObject ? this.hotspotY : -1);
		},	
		PinnedImagepoint()
		{
			return(this.pinObject ? this.pinImagepoint : -1);
		},
		isPinnedAnimation()
		{
			return(this.pinObject ? this.pinAnimation : -1);
		},
		isPinnedFrame()
		{
			return(this.pinObject ? this.pinFrame : -1);
		},	
		isPinnedMirror()
		{
			return(this.pinObject ? this.pinMirror : -1);
		},	
		isPinnedFlip()
		{
			return(this.pinObject ? this.pinFlip : -1);
		},	
		isPinnedDestroy()
		{
			return(this.pinObject ? this.pinDestroy : -1);
		}
		
	};
}