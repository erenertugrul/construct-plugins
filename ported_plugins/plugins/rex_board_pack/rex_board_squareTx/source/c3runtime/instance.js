"use strict";

{
	C3.Plugins.Rex_SLGSquareTx.Instance = class Rex_SLGSquareTxInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this.check_name = "LAYOUT";
			
			if (properties)		// note properties may be null in some cases
			{
		        
		        this.mode = properties[0];
		        this.is8Dir = (properties[5] == 1);
		                
		        this.SetPOX(properties[1]);
		        this.SetPOY(properties[2]);
		        this.SetWidth(properties[3]);
		        this.SetHeight(properties[4]);
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"iso": this.mode,
                 "w": this.width,
                 "h": this.height,
                 "ox": this.pox,
                 "oy": this.poy,
                 "is8d": this.is8Dir
			};
		}
		
		LoadFromJson(o)
		{
			this.mode = o["iso"];
	        this.SetWidth(o["w"]);
	        this.SetHeight(o["h"]);   
	        this.SetPOX(o["ox"]);
	        this.SetPOY(o["oy"]); 
	        this.is8Dir = o["is8d"];  
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
		LXYZ2PX(lx, ly, lz)
		{
		    var x;
		    if (this.mode == 0)  // Orthogonal
		    {
		        x = lx * this.width;
		    }
		    else if (this.mode == 1)  // Isometric
		    {
		        x = (lx - ly) * this.halfWidth;
		    }
		    else if (this.mode == 2)  // Staggered
		    {
		        x = lx * this.width;
		        if (ly&1)
		            x += this.halfWidth;
		    }

		    return x+this.pox;
		}
		LXYZ2PY(lx, ly, lz)
		{
		    var y;
		    if (this.mode == 0)  // Orthogonal
		    {
		        y = ly * this.height;
		    }
		    else if (this.mode == 1)  // Isometric
		    {
		        y = (lx + ly) * this.halfHeight;
		    }
		    else if (this.mode == 2)  // Staggered
		    {
		        y = ly * this.halfHeight;
		    }

		    return y+this.poy;
		}   
		PXY2LX(px, py)
		{
		    var lx;
		    if (this.mode == 0)   // Orthogonal
		    {
		        px -= this.pox;
		        lx = Math.round(px/this.width);
		    }
		    else if (this.mode == 1)   // Isometric
			{
			    px -= this.pox;
			    py -= this.poy;
			    lx = 0.5 * (Math.round(py/this.halfHeight) + Math.round(px/this.halfWidth));
			}
			else if (this.mode == 2)  // Staggered
			{
			    var ly = Math.round((py - this.poy)/this.halfHeight);
			    px = px - this.pox;
			    if (ly&1)
			        px -= this.halfWidth;
			    lx = Math.round(px/this.width);
			}
			    
		    return lx;
		}
		PXY2LY(px,py)
		{
		    var ly;
		    if (this.mode == 0)   // Orthogonal
		    {
		        py -= this.poy;
		        ly = Math.round(py/this.height);
		    }
		    else if (this.mode == 1)   // Isometric
			{
			    px -= this.pox;
			    py -= this.poy;
			    ly = 0.5 * (Math.round(py/this.halfHeight) - Math.round(px/this.halfWidth));
			}
			else if (this.mode == 2)  // Staggered
		    {
			    ly = Math.round((py - this.poy)/this.halfHeight);
			}
			    
		    return ly;
		}


		GetNeighborLX(x, y, dir)
		{
		    var dx;
		    if (this.mode == 0)   // Orthogonal
		    {
		        dx = map_01[dir][0];
		    }
		    else if (this.mode == 1)   // Isometric
			{
		        dx = map_01[dir][0];
			}
			else if (this.mode == 2)  // Staggered
		    {
		        if (y&1)
		            dx = nlx_map_2_1[dir];
		        else
		            dx = nlx_map_2_0[dir];
			}
			
			return (x+dx);
		}


		GetNeighborLY(x, y, dir)
		{
		    var dy;
		    if (this.mode == 0)   // Orthogonal
		    {
		        dy = map_01[dir][1];
		    }
		    else if (this.mode == 1)   // Isometric
			{
		        dy = map_01[dir][1];
			}
			else if (this.mode == 2)  // Staggered
		    {
		        dy = nly_map_2[dir];
			} 
		    return (y+dy);
		}

		GetDirCount()
		{  
		    return (!this.is8Dir)? 4:8;						 
		}


		XYZ2LA(xyz_o, xyz_to)
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
		    
		    if ((dir != null) && (!this.is8Dir) && (dir > 3))	    
		        dir = null;
		        
		    return dir;				 
		}    

		LXYZRotate2LX(lx, ly, lz, dir)
		{
		    var new_lx;
		    switch (this.mode)
		    {
		    case 0:    // Orthogonal
		    case 1:    // Isometric
		        switch (dir)
		        {	        
		        case 1: new_lx = -ly; break;
		        case 2: new_lx = -lx; break;
		        case 3: new_lx = ly; break;
		        default: new_lx = lx; break;	            
		        }
		    break;
		        
		    case 2:
		    break;
		    }	

		    return new_lx;        
		}

		LXYZRotate2LY(lx, ly, lz, dir)
		{
		    var new_ly;
		    switch (this.mode)
		    {
		    case 0:    // Orthogonal
		    case 1:    // Isometric
		        switch (dir)
		        {
		        case 1: new_ly = lx; break;
		        case 2: new_ly = -ly; break;
		        case 3: new_ly = -lx; break;
		        default: new_ly = ly; break;	        
		        }
		    break;
		        
		    case 2:
		    break;
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
		    var a, a01 = C3.angleTo(px1, py1, px0, py0);;
		    switch (this.mode)
		    {
		    case 0:      // Orthogonal
		        a = a01;   
		        break;
		        
		    case 1:      // Isometric
		    case 2:      // Staggered
		        a = 4.7123889804 - a01; // 270 - a01 
		        break;
		        
		    }
			return a;
		}

	};
}