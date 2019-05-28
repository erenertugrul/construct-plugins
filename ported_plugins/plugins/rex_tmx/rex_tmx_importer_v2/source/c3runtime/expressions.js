"use strict";

{
	C3.Plugins.Rex_tmx_importer_v2.Exps =
	{
  // tiles
	MapWidth()
	{   
	    return(this.exp_MapWidth);
	},
	MapHeight()
	{   
	    return(this.exp_MapHeight);
	},
	TileWidth()
	{     
	    return(this.exp_TileWidth);
	},
	TileHeight()
	{    
	    return(this.exp_TileHeight);
	},  
	TotalWidth()
	{     
	    return(this.exp_TotalWidth);
	},
	TotalHeight()
	{    
	    return(this.exp_TotalHeight);
	},  
	IsIsometric()
	{    
	    return(this.exp_IsIsometric? 1:0);
	},  
	ImageSource(gid)
	{     
	    var tileset_obj = (gid == null)? this.exp_tilesetRef : this._tmx_obj.GetTileSet(gid);
	    return((tileset_obj)? tileset_obj.image.source : "");
	},
	ImageWidth(gid)
	{     
	    var tileset_obj = (gid == null)? this.exp_tilesetRef : this._tmx_obj.GetTileSet(gid);
	    return((tileset_obj)? tileset_obj.image.width : 0);
	},
	ImageHeight()
	{
	    var tileset_obj = (gid == null)? this.exp_tilesetRef : this._tmx_obj.GetTileSet(gid);
	    return((tileset_obj)? tileset_obj.image.height : 0);
	},  

	TileID()
	{    
	    return(this.exp_TileID);
	}, 
	LogicX()
	{   
	    return(this.exp_LogicX);
	},
	LogicY()
	{   
	    return(this.exp_LogicY);
	},    
	LayerProp(name, default_value)
	{   
	    var value;
	    if (this.exp_LayerProperties == null)
	        value = default_value;
	    else
	    {
	        value = this.exp_LayerProperties[name];
	        if (value == null)
	            value = default_value;
	    }
	    return(value);
	},
	TilesetProp(name, default_value)
	{       
	    var value;
	    if (this.exp_tilesetRef == null)
	        value = default_value;
	    else
	    {
	        value = this.exp_tilesetRef.properties[name];
	        if (value == null)
	            value = default_value;        
	    }
	    return(value);
	},     
	TileProp(name, default_value)
	{    
	    var value    
	    if (this.exp_TileProperties == null)
	        value = default_value;
	    else
	    {
	        value = this.exp_TileProperties[name];
	        if (value == null)
	            value = default_value;        
	    }
	    return(value);
	}, 
	PhysicalX()
	{   
	    return(this.exp_PhysicalX);
	},
	PhysicalY()
	{   
	    return(this.exp_PhysicalY);
	},
	LayerName()
	{   
	    return(this.exp_LayerName);
	},
	LayerOpacity()
	{   
	    return(this.exp_LayerOpacity);
	}, 
	IsMirrored()
	{   
	    return(this.exp_IsMirrored);
	},
	IsFlipped()
	{   
	    return(this.exp_IsFlipped);
	}, 
	InstUID()
	{   
	    return(this.exp_InstUID);
	}, 
	Frame(gid)
	{   
	    var frameIdx;
	    if (gid == null)
	        frameIdx = this.exp_Frame;
	    else
	    {
	        var tileset_obj = this._tmx_obj.GetTileSet(gid);
	        frameIdx = gid - tileset_obj.firstgid;
	    }
	    return(frameIdx);
	},  
	TilesetName(gid)
	{     
	    var tileset_obj = (gid == null)? this.exp_tilesetRef : this._tmx_obj.GetTileSet(gid);
	    return((tileset_obj)? tileset_obj.name : "");
	},
	MapProp(name, default_value)
	{   
	    var value;
	    if (this.exp_MapProperties == null)
	        value = default_value;
	    else
	    {
	        value = this.exp_MapProperties[name];
	        if (value == null)
	            value = default_value;
	    }
	    return(value);
	},  
	TileAngle()
	{     
	    return(this.exp_TileAngle);
	},    
	BackgroundColor()
	{     
	    var val = this.exp_BaclgroundColor;
	    if (val == null)
	        val = 0;
	    return(val);
	}, 

	// object group
	ObjGroupName()
	{     
	    return((this.exp_objGroupRef)? this.exp_objGroupRef.name : "");
	},    
	ObjGroupWidth()
	{     
	    return((this.exp_objGroupRef)? this.exp_objGroupRef.width : 0);
	},
	ObjGroupHeight()
	{     
	    return((this.exp_objGroupRef)? this.exp_objGroupRef.height : 0);
	},  

	// object
	ObjectName()
	{     
	    return((this.exp_objRef)? this.exp_objRef.name : "");
	},  
	ObjectType()
	{ 
	    return((this.exp_objRef)? this.exp_objRef.type : "");           
	},     
	ObjectWidth()
	{     
	    return((this.exp_objRef)? this.exp_objRef.width : 0);          
	},
	ObjectHeight()
	{    
	    return((this.exp_objRef)? this.exp_objRef.height : 0);                    
	},
	ObjectX()
	{     
	    return((this.exp_objRef)? (this.exp_objRef.x + this.POX) : 0);                             
	},
	ObjectY()
	{     
	    return((this.exp_objRef)? (this.exp_objRef.y + this.POY) : 0);                             
	},

	ObjectProp(name, default_value)
	{             
	    var value;
	    if (this.exp_objRef == null)
	        value = default_value;
	    else
	    {
	        value = this.exp_objRef.properties[name];
	        if (value == null)
	            value = default_value;
	    }
	    return(value);
	},

	// ef_deprecated    
	ObjectPX()
	{
	    return ObjectX;
	},
	ObjectPY() 
	{
	    return ObjectY;
	// ef_deprecated
	},
	ObjectID()
	{     
	    return((this.exp_objRef)? this.exp_objRef.id : 0);                             
	},    

	ObjectRotation()
	{     
	    return((this.exp_objRef)? this.exp_objRef.rotation : 0);                             
	},    

	ObjectRefGID()
	{     
	    return((this.exp_objRef)? this.exp_objRef.gid : -1);                               
	},      

	// for each property
	CurLayerPropName()
	{
	    return(this.exp_CurLayerPropName);
	},    
	CurLayerPropValue()
	{
	    return(this.exp_CurLayerPropValue);
	},    
	CurTilesetPropName()
	{
	    return(this.exp_CurTilesetPropName);
	},    
	CurTilesetPropValue()
	{
	    return(this.exp_CurTilesetPropValue);
	},     
	CurTilePropName()
	{
	    return(this.exp_CurTilePropName);
	},    
	CurTilePropValue()
	{
	    return(this.exp_CurTilePropValue);
	},    
	CurMapPropName()
	{
	    return(this.exp_CurMapPropName);
	},    
	CurMapPropValue()
	{
	    return(this.exp_CurMapPropValue);
	},      
	CurObjectPropName()
	{
	    return(this.exp_CurObjectPropName);
	},    
	CurObjectPropValue()
	{
	    return(this.exp_CurObjectPropValue);
	},       

	// duration
	RetrievingPercent()
	{     
	    return(this.exp_RetrievingPercent);
	},  

	POX()
	{    
	    return(this.POX);
	}, 
	POY()
	{   
	    return(this.POY);
	},  

	// hexagon
	IsUp2Down()
	{    
	    return(this.exp_isUp2Down? 1:0);
	}, 
	IsIndent()
	{   
	    return(this.exp_isIndent? 1:0);
	}    

	};
}