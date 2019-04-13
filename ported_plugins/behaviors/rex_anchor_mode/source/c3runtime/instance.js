"use strict";

{
	C3.Behaviors.rex_Anchor_mod.Instance = class rex_Anchor_modInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			
			
			this.inst = this._inst;
			this.inst.GetWorldInfo()._UpdateBbox();
			this.xleft = this.inst.GetWorldInfo().GetBoundingBox().getLeft();
			this.ytop = this.inst.GetWorldInfo().GetBoundingBox().getTop();
			this.xright = this._runtime.GetViewportWidth() - this.inst.GetWorldInfo().GetBoundingBox().getLeft();
			this.ybottom = this._runtime.GetViewportHeight() - this.inst.GetWorldInfo().GetBoundingBox().getTop();
			this.rdiff = this._runtime.GetViewportWidth() - this.inst.GetWorldInfo().GetBoundingBox().getRight();
			this.bdiff = this._runtime.GetViewportHeight() - this.inst.GetWorldInfo().GetBoundingBox().getBottom();
		
		// extend
		

			if (properties)
			{
				this.anch_left = properties[0];		// 0 = left, 1 = right, 2 = none
				this.anch_top = properties[1];			// 0 = top, 1 = bottom, 2 = none
				this.anch_right = properties[2];		// 0 = none, 1 = right
				this.anch_bottom = properties[3];		// 0 = none, 1 = bottom
				this.enabled = (properties[4] !== 0);
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
				"xleft": this.xleft,
				"ytop": this.ytop,
				"xright": this.xright,
				"ybottom": this.ybottom,
				"rdiff": this.rdiff,
				"bdiff": this.bdiff,
				"enabled": this.enabled
			};
		}

		LoadFromJson(o)
		{
			this.xleft = o["xleft"];
			this.ytop = o["ytop"];
			this.xright = o["xright"];
			this.ybottom = o["ybottom"];
			this.rdiff = o["rdiff"];
			this.bdiff = o["bdiff"];
			this.enabled = o["enabled"];
		}
		is_layer_size_changed()
		{	    
		    var layer = this.inst.GetWorldInfo().GetLayer();
		    return (this.viewLeft_saved != layer.GetViewport().getLeft()) ||
		           (this.viewRight_saved != layer.GetViewport().getRight()) ||
		           (this.viewTop_saved != layer.GetViewport().getTop()) ||
		           (this.viewBottom_saved != layer.GetViewport().getBottom());
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

			
			var n;
			var layer = this.inst.GetWorldInfo().GetLayer();
			var inst = this.inst;
			var bbox = this.inst.GetWorldInfo().GetBoundingBox();
			
			// Anchor left to window left
			if (this.anch_left === 0)
			{
				inst.GetWorldInfo()._UpdateBbox();
				n = (layer.GetViewport().getLeft() + this.xleft) - bbox.getLeft();
				
				if (n !== 0)
				{
					inst.GetWorldInfo().SetX(inst.GetWorldInfo().GetX()+n);
					inst.GetWorldInfo().SetBboxChanged();
				}
			}
			
			// Anchor left to window right
			else if (this.anch_left === 1)
			{
				inst.GetWorldInfo()._UpdateBbox();
				n = (layer.GetViewport().getRight() - this.xright) - bbox.getLeft();

				if (n !== 0)
				{
					inst.GetWorldInfo().SetX(inst.GetWorldInfo().GetX()+n);
					inst.GetWorldInfo().SetBboxChanged();
				}
			}
			
			// Anchor top to window top
			if (this.anch_top === 0)
			{
				inst.GetWorldInfo()._UpdateBbox();
				n = (layer.GetViewport().getTop() + this.ytop) - bbox.getTop();

				if (n !== 0)
				{
					inst.GetWorldInfo().SetY(inst.GetWorldInfo().GetY()+n);
					inst.GetWorldInfo().SetBboxChanged();
				}
			}
			
			// Anchor top to window bottom
			else if (this.anch_top === 1)
			{
				inst.GetWorldInfo()._UpdateBbox();
				n = (layer.GetViewport().getBottom() - this.ybottom) - bbox.getTop();

				if (n !== 0)
				{
					inst.GetWorldInfo().SetY(inst.GetWorldInfo().GetY()+n);
					inst.GetWorldInfo().SetBboxChanged();
				}
			}
			
			// Anchor right to window right
			if (this.anch_right === 1)
			{
				inst.GetWorldInfo()._UpdateBbox();
				n = (layer.GetViewport().getRight() - this.rdiff) - bbox.getRight();
				
				if (n !== 0)
				{
					inst.GetWorldInfo().SetWidth(inst.GetWorldInfo().GetWidth()+n);
					if (inst.GetWorldInfo().GetWidth() < 0)
						inst.GetWorldInfo().SetWidth(0);
					
					inst.GetWorldInfo().SetBboxChanged();
				}
			}
			
			// Anchor bottom to window bottom
			if (this.anch_bottom === 1)
			{
				inst.GetWorldInfo()._UpdateBbox();
				n = (layer.GetViewport().getBottom() - this.bdiff) - bbox.getBottom();
				
				if (n !== 0)
				{
					inst.GetWorldInfo().SetHeight(inst.GetWorldInfo().GetHeight()+n);
					
					if (inst.GetWorldInfo().GetHeight()< 0)
						inst.GetWorldInfo().SetHeight(0);
					
					inst.GetWorldInfo().SetBboxChanged();
				}
			}
			
			if (this.set_once)
			    this.Trigger(C3.Behaviors.rex_Anchor_mod.Cnds.OnAnchored); 
		}
		
	};
}