"use strict";

{
	C3.Plugins.mkArray.Instance = class mkArrayInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this.arrays = {};
			this.current_arr = null;
			this.current_value = null;
			this.current_index = null;
			
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
				"array" :this.arrays,
			};
		}
		
		LoadFromJson(o)
		{
			this.arrays = o["array"];
		}
		GetDebuggerProperties()
		{
			const prefix = "mkArray";
			return [{
				title: prefix,
				properties: [
					{name: "Array",	value: JSON.stringify(this.arrays)}


				]
			}];
		}
		clearArray(name)
		{
			if(!this.arrayExists(name)) return;
			
			while(this.arrays[name].length > 0)
				this.arrays[name].pop();
		}

		deleteArray(name)
		{
			if(!this.arrayExists(name)) return;

			this.clearArray(name);
			delete this.arrays[name];
		}

		arrayExists(name)
		{
			return this.arrays[name] != null;
		}

		isArrayEmpty(name)
		{
			return this.arrayExists(name) && this.arrays[name].length == 0;
		}

		indexOutOfBounds(name, index)
		{
			if(!this.arrayExists(name)) return true;
			if(this.isArrayEmpty(name)) return true;
			return index < 0 || index >= this.arrays[name].length;
		}

		comparison(op, val1, val2)
		{
			switch(op){
				case 0:
					return val1 == val2;
				case 1:
					return val1 != val2;
				case 2:
					return val1 < val2;
				case 3:
					return val1 <= val2;
				case 4:
					return val1 > val2;
				case 5:
					return val1 >= val2;
			}
			return false;
		}
		doForEachTrigger(current_event, current_arr, current_index)
		{
			this.current_arr = current_arr;
			this.current_value = this.arrays[current_arr][current_index];
			this.current_index = current_index;
			this._runtime.GetEventSheetManager().PushCopySol(current_event.GetSolModifiers());
			current_event.Retrigger(current_frame,h);
			this._runtime.GetEventSheetManager().PopSol(current_event.GetSolModifiers());
		}
	

	};
}