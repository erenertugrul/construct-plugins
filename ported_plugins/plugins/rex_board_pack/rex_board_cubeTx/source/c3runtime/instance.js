"use strict";

{
	C3.Plugins.Rex_SLGCubeTx.Instance = class Rex_SLGCubeTxInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			
			if (properties)		// note properties may be null in some cases
			{
				this.check_name = "LAYOUT";
			    this.is_isometric = (properties[0]==1);
			    this.PositionOX = properties[1];
			    this.PositionOY = properties[2];
			    this.SetWidth(properties[3]);
			    this.SetHeight(properties[4]);
			    this.deep = properties[5];
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"iso": this.is_isometric,
                 "w": this.width,
                 "h": this.height,
                 "ox": this.PositionOX,
                 "oy": this.PositionOY
			};
		}
		
		LoadFromJson(o)
		{
			this.is_isometric = o["iso"];
	        this.SetWidth(o["w"]);
	        this.SetHeight(o["h"]);   
	        this.SetPOX(o["ox"]);
	        this.SetPOY(o["oy"]);  
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
		SetWidth(width)
		{
	        this.width = width;
	        this.half_width = width/2;        
		} 
		SetHeight(height)
		{
	        this.height = height;
	        this.half_height = height/2;        
		}     	
		LXYZ2PX(logic_x, logic_y, logic_z)
		{
	        var x = (this.is_isometric)? ((logic_x - logic_y)*this.half_width):
	                                     (logic_x*this.width);
	        return x+this.PositionOX;
		}
		LXYZ2PY(logic_x, logic_y, logic_z)
		{
	        var y = (this.is_isometric)? ((logic_x + logic_y)*this.half_height):
	                                     (logic_y*this.height);
	        y -= (logic_z*this.deep);
	        return y+this.PositionOY;
		} 
		PXY2LX(physical_x,physical_y)
		{
		    var lx;
		    if (this.is_isometric)
			{
			    physical_x -= this.PositionOX;
			    physical_y -= this.PositionOY;
			    lx = 0.5*(Math.round(physical_y/this.half_height)+Math.round(physical_x/this.half_width));
			}
			else
			    lx = (physical_x - this.PositionOX)/this.width;
	        return lx;
		}
		PXY2LY(physical_x,physical_y)
		{
		    var ly;
		    if (this.is_isometric)
			{
			    physical_x -= this.PositionOX;
			    physical_y -= this.PositionOY;
			    ly = 0.5*(Math.round(physical_y/this.half_height)-Math.round(physical_x/this.half_width));
			}
			else
			    ly = (physical_y - this.PositionOY)/this.height;
	        return ly;
		}
		GetNeighborLX(x, y, dir)
		{
	        var dx = (dir==0)? 1:
			         (dir==2)? (-1):
					          0;
			return (x+dx);
		}
		GetNeighborLY(x, y, dir)
		{
	        var dy = (dir==1)? 1:
			        (dir==3)? (-1):
					          0;       
	        return (y+dy);
		}
		GetDirCount()
		{  
	        return 4;						 
		}
		XYZ2LA(xyz_o, xyz_to)
		{  
	        return null;				 
		}
		XYZ2Dir(xyz_o, xyz_to)
		{  
	        return null;				 
		}	
		

	};
}