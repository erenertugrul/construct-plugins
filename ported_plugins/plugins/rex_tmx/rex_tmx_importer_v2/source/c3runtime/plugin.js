"use strict";
function to_clamped_radians(x)
{
	return C3.clampAngle(C3.toRadians(x));
}
// ----
// square layout
    var SquareLayoutKlass = function(pox, poy, width, height, mode)
    {
        this.mode = mode;
        this.SetPOX(pox);
        this.SetPOY(poy);
        this.SetWidth(width);
        this.SetHeight(height);
    };
    var SquareLayoutKlassProto = SquareLayoutKlass.prototype;
      
	SquareLayoutKlassProto.SetPOX = function(pox)
	{
        this.PositionOX = pox;       
	}; 
	SquareLayoutKlassProto.SetPOY = function(poy)
	{
        this.PositionOY = poy;
	}; 
		
	SquareLayoutKlassProto.SetWidth = function(width)
	{
        this.width = width;
        this.half_width = width/2;        
	}; 
	SquareLayoutKlassProto.SetHeight = function(height)
	{
        this.height = height;
        this.half_height = height/2;        
	};   
    SquareLayoutKlassProto.LXYZ2PX =function(lx, ly, lz)
	{
	    var x;
	    if (this.mode == 0)  // Orthogonal
	    {
	        x = lx * this.width;
	    }
	    else if (this.mode == 1)  // Isometric
	    {
	        x = (lx - ly) * this.half_width;
	    }
	    else if (this.mode == 2)  // Staggered
	    {
	        x = lx * this.width;
	        if (ly&1)
	            x += this.half_width;
	    }

        return x+this.PositionOX;
	};
	SquareLayoutKlassProto.LXYZ2PY = function (lx, ly, lz)
	{
	    var y;
	    if (this.mode == 0)  // Orthogonal
	    {
	        y = ly * this.height;
	    }
	    else if (this.mode == 1)  // Isometric
	    {
	        y = (lx + ly) * this.half_height;
	    }
	    else if (this.mode == 2)  // Staggered
	    {
	        y = ly * this.half_height;
	    }

        return y+this.PositionOY;
	};   

// hex layout 
    var ODD_R = 0;
    var EVEN_R = 1;
    var ODD_Q = 2;
    var EVEN_Q = 3;  
    var HexLayoutKlass = function(pox, poy, width, height, mode)
    {
        this.mode = mode;
        this.SetPOX(pox);
        this.SetPOY(poy);
        this.SetWidth(width);
        this.SetHeight(height);
    };
    var HexLayoutKlassProto = HexLayoutKlass.prototype;
      
	HexLayoutKlassProto.SetPOX = function(pox)
	{
        this.PositionOX = pox;       
	}; 
	HexLayoutKlassProto.SetPOY = function(poy)
	{
        this.PositionOY = poy;
	}; 
		   
	HexLayoutKlassProto.SetWidth = function(width)
	{
        this.width = width;
        this.half_width = width/2;      
	}; 
	HexLayoutKlassProto.SetHeight = function(height)
	{
        this.height = height; 
        this.half_height = height/2;   
	};   
    HexLayoutKlassProto.LXYZ2PX = function(lx, ly, lz)
	{
	    var px;
	    switch (this.mode)
	    {
	    case ODD_R:
	        px = (lx*this.width) + this.PositionOX;
	        if (ly&1)
	            px += this.half_width;	        
	    break;
	    
	    case EVEN_R:
	        px = (lx*this.width) + this.PositionOX;
	        if (ly&1)
	            px -= this.half_width;	   	        
	    break;
	    
	    case ODD_Q:
	    case EVEN_Q:	    
	        px = (lx*this.width) + this.PositionOX;
	    break;	    
	    }
        return px;
	};
	HexLayoutKlassProto.LXYZ2PY = function(lx, ly, lz)
	{
	    var py;
	    switch (this.mode)
	    {
	    case ODD_R:
	    case EVEN_R:
	        py = (ly*this.height) + this.PositionOY;	        
	    break;
	    
	    case ODD_Q:
	        py = (ly*this.height) + this.PositionOY;
	        if (lx&1)
	            py += this.half_height;	        
	    break;
	    
	    case EVEN_Q:	    
	        py = (ly*this.height) + this.PositionOY;
	        if (lx&1)
	            py -= this.half_height;	  	        
	    break;	    
	    }
        return py;
	};   

// ----		
{
	C3.Plugins.Rex_tmx_importer_v2 = class Rex_tmx_importer_v2Plugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}