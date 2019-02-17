"use strict";

{
	C3.Behaviors.Rex_light.Exps =
	{
	    HitX()
	    {
	        var x = this.inst.GetWorldInfo().GetX() + this.inst.GetWorldInfo().GetWidth() * Math.cos(this.inst.GetWorldInfo().GetAngle());
	        return (x);
	    },

	    HitY()
	    {
	        var y = this.inst.GetWorldInfo().GetY() + this.inst.GetWorldInfo().GetWidth() * Math.sin(this.inst.GetWorldInfo().GetAngle());
	        return (y);
	    },

	    HitUID()
	    {
	        return (this.exp_HitUID);
	    },

	    MaxWidth()
	    {
	        return (this.max_width);
	    },  
	    
	    ReflectionAngle(normal)
	    {    
	        var normalangle;
	        if (normal == null)
	        {
	            var hitx = this.inst.GetWorldInfo().GetX() + this.inst.GetWorldInfo().GetWidth() * Math.cos(this.inst.GetWorldInfo().GetAngle());
	            var hity = this.inst.GetWorldInfo().GetY() + this.inst.GetWorldInfo().GetWidth() * Math.sin(this.inst.GetWorldInfo().GetAngle());
	            normalangle = this.get_box_noraml(this.exp_HitUID, hitx, hity);
	        }
	        else
	        {
	            normalangle = C3.toRadians(normal);
	        }
	        var startangle = this.inst.GetWorldInfo().GetAngle();
	        var vx = Math.cos(startangle);
	        var vy = Math.sin(startangle);
	        var nx = Math.cos(normalangle);
	        var ny = Math.sin(normalangle);
	        var v_dot_n = vx * nx + vy * ny;
	        var rx = vx - 2 * v_dot_n * nx;
	        var ry = vy - 2 * v_dot_n * ny;
	        var ra = C3.angleTo(0, 0, rx, ry);
	        return (C3.toDegrees(ra));
	    }  
	};
}