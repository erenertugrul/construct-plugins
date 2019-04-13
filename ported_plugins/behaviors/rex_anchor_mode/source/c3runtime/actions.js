"use strict";

{
	C3.Behaviors.rex_Anchor_mod.Acts =
	{

		SetEnabled(e)
		{
			// Is enabled and disabling
			if (this.enabled && e === 0)
				this.enabled = false;
			// Is disabled and enabling
			else if (!this.enabled && e !== 0)
			{
				this.inst.GetWorldInfo()._UpdateBbox();
				this.xleft = this.inst.GetWorldInfo().GetBoundingBox().getLeft();
				this.ytop = this.inst.GetWorldInfo().GetBoundingBox().getTop();
				this.xright = this._runtime.GetViewportWidth() - this.inst.GetWorldInfo().GetBoundingBox().getLeft();
				this.ybottom = this._runtime.GetViewportHeight() - this.inst.GetWorldInfo().GetBoundingBox().getTop();
				this.rdiff = this._runtime.GetViewportWidth() - this.inst.GetWorldInfo().GetBoundingBox().getRight();
				this.bdiff = this._runtime.GetViewportHeight() - this.inst.GetWorldInfo().GetBoundingBox().getBottom();
				this.enabled = true;
			}
		}
	};
}