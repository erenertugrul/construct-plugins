"use strict";
function a(a, b, c, d, e) {
    if ("undefined" == typeof b) {
        const b = a.GetLayerByIndex(0);
        return b.CanvasCssToLayer_DefaultTransform(c, d)[e ? 0 : 1]
    } else {
        const f = a.GetLayer(b);
        return f ? f.CanvasCssToLayer(c, d)[e ? 0 : 1] : 0
    }
}
{
	C3.Plugins.MouseLock.Exps =
	{
		RawX()
		{
			if(this.disable_if_unlock && !this.is_locked)	{return(0);}
			else											{return(this.raw_x);}
		},
		RawY()
		{
			if(this.disable_if_unlock && !this.is_locked)	{return(0);}
			else											{return(this.raw_y);}
		},
		MouseLockX(layerparam)
		{
			return a(this._runtime.GetCurrentLayout(), layerparam, this.mouse_lock_x,  this.mouse_lock_y, !0)
		},
		MouseLockY(layerparam)
		{
			return a(this._runtime.GetCurrentLayout(), layerparam, this.mouse_lock_x,  this.mouse_lock_y, !1)
		},
		MovementAngle()
		{
			//return angle
			return (this.movement_angle);
		}
	};
}