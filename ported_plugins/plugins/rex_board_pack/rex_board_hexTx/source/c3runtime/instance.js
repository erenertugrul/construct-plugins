"use strict";

{
	C3.Plugins.Rex_SLGHexTx.Instance = class Rex_SLGHexTxInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this.check_name = "LAYOUT";

			if (properties)		// note properties may be null in some cases
			{
			    this.SetPOX(properties[0]);
			    this.SetPOY(properties[1]);
			    this.SetWidth(properties[2]);
			    this.SetHeight(properties[3]);
			    var is_up2down = (properties[4]===1);
			    var is_even = (properties[5]===1);
			    this.SetOrientation(is_up2down, is_even);
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"m": this.mode,
                 "w": this.width,
                 "h": this.height,
                 "ox": this.pox,
                 "oy": this.poy
			};
		}
		
		LoadFromJson(o)
		{
	        this.mode = o["m"];    
		    this.SetWidth(o["w"]);
		    this.SetHeight(o["h"]);
		    this.SetPOX(o["ox"]);
		    this.SetPOY(o["oy"]);  
		}
		SetPOX(pox)
		{
		    this.pox = pox;       
		} 
		SetPOY(poy)
		{
		    this.poy = poy;
		}   
		GetPOX()
		{
		    return this.pox;       
		} 
		GetPOY()
		{
		    return this.poy;
		} 	
		SetWidth(width)
		{
		    this.width = width;
		    this.halfWidth = width/2;        
		}
		SetHeight(height)
		{
		    this.height = height;
		    this.halfHeight = height/2;
		} 
		SetOrientation(is_up2down, is_even)
		{
		    this.mode = (!is_up2down && !is_even)? ODD_R:
		                (!is_up2down &&  is_even)? EVEN_R:
		                ( is_up2down && !is_even)? ODD_Q:
		                ( is_up2down &&  is_even)? EVEN_Q:0;       
		}	

		qr2x(q, r)
		{
		    var x;
		    switch (this.mode)
		    {
		    case ODD_R:
		        x = q - (r - (r&1)) / 2;     
		    break;
		    
		    case EVEN_R:
		        x = q - (r + (r&1)) / 2;    	   	        
		    break;
		    
		    case ODD_Q:
		    case EVEN_Q:	    
		        x = q;
		    break;	    
		    }
		    return x;
		}  

		qr2y(q, r)
		{
		    var x = this.qr2x(q, r);
		    var z = this.qr2z(q, r);
		    var y = -x-z;
		    return y;
		}	

		qr2z(q, r)
		{
		    var z;
		    switch (this.mode)
		    {
		    case ODD_R:
		    case EVEN_R:
		        z = r; 
		    break;

		    case ODD_Q:
		        z = r - (q - (q&1)) / 2;
		    break;
		    case EVEN_Q:	    
		        z = r - (q + (q&1)) / 2;
		    break;	    
		    }
		    return z;
		} 

		xyz2q(x, y, z)
		{
		    var q;
		    switch (this.mode)
		    {
		    case ODD_R:
		        q = x + (z - (z&1)) / 2;
		    break;
		    case EVEN_R:
		        q = x + (z + (z&1)) / 2;
		    break;

		    case ODD_Q:
		    case EVEN_Q:
		        q = x;
		    break;	    
		    }
		    return q;
		} 
			
		xyz2r(x, y, z)
		{
		    var r;
		    switch (this.mode)
		    {
		    case ODD_R:
		    case EVEN_R:
		        r = z; 
		    break;

		    case ODD_Q:
		        r = z + (x - (x&1)) / 2;
		    break;
		    case EVEN_Q:	    
		        r = z + (x + (x&1)) / 2;
		    break;	    
		    }
		    return r;
		}  
				
		LXYZ2PX(lx, ly, lz)
		{
		    var px;
		    switch (this.mode)
		    {
		    case ODD_R:
		        px = (lx*this.width) + this.pox;
		        if (ly&1)
		            px += this.halfWidth;	        
		    break;
		    
		    case EVEN_R:
		        px = (lx*this.width) + this.pox;
		        if (ly&1)
		            px -= this.halfWidth;	   	        
		    break;
		    
		    case ODD_Q:
		    case EVEN_Q:	    
		        px = (lx*this.width) + this.pox;
		    break;	    
		    }
		    return px;
		}
		LXYZ2PY(lx, ly, lz)
		{
		    var py;
		    switch (this.mode)
		    {
		    case ODD_R:
		    case EVEN_R:
		        py = (ly*this.height) + this.poy;	        
		    break;
		    
		    case ODD_Q:
		        py = (ly*this.height) + this.poy;
		        if (lx&1)
		            py += this.halfHeight;	        
		    break;
		    
		    case EVEN_Q:	    
		        py = (ly*this.height) + this.poy;
		        if (lx&1)
		            py -= this.halfHeight;	  	        
		    break;	    
		    }
		    return py;
		}   
		PXY2LX(px, py)
		{
		    var lx;
		    var offx=px-this.pox;
		    switch (this.mode)
		    {
		    case ODD_R:
		    case EVEN_R:
		        var ly = this.PXY2LY( px, py );
		        if (ly&1)
		        {
		            if (this.mode == ODD_R)
		                offx -= this.halfWidth;
		            else
		                offx += this.halfWidth;
		        } 	        
		    break;   
		    }	       
		    lx = Math.round( offx/this.width );
			return lx;
		}
		PXY2LY(px, py)
		{
		    var ly;
		    var offy=py-this.poy;
		    switch (this.mode)
		    {
		    case ODD_Q:
		    case EVEN_Q:	
		        var lx = this.PXY2LX( px, py );
		        if (lx&1)
		        {
		            if (this.mode == ODD_Q)
		                offy -= this.halfHeight;
		            else
		                offy += this.halfHeight;
		        } 	        
		    break;   
		    }	       
		    ly = Math.round( offy/this.height );
		    return ly;
		}


		get_neighbor(q, r, dir)
		{	    
		    var parity;
		    switch (this.mode)
		    {
		    case ODD_R:
		    case EVEN_R:
		        parity = r & 1;	        
		    break;
		    
		    case ODD_Q:
		    case EVEN_Q:
		        parity = q & 1; 	        
		    break;	    
		    }
		    var d = neighbors[this.mode][parity][dir];	   	   
			return d;
		}
		 	
		GetNeighborLX(q, r, dir)
		{  	   
			return q + this.get_neighbor(q, r, dir)[0];
		}

		GetNeighborLY(q, r, dir)
		{	    
			return r + this.get_neighbor(q, r, dir)[1];
		}
			
		GetDirCount()
		{  
		    return 6;						 
		}



		XYZ2LA(xyz_o, xyz_to)
		{  
		    var dir = this.XYZ2Dir(xyz_o, xyz_to); 
		    var angle = (dir != null)? (dir*60):(-1);
		    switch (this.mode)  
		    {
		    case ODD_Q:
		    case EVEN_Q:
		        if (dir != null)
		            angle += 30; 	        
		    break;	    
		    }
		    return angle;				 
		}

		XYZ2Dir(xyz_o, xyz_to)
		{
		    var dx = xyz_to.x - xyz_o.x;
		    var dy = xyz_to.y - xyz_o.y;	    
		    var vmax = Math.max(quickAbs(dx), quickAbs(dy));
		    if (vmax != 0)
		    {
		        dx = dx/vmax;
		        dy = dy/vmax;
		    }

		    var dir = dxy2dir(dx, dy, xyz_o.x, xyz_o.y, this.mode); 
		    return dir;  
		}

		NeighborXYZ2Dir(xyz_o, xyz_to)
		{
		    var dx = xyz_to.x - xyz_o.x;
		    var dy = xyz_to.y - xyz_o.y;
		    var dir = dxy2dir(dx, dy, xyz_o.x, xyz_o.y, this.mode); 
		    return dir;  
		}	


		hex_rotate (q, r, dir)
		{
		    var x = this.qr2x(q,r);
		    var y = this.qr2y(q,r);
		    var z = this.qr2z(q,r);
		    var new_x, new_y, new_z;
		    switch (dir)
		    {
		    case 1: new_x=-z; new_y=-x; new_z=-y; break;
		    case 2: new_x= y; new_y= z; new_z= x; break;
		    case 3: new_x=-x; new_y=-y; new_z=-z; break;
		    case 4: new_x= z; new_y= x; new_z= y; break;
		    case 5: new_x=-y; new_y=-z; new_z=-x; break;
		    default: new_x= x; new_y= y; new_z= z; break;
		    }
		    rotate_result.q = this.xyz2q(new_x, new_y, new_z);
		    rotate_result.r = this.xyz2r(new_x, new_y, new_z);
		    return rotate_result;
		}
		LXYZRotate2LX (lx, ly, lz, dir)
		{	  
		    return this.hex_rotate(lx, ly, dir).q;
		}

		LXYZRotate2LY (lx, ly, lz, dir)
		{
		    return this.hex_rotate(lx, ly, dir).r;
		}	

		LXYZ2Dist (q0, r0, s0, q1, r1, s1)
		{       
		    var dx = this.qr2x(q1,r1) - this.qr2x(q0,r0);
		    var dy = this.qr2y(q1,r1) - this.qr2y(q0,r0);
		    var dz = this.qr2z(q1,r1) - this.qr2z(q0,r0);
		    
		    return (quickAbs(dx) + quickAbs(dy) + quickAbs(dz)) / 2
		}   

		OffsetLX (lx0, ly0, lz0, offsetx, offsety, offsetz)
		{
		    var new_lx = lx0 + offsetx;
		   
		    switch (this.mode)
		    {
		    case ODD_R:
		        if ((offsety&1) !== 0)
		        {
		            var new_ly = ly0 + offsety;
		            if ((new_ly&1) === 0)
		                new_lx += 1;
		        }
		    break;
		    
		    case EVEN_R:
		        if ((offsety&1) !== 0)
		        {
		            var new_ly = ly0 + offsety;
		            if ((new_ly&1) === 0)
		                new_lx -= 1;
		        }
		    break;                 
		    }

		    return new_lx;
		} 	 

		OffsetLY (lx0, ly0, lz0, offsetx, offsety, offsetz)
		{	    
		    var new_ly = ly0 + offsety;
		   
		    switch (this.mode)
		    {
		    case ODD_Q:
		        if ((offsetx&1) !== 0)
		        {
		            var new_lx = lx0 + offsetx;
		            if ((new_lx&1) == 0)
		                new_ly += 1;
		        }
		    break;
		    
		    case EVEN_Q:
		        if ((offsetx&1) !== 0)
		        {
		            var new_lx = lx0 + offsetx;
		            if ((new_lx&1) == 0)
		                new_ly -= 1;
		        }
		    break;                 
		    }

		    return new_ly;
		}	    



		PXY2EdgePA (px1, py1, px0, py0)
		{
			return C3.angleTo(px1, py1, px0, py0);
		} 			

	};
}