"use strict";

{
	C3.Plugins.mkArray.Acts =
	{
		NewArray(arr_name)
		{
			if(this.arrayExists(arr_name))
				this.clearArray(arr_name);
			else
				this.arrays[arr_name] = [];
		},

		PushToArray(arr_name, value, where)
		{
			if(!this.arrayExists(arr_name))	return;

			switch(where){
				case 0:
					this.arrays[arr_name].push(value);
					break;
				case 1:
					this.arrays[arr_name].unshift(value);
					break;
			}
		},

		InsertToArray(arr_name, value, index)
		{
			if(this.indexOutOfBounds(arr_name, index))	return;

			this.arrays[arr_name].splice(index, 0, value);
		},

		PopFromArray(arr_name, where)
		{
			if(this.isArrayEmpty(arr_name))	return;

			switch(where){
				case 0:
					this.arrays[arr_name].pop();
					break;
				case 1:
					this.arrays[arr_name].shift();
					break;
			}
		},

		DeleteFromArray(arr_name, index)
		{
			if(this.indexOutOfBounds(arr_name, index)) return;

			this.arrays[arr_name].splice(index, 1);
		},

		SetValue(arr_name, value, index)
		{
			if(this.indexOutOfBounds(arr_name, index)) return;

			this.arrays[arr_name][index] = value;
		},

		ClearArray(arr_name)
		{
			this.clearArray(arr_name);
		},

		DeleteArray(arr_name)
		{
			this.deleteArray(arr_name);
		},

		DeleteAll(arr_name)
		{
			for(var key in this.arrays){
				this.deleteArray(key);
			}
		},

		SortArray(arr_name, order, how)
		{
			if(!this.arrayExists(arr_name)) return;

			switch(how){
				case 0:
					this.arrays[arr_name].sort();
					break;
				case 1:
					this.arrays[arr_name].sort(function(a, b){
						a = +a || 9999999999;
						b = +b || 9999999999;
						return a - b;
					});
					break;
			}
			if(order == 1){
				this.arrays[arr_name].reverse();
			}
		},

		ShuffleArray(arr_name)
		{
			if(!this.arrayExists(arr_name)) return;

			for(var i = 0; i < this.arrays[arr_name].length; i++){
				var rnd = Math.floor(Math.random() * this.arrays[arr_name].length);
				var tmp = this.arrays[arr_name][rnd];
				this.arrays[arr_name][rnd] = this.arrays[arr_name][i];
				this.arrays[arr_name][i] = tmp;
			}
		},

		Log(arr_name)
		{
			if(this.arrayExists(arr_name))
				console.log("Array " + arr_name + ": " + JSON.stringify(this.arrays[arr_name]));
			else
				console.log("Array " + arr_name + " does not exist.");
		},

		Copy(arr_original, arr_new)
		{
			if(!this.arrayExists(arr_original)) return;
			if(this.arrayExists(arr_new))
				this.deleteArray(arr_new);

			this.arrays[arr_new] = [];
			for(var i = 0; i < this.arrays[arr_original].length; i++){
				this.arrays[arr_new].push(this.arrays[arr_original][i]);
			}
		},

		CopyValues(arr_original, arr_target)
		{
			if(this.isArrayEmpty(arr_original)) return;
			if(!this.arrayExists(arr_target)) return;

			for(var i = 0; i < this.arrays[arr_original].length; i++){
				this.arrays[arr_target].push(this.arrays[arr_original][i]);
			}
		},

		RemoveItem(arr_name, op, item)
		{
			if(this.isArrayEmpty(arr_name)) return;

			var arr = this.arrays[arr_name];
			for(var i = arr.length-1; i >= 0; i--){
				if(this.comparison(op, arr[i], item)){
					arr.splice(i, 1);
				}
			}
		},

		AddNumbers(arr_name, start, finish, step)
		{
			if(!this.arrayExists(arr_name)) return;
			if(step == 0) return;

			if(finish > start){
				if(step < 0) step *= -1;
			}else if(finish < start){
				if(step > 0) step *= -1;
			}

			var arr = this.arrays[arr_name];
			for(var i = start; step > 0 ? i < finish : i > finish; i+=step){
				arr.push(i);
			}
			arr.push(finish);
		},

		AddStrings(arr_name, strings, separator)
		{
			if(!this.arrayExists(arr_name)) return;
			if(separator == "" || strings == "") return;

			var arr = this.arrays[arr_name];
			var strings_arr = strings.split(separator);
			for(var i = 0; i < strings_arr.length; i++){
				arr.push(strings_arr[i]);
			}
		},

		ReplaceValues(arr_name, op, item, replace)
		{
			if(this.isArrayEmpty(arr_name)) return;

			var arr = this.arrays[arr_name];
			for(var i = 0; i < arr.length; i++){
				if(this.comparison(op, arr[i], item))
					arr[i] = replace;
			}
		},

		AddItems(arr_name, item, times)
		{
			if(!this.arrayExists(arr_name)) return;
			if(times < 1) return;

			var arr = this.arrays[arr_name];
			for(var i = 0; i < times; i++){
				arr.push(item);
			}
		}
	};
}