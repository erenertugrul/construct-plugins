"use strict";

{
	C3.Plugins.Rex_ProjectionTx.Instance = class Rex_ProjectionTxInstance extends C3.SDKInstanceBase
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
		        this.SetVectorU(properties[2], properties[3]);
		        this.SetVectorV(properties[4], properties[5]);
		        this.is_8dir = (properties[6] == 1);   
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
	            "ox": this.PositionOX,
	            "oy": this.PositionOY,
	            "ux": this.UX,
	            "uy": this.UY,
	            "vx": this.VX,
	            "vy": this.VY,
	            "is8d": this.is_8dir
			};
		}
		
		LoadFromJson(o)
		{
	        this.SetPOX(o["ox"]);
	        this.SetPOY(o["oy"]); 
	        this.SetVectorU(o["ux"], o["uy"]);
	        this.SetVectorV(o["vx"], o["vy"]);        
	        this.is_8dir = o["is8d"]; 
		}
		SetPOX(pox)
		{
		    this.PositionOX = pox;       
		} 
		SetPOY(poy)
		{
		    this.PositionOY = poy;
		} 
		GetPOX()
		{
		    return this.PositionOX;       
		} 
		GetPOY()
		{
		    return this.PositionOY;
		} 
		SetVectorU(dx, dy)
		{
		    this.UX = dx;
		    this.UY = dy;
		} 
		SetVectorV(dx, dy)
		{
		    this.VX = dx;
		    this.VY = dy;
		}	

		LXYZ2PX(lx, ly, lz)
		{
		    var x = (lx * this.UX) + (ly * this.VX);
		    return x+this.PositionOX;
		}
		LXYZ2PY (lx, ly, lz)
		{
		    var y = (lx * this.UY) + (ly * this.VY);
		    return y+this.PositionOY;
		}   

		PXY2LX(px, py)
		{
		    // offset to origin
			px -= this.PositionOX;
			py -= this.PositionOY;

		    var lx = InterceptSegment(px,py, px-this.UX, py-this.UY, 0,0, this.VX,this.VY);
		    return lx;
		}
		PXY2LY(px,py)
		{
		    // offset to origin
			px -= this.PositionOX;
			py -= this.PositionOY;

		    var ly = InterceptSegment(px,py, px-this.VX, py-this.VY, 0,0, this.UX,this.UY);
		    return ly;
		}


		GetNeighborLX(x, y, dir)
		{
		    var dx = map_01[dir][0];
			return (x+dx);
		}


		GetNeighborLY(x, y, dir)
		{
		    var dy = map_01[dir][1];
		    return (y+dy);
		}

		GetDirCount()
		{  
		    return (!this.is_8dir)? 4:8;						 
		}

		XYZ2LAd(xyz_o, xyz_to)
		{  
		    var dir = this.XYZ2Dir(xyz_o, xyz_to); 
		    var angle;
		    if (dir == null)
		        angle = -1;
		    else
		    {
		        if (dir < 4)
		            angle = dir*90;
		        else
		            angle = (dir - 4)*90 + 45;
		    }
		    return angle;			 
		}

		XYZ2Dird(xyz_o, xyz_to)
		{  
		    var dx = xyz_to.x - xyz_o.x;
		    var dy = xyz_to.y - xyz_o.y;	    
		    var vmax = Math.max(quickAbs(dx), quickAbs(dy));
		    if (vmax != 0)
		    {
		        dx = dx/vmax;
		        dy = dy/vmax;
		    }
		    var dir = dxy2dir(dx, dy, xyz_o.x, xyz_o.y);  
		    return dir;				 
		}

		NeighborXYZ2Dird(xyz_o, xyz_to)
		{  
		    var dx = xyz_to.x - xyz_o.x;
		    var dy = xyz_to.y - xyz_o.y;
		    var dir = dxy2dir(dx, dy, xyz_o.x, xyz_o.y);  
		    
		    if ((dir != null) && (!this.is_8dir) && (dir > 3))	    
		        dir = null;
		        
		    return dir;				 
		}    

		LXYZRotate2LX(lx, ly, lz, dir)
		{
		    var new_lx;
		    switch (dir)
		    {	        
		    case 1: new_lx = -ly; break;
		    case 2: new_lx = -lx; break;
		    case 3: new_lx = ly; break;
		    default: new_lx = lx; break;	            
		    }

		    return new_lx;        
		}

		LXYZRotate2LY(lx, ly, lz, dir)
		{
		    var new_ly;
		    switch (dir)
		    {
		    case 1: new_ly = lx; break;
		    case 2: new_ly = -ly; break;
		    case 3: new_ly = -lx; break;
		    default: new_ly = ly; break;	        
		    }

		    return new_ly;        
		}  

		LXYZ2Dist(lx0, ly0, lz0, lx1, ly1, lz1, is_rough)
		{
		    var dx = lx1 - lx0;
		    var dy = ly1 - ly0;
		    var d;
		    if (!is_rough)
		        d = Math.sqrt(dx*dx + dy*dy);
		    else
		        d = quickAbs(dx) + quickAbs(dy);
		   return d;
		}  

		OffsetLX(lx0, ly0, lz0, offsetx, offsety, offsetz)
		{
		    return lx0 + offsetx;
		} 	 

		OffsetLY(lx0, ly0, lz0, offsetx, offsety, offsetz)
		{
		    return ly0 + offsety;
		} 



		PXY2EdgePA(px1, py1, px0, py0)
		{
		    var a, a01 = cr.angleTo(px1, py1, px0, py0);;
		    a = a01;
			return a;
		}

	};
}