"use strict";

{
	C3.Behaviors.Rex_pin2imgpt.Acts =
	{
		Pin(obj, imgpt, mode_)
		{
			if (!obj)
				return;
				
			var otherinst = obj.GetFirstPicked(this.inst);
			
			if (!otherinst)
				return;
				                
			this.pinObject = otherinst;
	        this.imgpt = imgpt;
			this.myStartAngle = this.inst.GetWorldInfo().GetAngle();
			this.lastKnownAngle = this.inst.GetWorldInfo().GetAngle();
			this.theirStartAngle = otherinst.GetWorldInfo().GetAngle();      
	        this.mode = mode_; 	
		},
		Unpin()
		{
			this.pinObject = null;
		}
	};
}
