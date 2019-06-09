"use strict";

{
	C3.Plugins.mkArray.Cnds =
	{
		IsEmpty(arr_name)
		{
			return this.isArrayEmpty(arr_name);
		},

		CompareLength(arr_name, op, value)
		{
			if(!this.arrayExists(arr_name)) return false;
			return this.comparison(op, this.arrays[arr_name].length, value);
		},

		CompareAt(arr_name, index, op, value)
		{
			if(this.indexOutOfBounds(arr_name, index)) return false;
			return this.comparison(op, this.arrays[arr_name][index], value);
		},

		Contains(arr_name, value)
		{
			if(this.isArrayEmpty(arr_name)) return false;
			var arr = this.arrays[arr_name];
			for(var i = 0; i < arr.length; i++){
				if(arr[i] == value)
					return true;
			}
			return false;
		},
		ForEach(arr_name)
		{
			if(this.isArrayEmpty(arr_name)) return false;
			var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
				var current_event = current_frame.GetCurrentEvent();
			var c = this._runtime.GetEventSheetManager().GetEventStack();
			var p = this._runtime.GetEventStack(); 
			var h = c.Push(current_event);
			for (var i = 0; i < this.arrays[arr_name].length; i++)
			{
				this.current_arr = arr_name;
				this.current_value = this.arrays[arr_name][i];
				this.current_index = i;
				this._runtime.GetEventSheetManager().PushCopySol(current_event.GetSolModifiers());
				current_event.Retrigger(current_frame,h);
				this._runtime.GetEventSheetManager().PopSol(current_event.GetSolModifiers());
			}
			p.Pop();
			this.current_arr = null;
			this.current_index = null;
			this.current_value = null;
			
			return false;
		},

		For (arr_name, start, finish, step)
		{
			if(this.isArrayEmpty(arr_name)) return false;
			if(this.indexOutOfBounds(arr_name, start)) return false;
			if(this.indexOutOfBounds(arr_name, finish)) return false;
			step = Math.abs(Math.floor(step));
			if(step == 0) return false;

			var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
				var current_event = current_frame.GetCurrentEvent();
			var c = this._runtime.GetEventSheetManager().GetEventStack();
			var p = this._runtime.GetEventStack(); 
			var h = c.Push(current_event);	

			for (var i = start; finish > start ? i <= finish : i >= finish; finish > start ? i+=step: i-=step)
			{
				this.current_arr = arr_name;
				this.current_value = this.arrays[arr_name][i];
				this.current_index = i;
				this._runtime.GetEventSheetManager().PushCopySol(current_event.GetSolModifiers());
				current_event.Retrigger(current_frame,h);
				this._runtime.GetEventSheetManager().PopSol(current_event.GetSolModifiers());
			}
			p.Pop();
			this.current_arr = null;
			this.current_index = null;
			this.current_value = null;

			return false;
		},
		CompareCurrentValue(op, value)
		{
			if(this.current_value == null) return false;
			return this.comparison(op, this.current_value, value);
		},

		CompareCurrentIndex(op, value)
		{
			if(this.current_index == null) return false;
			return this.comparison(op, this.current_index, value);
		}
	};
}