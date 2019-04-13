"use strict";

{
	C3.Behaviors.rex_Anchor2.Instance = class rex_Anchor2Instance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			
			
			this.inst = this._inst;

			if (properties)
			{
		        this.alignModeX = properties[0]; // 0=left, 1=right, 2=center, 3=hotspot, 4=none
		        this.viewPortScaleX = properties[1]; // 0=window left, 0.5=window center, 1=window right

		        this.alignModeY = properties[2]; // 0=top, 1=bottom, 2=center, 3=hotspot, 4=none
		        this.viewPortScaleY = properties[3]; // 0=window top, 0.5=window center, 1=window bottom

				this.enabled = (properties[4] !== 0);
				
				// extend
				this.set_once = (properties[5] == 1);
			}
			this.update_cnt = 0;
			this.viewLeft_saved = null;
			this.viewRight_saved = null;
			this.viewTop_saved = null;
			this.viewBottom_saved = null;
			
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
				"enabled": this.enabled,
	            "amx": this.alignModeX,
	            "vx": this.viewPortScaleX,
	            "amy": this.alignModeY,
	            "vy": this.viewPortScaleY,  
			};
		}

		LoadFromJson(o)
		{
			this.enabled = o["enabled"];
	        this.alignModeX = o["amx"];
	        this.viewPortScaleX = o["vx"];
	        this.alignModeY = o["amy"];
	        this.viewPortScaleY = o["vy"]; 
		}
		is_layer_size_changed()
		{	    
		    var layer = this.inst.GetWorldInfo().GetLayer();
		    return (this.viewLeft_saved != layer.GetViewport().getLeft()) ||
		           (this.viewRight_saved != layer.GetViewport().getRight()) ||
		           (this.viewTop_saved != layer.GetViewport().getTop()) ||
		           (this.viewBottom_saved != layer.GetViewport().getBottom());
		}
		set_update_flag()
		{	    
	        if (this.update_cnt === 0)
	            this.update_cnt = 1;
		}	
		/*
		Tick()
		{
			const dt = this._runtime.GetDt(this._inst);
			const wi = this._inst.GetWorldInfo();
			
			// ... code to run every tick for this behavior ...
		}
		*/

		Tick()
		{	   
			if (!this.enabled)
				return;  
				
	        if (this.set_once)
	        {            
	            if (this.is_layer_size_changed())
	            {
	                var layer = this.inst.GetWorldInfo().GetLayer();
			        this.viewLeft_saved = layer.GetViewport().getLeft();
			        this.viewRight_saved = layer.GetViewport().getRight();
			        this.viewTop_saved = layer.GetViewport().getTop();
			        this.viewBottom_saved = layer.GetViewport().getBottom();
			        this.update_cnt = 2;
	            }
	            
	            if (this.update_cnt == 0)  // no need to update
	                return;
	            else                       // update once
	                this.update_cnt -= 1;
	        }
	        var enableX = (this.alignModeX !== 4);
	        var enableY = (this.alignModeY !== 4);
	        
	        if (!enableX && !enableY)
	            return;
			
			var layer = this.inst.GetWorldInfo().GetLayer();
	        var targetX = (enableX)? layer.GetViewport().getLeft() + ( (layer.GetViewport().getRight() - layer.GetViewport().getLeft()) * this.viewPortScaleX ) : 0;
	        var targetY = (enableY)? layer.GetViewport().getTop() + ( (layer.GetViewport().getBottom() - layer.GetViewport().getTop()) * this.viewPortScaleY ) : 0;
	        
			var inst = this.inst;
			var bbox = this.inst.GetWorldInfo().GetBoundingBox();    
	        this.inst.GetWorldInfo()._UpdateBbox();

	        var nx=0, ny=0;

			// X
	        switch (this.alignModeX)
	        {
	        case 0:    // set left edge to targetX
	            nx = targetX + ( inst.GetWorldInfo().GetX() - bbox.getLeft() );
	            break;
	            
	        case 1:    // set right edge to targetX
	            nx = targetX + ( inst.GetWorldInfo().GetX() - bbox.getRight() );
	            break;  

	        case 2:    // cneter
	            nx = targetX + ( inst.GetWorldInfo().GetX() - (bbox.getRight() + bbox.getLeft())/2 );
	            break;             

	        case 3:    // hotspot
	            nx = targetX;
	            break; 

	        case 4:    // None
	            nx = inst.GetWorldInfo().GetX();
	            break;         
	        }
	        
	        // Y
	        switch (this.alignModeY)
	        {
	        case 0:    // top edge
	            ny = targetY + ( inst.GetWorldInfo().GetY() - bbox.getTop() );
	            break;
	            
	        case 1:    // bottom edge
	            ny = targetY + ( inst.GetWorldInfo().GetY() - bbox.getBottom() );
	            break;  

	        case 2:    // cneter
	            ny = targetY + ( inst.GetWorldInfo().GetY() - (bbox.getBottom() + bbox.getTop())/2 );
	            break;     

	        case 3:    // hotspot
	            ny = targetY;
	            break;

	        case 4:    // None
	            ny = inst.GetWorldInfo().GetY();
	            break;               
	        }        
	        
	        if ((nx !== inst.GetWorldInfo().GetX()) || (ny !== inst.GetWorldInfo().GetY()))
	        {
	            inst.GetWorldInfo().SetX(nx);
	            inst.GetWorldInfo().SetY(ny);
	            inst.GetWorldInfo().SetBboxChanged();
	        }
	        
			if (this.set_once)
			    this.Trigger(C3.Behaviors.rex_Anchor2.Cnds.OnAnchored); 
		}
		
	};
}