"use strict";

{
	C3.Plugins.Rex_tmx_importer_v2.Acts =
	{
		ImportTMX(source, objType)
		{        
		    if (!objType)
		        return;
		    var parser = objType.GetFirstPicked();
		    
		    if (!parser.GetSdkInstance().TMXObjGet)
		    {
		        return;
		    }
		    
		    this.import_tmxObj(source, parser);
		},
		CreateTiles(obj_type)
		{                
		    this.RetrieveTileArray(obj_type);
		},
		ReleaseTMX()
		{        
		    this.release_tmxObj();   
		},  
		SetOPosition(pox, poy)
		{        
		    this.POX = pox;
		    this.POY = poy;
		    
		    if (this.layout)
		    {
		        this.layout.SetPOX(pox);
		        this.layout.SetPOY(poy);           
		    }
		},
		RetrieveTileArray()
		{     
		    this.RetrieveTileArray();
		}, 
		CreateTilesDuration(obj_type, processing_time)
		{
		    this.processing_time = processing_time;
		    this._duration_start(obj_type);
		},    
		RetrieveTileArrayDuration(processing_time)
		{
		    this.processing_time = processing_time;
		    this._duration_start();     
		}, 

		ResetTilemap(layer_name, objType)
		{
		    if (!objType)
		        return;
		    var tilemap_inst = objType.GetFirstPicked();
		    if (!tilemap_inst || !this._tmx_obj)
		        return;
		        
		    // get tmx_layer
		    var layers=this._tmx_obj.layers, i, cnt=layers.length, tmx_layer;
		    for (i=0; i<cnt; i++)
		    {           
		        if (layers[i].name === layer_name)
		        {
		            tmx_layer = layers[i];
		            break;
		        }
		    }
		    if (!tmx_layer)
		        return;
		        
		        
		    // resize tilemap
		    tilemap_inst.GetSdkInstance()._mapWidth = this.exp_MapWidth;
		    tilemap_inst.GetSdkInstance()._mapHeight = this.exp_MapHeight;
		    tilemap_inst.GetSdkInstance()._MaybeResizeTilemap(true);
		    //inst.setTilesFromRLECSV([...]);
		    tilemap_inst.GetSdkInstance()._SetAllQuadMapChanged();
		    tilemap_inst.GetSdkInstance()._SetPhysicsChanged();
		    
		    tilemap_inst.GetSdkInstance()._tileWidth = this.exp_TileWidth;
		    tilemap_inst.GetSdkInstance()._tileHeight = this.exp_TileHeight;
		    var new_width = this.exp_TileWidth * this.exp_MapWidth;
		    var new_height = this.exp_TileHeight * this.exp_MapHeight;
		    if ((new_width !== tilemap_inst.GetWorldInfo().GetWidth()) || (new_height !== tilemap_inst.GetWorldInfo().GetHeight()))
		    {
		        tilemap_inst.GetWorldInfo().SetWidth(new_width);
		        tilemap_inst.GetWorldInfo().SetHeight(new_height);
		        tilemap_inst.GetWorldInfo().SetBboxChanged();
		    }  

		    // no sprite instance created
		    var obj_type_save = this._obj_type;
		    this._obj_type = null;
		            
		    // fill tiles
		    var x, y, _gid;
		    for (y=0; y<this.exp_MapHeight; y++)
		    {
		        for (x=0; x<this.exp_MapWidth; x++)
		        {
		            _gid = this._read_tile_at_LXY(tmx_layer, x,y, true);
		            if ((_gid == null) || (_gid === 0))  // null tile
		                _gid = -1;
		            else
		                _gid -= 1;
		            tilemap_inst.GetSdkInstance().SetTileAt(x, y, _gid);      
		        }
		    }
		    
		    this._obj_type = obj_type_save;
		    this.release_tmxObj();
		}     
	};
}