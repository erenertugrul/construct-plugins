"use strict";

{
	C3.Plugins.Rex_JSONBuider.Instance = class Rex_JSONBuiderInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this.clean();
			
			if (properties)		// note properties may be null in some cases
			{
				//this._testProperty = properties[0];
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"d": this.data,
			};
		}
		
		LoadFromJson(o)
		{
			this.data = o["d"];
		}

		clean()
		{
	        this.data = null;
	        this.current_object = null;
		}
	    
		add_object (k_, type_)
		{
	        var new_object = (type_===0)? []:{};
	         // root
	        if (this.data === null)
	            this.data = new_object;
	        else
	            this.add_value(k_, new_object);

	            
	        var previous_object = this.current_object;    
	        this.current_object = new_object;
	        
	        var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	        var current_event = current_frame.GetCurrentEvent();
	        var solmod = current_event.GetSolModifiers();
	        var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	        var c = this._runtime.GetEventSheetManager().GetEventStack();
	        var p = this._runtime.GetEventStack(); 
	        var h = c.Push(current_event);
			
	        if (solModifierAfterCnds)
	            this._runtime.GetEventSheetManager().PushCopySol(solmod);;
	        
	        current_event.Retrigger(current_frame,h);
	        
	        if (solModifierAfterCnds)
	           	this._runtime.GetEventSheetManager().PopSol(solmod);
	        
	        p.Pop();
	        this.current_object = previous_object;
			return false;        
		}
	    
		add_value (k_, v_)
		{
	        if (this.current_object == null)
	        {
	            alert("JSON Builder: Please add a key-value into an object.");
	            return;
	        }
	        
	        if (this.current_object instanceof Array)  // add to array
	            this.current_object.push(v_);
	        else                                                               // add to dictionary
	            this.current_object[k_] = v_; 
	        
		}   
	};
}