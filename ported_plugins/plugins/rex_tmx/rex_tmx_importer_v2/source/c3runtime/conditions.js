"use strict";

{
	C3.Plugins.Rex_tmx_importer_v2.Cnds =
	{
	    OnEachTileCell()
	    {
	        var inst = this._created_inst;
	        const g = this._runtime.GetEventSheetManager();
	        if (inst != null)
	        {
	            var sol = inst.GetObjectClass().GetCurrentSol();
	            sol._selectAll = false;
	            sol._instances.length = 1;
	            sol._instances[0] = inst;
	        
	            // Siblings aren't in instance lists yet, pick them manually
	            var i, len, s;
	            if (inst._isInContainer)
	            {
	                for (i = 0, len = inst._siblings.length; i < len; i++)
	                {
	                    s = inst._siblings[i];
	                    sol = s.GetObjectClass().GetCurrentSol();
	                    sol._selectAll = false;
	                    sol._instances.length = 1;
	                    sol._instances[0] = s;
	                }
	            }
	        
	            //this._runtime.isInOnDestroy++; // düzelt
	            g.BlockFlushingInstances(!0)
	            //this._runtime.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnCreated, inst);
	            //this.Trigger(inst.GetObjectClass().GetPlugin().constructor.Cnds.OnCreated);
	            inst._TriggerOnCreated();
	            //this._runtime.isInOnDestroy--;
	            g.BlockFlushingInstances(!1);
	        }
	        return true;
	    },
        OnEachObject()
	    {
	        return true;
	    },
	    ForEachLayerProperty()
	    {   
	        if (this.exp_LayerProperties == null)
	            return false;
	            
	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event);
	        
	        var key, props = this.exp_LayerProperties, value;
	        for (key in props)
	        {
	            this.exp_CurLayerPropName = key;
	            this.exp_CurLayerPropValue = props[key];
	            
	            // trigger current event
	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PushCopySol(solmod);
	                
	            current_event.Retrigger(current_frame,h);

	            if (solModifierAfterCnds)
	                 this._runtime.GetEventSheetManager().PopSol(solmod);            
	        }
	        p.Pop();
	        this.exp_CurLayerPropName = "";
	        this.exp_CurLayerPropValue = 0;
	        return false;        
	    },   
	    ForEachTilesetProperty()
	    {
	        if (this.exp_tilesetRef == null)
	            return false;
	            
	        var props = this.exp_tilesetRef.prope;
	        if (props == null)
	            return false;

	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event);
	        
	        var key, value;
	        for (key in props)
	        {
	            this.exp_CurTilesetPropName = key;
	            this.exp_CurTilesetPropValue = props[key];
	                 
	            // trigger current event       
	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PushCopySol(solmod);
	                
	            current_event.Retrigger(current_frame,h);

	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PopSol(solmod);             
	        }
	        p.Pop();
	        this.exp_CurTilesetPropName = "";
	        this.exp_CurTilesetPropValue = 0;
	        return false;        
	    },   
	    ForEachTileProperty()
	    {   
	        if (this.exp_TileProperties == null)
	            return false;
	            
	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event);
	        
	        var key, props = this.exp_TileProperties, value;
	        for (key in props)
	        {
	            this.exp_CurTilePropName = key;
	            this.exp_CurTilePropValue = props[key];
	            
	            // trigger current event    
	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PushCopySol(solmod);
	                
	            current_event.Retrigger(current_frame,h);

	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PopSol(solmod);                
	        }
	        p.Pop();
	        this.exp_CurTilePropName = "";
	        this.exp_CurTilePropValue = 0;
	        return false;        
	    },
	    ForEachMapProperty()
	    {   
	        if (this.exp_MapProperties == null)
	            return false;
	            
	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event);
	        
	        var key, props = this.exp_MapProperties, value;
	        for (key in props)
	        {
	            this.exp_CurMapPropName = key;
	            this.exp_CurMapPropValue = props[key];
	           
	            // trigger current event            
	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PushCopySol(solmod);
	                
	            current_event.Retrigger(current_frame,h);

	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PopSol(solmod);            
	        }
	        p.Pop();
	        this.exp_CurMapPropName = "";
	        this.exp_CurMapPropValue = 0;
	        return false;        
	    },          
	    ForEachLayer()
	    {   
	        if (this._tmx_obj == null)
	            return false;
	            
	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event);
	        
	        var layers = this._tmx_obj.layers;          
	        var exp_LayerName_save = this.exp_LayerName;
	        var exp_LayerProperties_save = this.exp_LayerProperties;
	        var exp_LayerOpacity_save = this.exp_LayerOpacity;
	        
	        var i, cnt=layers.length, layer;
	        for (i=0; i<cnt; i++)
	        {
	            layer = layers[i];
	            this.exp_LayerName = layer.name;                
	            this.exp_LayerProperties = layer.properties;
	            this.exp_LayerOpacity = layer.opacity;  
	            
	            // trigger current event
	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PushCopySol(solmod);
	                  
	            current_event.Retrigger(current_frame,h);

	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PopSol(solmod);              
	        }
	        p.Pop();
	        this.exp_LayerName = exp_LayerName_save;
	        this.exp_LayerProperties = exp_LayerProperties_save;
	        this.exp_LayerOpacity = exp_LayerOpacity_save; 
	        
	        return false;        
	    },
	    ForEachObjectProperty()
	    {   
	        if (this.exp_objRef == null)
	            return false;
	        
	        var props = this.exp_objRef.properties;
	        if (props == null)
	            return false;

	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event);
	        
	        var key, value;
	        for (key in props)
	        {
	            this.exp_CurObjectPropName = key;
	            this.exp_CurObjectPropValue = props[key];
	                      
	            // trigger current event  
	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PushCopySol(solmod);
	                
	            current_event.Retrigger(current_frame,h);

	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PopSol(solmod);                   
	        }
	        p.Pop();
	        this.exp_CurObjectPropName = "";
	        this.exp_CurObjectPropValue = 0;
	        return false;        
	    },  
	    OnRetrieveFinished()
	    {
	        return true;
	    },
	    OnRetrieveDurationTick()
	    {
	        return true;
	    },
	    ForEachTileAtLXY(x, y)
	    {
	        if (this._tmx_obj == null)
	            return false;
	    
	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event);            

	        var obj_type_save = this._obj_type;
	        this._obj_type = null;    
	                
	        var layers = this._tmx_obj.layers;
	        var layers_cnt = layers.length;
	        var i, tmx_layer, _gid;      
	        // tiles
	        for(i=0; i<layers_cnt; i++)
	        {  
	            // fill expressions
	            tmx_layer = layers[i];
	            this.exp_LayerName = tmx_layer.name;        
	            this.exp_LayerProperties = tmx_layer.properties;
	            this.exp_LayerOpacity = tmx_layer.opacity;
	            
	            _gid = this._read_tile_at_LXY(tmx_layer, x,y);
	            if ((_gid == null) || (_gid === 0))
	                continue;
	            // fill expressions            
	            
	            // trigger current event
	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PushCopySol(solmod);
	                            
	            current_event.Retrigger(current_frame,h);

	            if (solModifierAfterCnds)
	                this._runtime.GetEventSheetManager().PopSol(solmod);             
	        }
	        p.Pop();           
	        this._obj_type = obj_type_save; 
	        return false;
	    } 
	};
}