"use strict";

{
	C3.Behaviors.PinPlus.Acts =
	{
		Pin(obj, mode_)
		{
			var otherinst = obj.GetFirstPicked(this.inst);
			if (!otherinst)
				return;
				
			this.pinObject = otherinst;
			
			var objx = this.pinImagepoint===0?this.pinObject.GetWorldInfo().GetX():this.pinObject.GetImagePoint(this.pinImagepoint, true)[0];
			var objy = this.pinImagepoint===0?this.pinObject.GetWorldInfo().GetY():this.pinObject.GetImagePoint(this.pinImagepoint, false)[1];
			
			this.pinAngle = C3.angleTo(objx, objy, this.inst.GetWorldInfo().GetX(), this.inst.GetWorldInfo().GetY()) - otherinst.GetWorldInfo().GetAngle();
			this.pinDist = C3.distanceTo(objx, objy, this.inst.GetWorldInfo().GetX(), this.inst.GetWorldInfo().GetY());
			this.myStartAngle = this.inst.GetWorldInfo().GetAngle();
			this.lastKnownAngle = this.inst.GetWorldInfo().GetAngle();
			this.theirStartAngle = otherinst.GetWorldInfo().GetAngle();
			this.mode = mode_;
			
			this.pinWidthRelative = this.inst.GetWorldInfo().GetWidth()-this.pinObject.GetWorldInfo().GetWidth();
			this.pinHeightRelative = this.inst.GetWorldInfo().GetHeight()-this.pinObject.GetWorldInfo().GetHeight();
			this.pinScaleRelativeX = this.inst.GetWorldInfo().GetWidth()/this.pinObject.GetWorldInfo().GetWidth();
			this.pinScaleRelativeY = this.inst.GetWorldInfo().GetHeight()/this.pinObject.GetWorldInfo().GetHeight();
			this.pinOriginalWidth = this.pinObject.GetWorldInfo().GetWidth();
			this.pinOriginalHeight = this.pinObject.GetWorldInfo().GetHeight();
			this.childMirror = (this.inst.GetWorldInfo().GetWidth()/Math.abs(this.inst.GetWorldInfo().GetWidth()));
			this.parentMirror = (this.pinObject.GetWorldInfo().GetWidth()/Math.abs(this.pinObject.GetWorldInfo().GetWidth()));
			this.childFlip = (this.inst.GetWorldInfo().GetHeight()/Math.abs(this.inst.GetWorldInfo().GetHeight()));
			this.parentFlip = (this.pinObject.GetWorldInfo().GetHeight()/Math.abs(this.pinObject.GetWorldInfo().GetHeight()));
			
			this.pinned = true;
		},
		Unpin()
		{
			this.pinObject = null;
			this.pinned = false;
		},
		pinX(choice_)
		{
			this.x = choice_;
		},
		pinY(choice_)
		{
			this.y = choice_;
		},
		pinZindex(choice_)
		{
			this.zIndex = choice_;
		},
		pinAngle(choice_)
		{
			this.angle = choice_;
		},
		pinWidth(choice_)
		{
			this.width = choice_;
		},
		pinHeight(choice_)
		{
			this.height = choice_;
		},
		pinOpacity(choice_)
		{
			this.opacity = choice_;
		},
		pinVisibility(choice_)
		{
			this.visibility = choice_;
		},
		pinCollisionEnabled(choice_)
		{
			this.collisions = choice_;
		},
		pinHotspotX(choice_)
		{
			this.hotspotX = choice_;
		},
		pinHotspotY(choice_)
		{
			this.hotspotY = choice_;
		},
		pinImagepoint(choice_)
		{
			this.pinImagepoint = choice_;
		},
		pinAnimation(choice_)
		{
			this.pinAnimation = choice_;
		},
		pinFrame(choice_)
		{
			this.pinFrame = choice_;
		},
		pinMirror(choice_)
		{
			this.pinMirror = choice_;
		},
		pinFlip(choice_)
		{
			this.pinFlip = choice_;
		},
		pinDestroy(choice_)
		{
			this.pinDestroy = choice_;
		}
		
	};
}