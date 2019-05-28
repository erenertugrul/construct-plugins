"use strict";
	var get_tile_angle = function (_gid)
	{
        var rotate = (_gid >> 29) & 0x7;
        var tile_angle;
        switch (rotate)
        {
        case 5: tile_angle = 90;  break;
        case 6: tile_angle = 180; break;
        case 3: tile_angle = 270; break;
        default: tile_angle = 0;  break;
        }
        return tile_angle; 
    }
    var _get_tiles_cnt = function(tmx_obj)
    {
        var layers = tmx_obj.layers;
        var i, layers_cnt = layers.length;
        var tile_cnt, total_tiles_cnt=0;
        for(i=0; i<layers_cnt; i++)
           total_tiles_cnt += layers[i].data.length;
        return total_tiles_cnt;
    };     
    var _get_objects_cnt = function(tmx_obj)
    {
        var obj_groups = tmx_obj.objectgroups;
        var i, group_cnt=obj_groups.length;
        var obj_cnt, total_objects_cnt=0;
        for (i=0; i<group_cnt; i++)        
            total_objects_cnt += obj_groups[i].objects.length; 
        return total_objects_cnt;
    };     
	// bitmaks to check for flipped & rotated tiles
	var FlippedHorizontallyFlag		= 0x80000000;
	var FlippedVerticallyFlag		= 0x40000000;
	var FlippedAntiDiagonallyFlag   = 0x20000000;   
{
	C3.Plugins.Rex_tmx_importer_v2.Instance = class Rex_tmx_importer_v2Instance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			const b = this._runtime.Dispatcher();
		 	this._disposables = new C3.CompositeDisposable(C3.Disposable.From(b, "layoutchange", () => this._OnLayoutChange()), C3.Disposable.From(b, "afterload", () => this._OnAfterLoad()))
			if (properties)		// note properties may be null in some cases
			{
				this.POX = properties[0];
	    		this.POY = properties[1];
			}
			// tiles
	        this.exp_MapWidth = 0;
	        this.exp_MapHeight = 0;  
	        this.exp_TileWidth = 0;
	        this.exp_TileHeight = 0;
	        this.exp_TotalWidth = 0;
	        this.exp_TotalHeight = 0; 
	        this.exp_IsIsometric = 0;         
	        this.exp_TileID = (-1);
	        this.exp_tilesetRef = null;
	        this.exp_LogicX = (-1);
	        this.exp_LogicY = (-1);  
	        this.exp_PhysicalX = (-1);
	        this.exp_PhysicalY = (-1);        
	        this.exp_InstUID = (-1);
	        this.exp_Frame = (-1);        
	        this.exp_IsMirrored = 0;
	        this.exp_IsFlipped = 0;
	        this.exp_TileAngle = 0;
	        this.exp_LayerName = "";  
	        this.exp_LayerOpacity = 1;  
	        this.exp_MapProperties = null;                
	        this.exp_LayerProperties = null;       
	        this.exp_TileProperties = null;
	        this.exp_BaclgroundColor = 0;        
	        
	        // objects
	        this.exp_objGroupRef = null;
	        this.exp_objRef = null;

	        // for each property
	        this.exp_CurLayerPropName = "";
	        this.exp_CurLayerPropValue =0;
	        this.exp_CurTilesetPropName = "";
	        this.exp_CurTilesetPropValue =0;        
	        this.exp_CurTilePropName = "";
	        this.exp_CurTilePropValue =0;     
	        this.exp_CurMapPropName = "";
	        this.exp_CurMapPropValue =0;        
	        this.exp_CurObjectPropName = "";
	        this.exp_CurObjectPropValue =0; 
	        
	        // hexagon layout
	        this.exp_isUp2Down = 0;
	        this.exp_isIndent = 0;    
	             
	        // duration
	        this.processing_time = 0.5;
	        this.exp_RetrievingPercent = 0;         
	              
	        this._tmx_obj = null;  
	        this._obj_type = null;
	        this._c2_layer = null;        
	        this.layout = null;
	        this._created_inst = null;
	        
	        // official save load
	        this.tmx_source = null;
	        this.parser_uid = null;
	        this.save_pox = null;
	        this.save_poy = null;
	        
	        // duration
	        this._duration_reset();
	        this._StartTicking();
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return { "src": this.tmx_source,
			         "parserUid": this.parser_uid,
	                 "pox": (this.layout)? this.layout.PositionOX : null,
	                 "poy": (this.layout)? this.layout.PositionOY : null
			         };
		}
		
		LoadFromJson(o)
		{
	        this.release_tmxObj();
		    this.tmx_source = o["src"];
		    this.parser_uid = o["parserUid"];
	        this.save_pox = o["pox"];
	        this.save_poy = o["poy"];  
		}
        _OnAfterLoad() {
			if (this.parser_uid === null)
			            return;
			            
	        var parser = this._runtime.GetInstanceByUID(this.parser_uid);
	        
	        this.import_tmxObj(this.tmx_source, parser);
	        this.layout.SetPOXY(this.save_pox, this.save_poy);
	        
	        this.save_pox = null;
	        this.save_poy = null; 
    	}
		import_tmxObj(source, parser)
		{
       		var tmx_obj = parser.GetSdkInstance().TMXObjGet(source);        
	        this.ImportTMX(tmx_obj);
	        this.tmx_source = source;
	        this.parser_uid = parser.GetUID();
		}
		release_tmxObj()
		{
		    this._tmx_obj = null;    
		    this.tmx_source = null;
		    this.parser_uid = null;
		    this.save_pox = null;
		    this.save_poy = null;       
		}
		ImportTMX(tmx_obj)
		{        	    
		    this._tmx_obj = tmx_obj;
		    this.exp_MapWidth = this._tmx_obj.map.width;
		    this.exp_MapHeight = this._tmx_obj.map.height;  
		    this.exp_TileWidth = this._tmx_obj.map.tilewidth; 
		    this.exp_TileHeight = this._tmx_obj.map.tileheight; 
		    this.exp_IsIsometric = (this._tmx_obj.map.orientation == "isometric");
		    this.exp_TotalWidth = (this.exp_IsIsometric)? ((this.exp_MapWidth+this.exp_MapHeight)/2)*this.exp_TileWidth: 
		                                                  this.exp_MapWidth*this.exp_TileWidth;
		    this.exp_TotalHeight = (this.exp_IsIsometric)? ((this.exp_MapWidth+this.exp_MapHeight)/2)*this.exp_TileHeight: 
		                                                   this.exp_MapHeight*this.exp_TileHeight;
		    this.exp_BaclgroundColor = this._tmx_obj.map.backgroundcolor;                                                       
		    this.exp_MapProperties = this._tmx_obj.map.properties;
		    
		    
		    // setup this.layout
		    var orientation = this._tmx_obj.map.orientation;
		    var is6DirMap = (orientation === "hexagonal");
		    var is4DirMap = (orientation === "orthogonal") || (orientation === "isometric") || (orientation === "staggered") ;
		    if (is4DirMap)
		    {
		        var mode ={"orthogonal":0, 
		                           "isometric": 1,
		                           "staggered": 2}[orientation];
		        
		        this.layout = new SquareLayoutKlass(this.POX, this.POY, 
		                                            this.exp_TileWidth, this.exp_TileHeight, mode);
		    }
		    else if (is6DirMap) 
		    {
		        var is_up2down = (this._tmx_obj.map.staggeraxis === "x");
		        var is_even = (this._tmx_obj.map.staggerindex === "even");
		        var mode = (!is_up2down && !is_even)? ODD_R:
		                   (!is_up2down &&  is_even)? EVEN_R:
		                   ( is_up2down && !is_even)? ODD_Q:
		                   ( is_up2down &&  is_even)? EVEN_Q:0; 
		    
		        this.layout = new HexLayoutKlass(this.POX, this.POY, 
		                                         this.exp_TileWidth, this.exp_TileHeight, mode);
		                                         
		        this.exp_isUp2Down = is_up2down;
		        this.exp_isIndent = is_even;                                             
		    }          
		}
		RetrieveTileArray(obj_type)
		{
		    // tiles
		    this._retrieve_tiles(obj_type);  
		    // objects
		    this._retrieve_objects();
		    this.Trigger(C3.Plugins.Rex_tmx_importer_v2.Cnds.OnRetrieveFinished);
		}
		_read_tile_at_LXY(tmx_layer, x, y, is_raw_data)
		{
		    var idx = (tmx_layer.width * y) + x;
		    var _gid = tmx_layer.data[idx];	    
		    if ((_gid == null) || (_gid === 0) || is_raw_data)
		        return _gid;     // return gid                    
		 
		    // prepare expressions
		    this.exp_TileID = _gid & ~(FlippedHorizontallyFlag | FlippedVerticallyFlag | FlippedAntiDiagonallyFlag);  
		    this.exp_LogicX = x;
		    this.exp_LogicY = y;
		    this.exp_PhysicalX = this.layout.LXYZ2PX(x,y);
		    this.exp_PhysicalY = this.layout.LXYZ2PY(x,y);
		    this.exp_TileAngle = get_tile_angle(_gid);
		    if (this.exp_TileAngle == 0)
		    {
		        this.exp_IsMirrored = ((_gid & FlippedHorizontallyFlag) !=0)? 1:0;
		        this.exp_IsFlipped = ((_gid & FlippedVerticallyFlag) !=0)? 1:0;
		    }
		    else
		    {
		        this.exp_IsMirrored = 0;
		        this.exp_IsFlipped = 0;
		    }
		    var tileset_obj = this._tmx_obj.GetTileSet(this.exp_TileID);
		    this.exp_tilesetRef = tileset_obj;
		    var tile_obj = tileset_obj.tiles[this.exp_TileID];
		    this.exp_Frame = this.exp_TileID - tileset_obj.firstgid;
		    this.exp_TileProperties = (tile_obj != null)? tile_obj.properties: null;

		    if (this._obj_type)       
		        this._created_inst = this._create_instance(this.exp_PhysicalX, this.exp_PhysicalY);         
		    else
		        this._created_inst = null;
		                        
		    return _gid;  // return gid
		}

		_create_layer_objects(tmx_layer, layer_index)
		{	  
		    var c2_layer = this._get_layer(tmx_layer.name);
		    this._c2_layer = c2_layer;
		    if (this._obj_type && !c2_layer)
		    {
		        alert('TMX Importer: Can not find "' + tmx_layer.name + '" layer');
		    }
		    
		    if (this._obj_type && c2_layer && (this.exp_BaclgroundColor != null) && 
		         (layer_index === 0) )
		    {
		        C3.Plugins.System.Acts.SetLayerBackground.call(this, c2_layer, this.exp_BaclgroundColor);
		        //cr.system_object.prototype.acts.SetLayerTransparent.call(this, c2_layer, 0);            
		    }
		        
		    var width = tmx_layer.width;
		    var height = tmx_layer.height;
		    var x,y,inst,tileset_obj,tile_obj,layer_opacity,_gid; 
		    var i=0, _gid;
		    
		    this.exp_LayerName = tmx_layer.name;        
		    this.exp_LayerProperties = tmx_layer.properties;
		    this.exp_LayerOpacity = tmx_layer.opacity;
		    for (y=0; y<height; y++)
		    {
		        for (x=0; x<width; x++)
		        {     
		            _gid = this._read_tile_at_LXY(tmx_layer, x,y);
		            if ((_gid == null) || (_gid === 0))
		                continue;

		            // trigger callback
		            this.Trigger(C3.Plugins.Rex_tmx_importer_v2.Cnds.OnEachTileCell);
		        }
		    }         
		}

		            	
		_create_instance(px, py)
		{
		    var inst = this._runtime.CreateInstance(this._obj_type, this._c2_layer, px, py );
		    //C3.Plugins.Sprite.Acts.SetAnimFrame.call(inst, this.exp_Frame);
		    //inst.GetPlugin().constructor.Acts.SetAnimFrame(this.exp_Frame);
		    //inst.changeAnimFrame = this.exp_Frame;
		    inst.GetSdkInstance()._changeAnimFrameIndex = this.exp_Frame;
		    inst.GetWorldInfo().SetOpacity(this.exp_LayerOpacity);          
		    inst.GetWorldInfo().SetAngle(to_clamped_radians(this.exp_TileAngle));
		    inst.GetWorldInfo().SetBboxChanged();
		    if (this.exp_IsMirrored ==1)
		        inst.GetWorldInfo().SetWidth(-inst.GetWorldInfo().GetWidth());
		    if (this.exp_IsFlipped ==1)
		        inst.GetWorldInfo().SetHeight(-inst.GetWorldInfo().GetHeight());       
		    
		   if (!inst.GetSdkInstance().IsTicking())
				 {
					 inst.GetSdkInstance()._StartTicking();
				 }

				// not in trigger: apply immediately 
				 if (!inst.GetSdkInstance()._isInAnimTrigger)
				 {
					 inst.GetSdkInstance()._DoChangeAnimFrame();
				 }
		    return inst        
		}
			    
		_get_layer(layerparam)
		{
		    return (typeof layerparam == "number")?
		           this._runtime.GetLayoutManager().GetMainRunningLayout().GetLayerByIndex(layerparam):
		           this._runtime.GetLayoutManager().GetMainRunningLayout().GetLayerByName(layerparam);
		}  
		_retrieve_tiles(obj_type)
		{
		    this._obj_type = obj_type;	    
		    var layers = this._tmx_obj.layers;
		    var layers_cnt = layers.length;
		    var i;
		    // tiles
		    for(i=0; i<layers_cnt; i++)
		    {
		       this._create_layer_objects(layers[i], i);
		    }           
		       
		    this._obj_type = null;
		}
			
		_read_obj(obj)
		{
		    this.exp_objRef = obj;
		    return true;
		}
		                	        
		_retrieve_objects()
		{
		    var obj_groups = this._tmx_obj.objectgroups;
		    var i, group, group_cnt=obj_groups.length;
		    var j, obj, objs, obj_cnt;
		    var x,y;
		    for (i=0; i<group_cnt; i++)
		    {
		        group = obj_groups[i];
		        this.exp_objGroupRef = obj_groups[i];           
		        objs = this.exp_objGroupRef.objects;
		        obj_cnt = objs.length;
		        for (j=0; j<obj_cnt; j++)
		        {
		            this._read_obj(objs[j]);
		            this.Trigger(C3.Plugins.Rex_tmx_importer_v2.Cnds.OnEachObject);
		        }
		    }
		}
		    
		    // duration mode
		_duration_start(tile_objtype)
		{
	        this._duration_reset();       
	        this._duration_info.total_objects_count = _get_tiles_cnt(this._tmx_obj) + _get_objects_cnt(this._tmx_obj);
	        this._obj_type = tile_objtype;        
	        //this._runtime.tickMe(this);
	        this._StartTicking(this);
		}
		_duration_reset()
		{
		    this._duration_info = {working_time:(1/60)*1000*this.processing_time,
		                           state:0, // 0=idle, 1=retrieve tile layer, 2=retrieve object layer
		                           goto_next_state:false,
		                           total_objects_count:0,
		                           current_objects_count:0,
		                           tile_layer:{layer_index:0,data_index:0},
		                           object_layer:{group_index:0,object_index:0},
		                           };
		}
		Tick()
		{                
		    var unit_cnt, is_timeout=false;
		    var start_time = Date.now();
		    var working_time = this._duration_info.working_time;
		    // fix working_time
		    if (this._tmx_obj)
		    {
		    	while (!is_timeout)
			    {
			        //assert2(this._tmx_obj, "TMX Importer: Can not find tmx object.");
			        
			        unit_cnt = this._retrieve_one_tile_prepare();
			        
			        this._duration_info.current_objects_count += unit_cnt;
			        this.exp_RetrievingPercent = (this._duration_info.current_objects_count/this._duration_info.total_objects_count);
			        
			        if (unit_cnt > 0)
			            this._retrieve_one_tile_callevent();

			        if (this.exp_RetrievingPercent === 1)
			            break;
			        else if (this._duration_info.goto_next_state)
			        {
			            this._duration_info.state += 1;                
			            this._duration_info.goto_next_state = false;
			        }

			        if (unit_cnt > 0)
			            is_timeout = (Date.now() - start_time) > working_time;
			    }
		    }

			this.Trigger(C3.Plugins.Rex_tmx_importer_v2.Cnds.OnRetrieveDurationTick);
			if (this.exp_RetrievingPercent === 1)
			    this._duration_finished();   
		}   
		_duration_finished()
		{
		    this._duration_info.state = 0;
		    this._obj_type = null;  
		    //this._runtime.untickMe(this);
		    this._StopTicking(this);
		    this.Trigger(C3.Plugins.Rex_tmx_importer_v2.Cnds.OnRetrieveFinished);
		}
		    
		     
		_retrieve_one_tile_prepare()
		{
		    var unit_cnt;
		    switch (this._duration_info.state)
		    {
		    case 0: unit_cnt = this._retrieve_one_tile();     break;
		    case 1: unit_cnt = this._retrieve_one_object();   break;
		    }

		    
		    return unit_cnt;   
		}
		    
		_retrieve_one_tile()
		{   
		    var unit_cnt=0, _gid;
		    var layer_index,data_index,layers,tmx_layer,c2_layer,x,y;
		    while (1)
		    {
		        layer_index = this._duration_info.tile_layer.layer_index;
		        data_index = this._duration_info.tile_layer.data_index;
		        tmx_layer = this._tmx_obj.layers[layer_index];
		        if (!tmx_layer)
		        {
		            // finish
		            this._duration_info.goto_next_state = true;
		            return unit_cnt;
		        }
		   
		        // check c2 layer
		        c2_layer =  this._get_layer(tmx_layer.name);
		        this._c2_layer = c2_layer;
		        if (this._obj_type && !c2_layer)
		        {
		            alert('TMX Importer: Can not find "' + tmx_layer.name + '" layer'); 
		        }
		        
		        // set layer background color
		        if (this._obj_type && c2_layer && (this.exp_BaclgroundColor != null) &&
		           (layer_index === 0) && (data_index === 0))
		        {
		            C3.Plugins.System.Acts.SetLayerBackground.call(this, c2_layer, this.exp_BaclgroundColor);
		            //system_object.prototype.acts.SetLayerTransparent.call(this, c2_layer, 0);            
		        } 
		               

		        x = data_index%tmx_layer.width;
		        y = (data_index-x)/tmx_layer.height;                   
		        _gid = this._read_tile_at_LXY(tmx_layer, x,y);
		        if (_gid == null)
		        {
		            this._duration_info.tile_layer.layer_index += 1; // next layer
		            this._duration_info.tile_layer.data_index = 0;    // start from 0 
		            continue; 
		        }
		        else  // _gid == 0 or _gid > 0
		        {
		            unit_cnt += 1;
		            this._duration_info.tile_layer.data_index += 1;  // next tile
		            if (_gid > 0)
		                return unit_cnt; 
		            else 
		                continue;
		        }                         
		    }   
		} 
		    
		_retrieve_one_object()
		{
		    var objectgroups = this._tmx_obj.objectgroups;
		    var group, obj;
		    while (1)
		    {
		        group = objectgroups[this._duration_info.object_layer.group_index];
		        if (!group)
		        {
		            // finish
		            this._duration_info.goto_next_state = true;
		            return 0; 
		        }
		        this.exp_objGroupRef = group;            
		        obj = group.objects[this._duration_info.object_layer.object_index];                   
		        if (obj)  // get valid object
		        {
		            this._read_obj(obj);
		            this._duration_info.object_layer.object_index += 1;  // next index            
		            return 1;
		        }            
		        else    // no object in this group
		        {
		            this._duration_info.object_layer.group_index += 1;  // try next group
		            this._duration_info.object_layer.object_index = 0;  // start from 0
		            continue;
		        }
		    }
		}
		      
		_retrieve_one_tile_callevent()
		{
		    var trg;
		    switch (this._duration_info.state)
		    {
		    case 0: trg = C3.Plugins.Rex_tmx_importer_v2.Cnds.OnEachTileCell;   break;
		    case 1: trg = C3.Plugins.Rex_tmx_importer_v2.Cnds.OnEachObject;     break;
		    }
		    this.Trigger(trg);
		}
	};
}