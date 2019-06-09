"use strict";

{
	C3.Plugins.mkArray.Exps =
	{
		ArrayToString(arr_name)
		{
			if(!this.arrayExists(arr_name)){
				return("");
				return;
			}

			return(JSON.stringify(this.arrays[arr_name]));				// return our value
		},

		Length(arr_name)
		{
			if(!this.arrayExists(arr_name)){
				return(0);
				return;
			}

			return(this.arrays[arr_name].length);
		},

		At(arr_name, index)
		{
			if(!this.arrayExists(arr_name)){
				return("");
				return;
			}

			return(this.arrays[arr_name][index]);
		},

		Retrieve(arr_name, index)
		{
			if(this.indexOutOfBounds(arr_name, index)){
				return("");
				return;
			}
			var tmp = this.arrays[arr_name][index];
			this.arrays[arr_name].splice(index, 1);
			return(tmp);
		},

		Max(arr_name)
		{
			if(this.isArrayEmpty(arr_name)){
				return(0);
				return;
			}
			var arr = this.arrays[arr_name];
			var max;
			for(var i = 0; i < arr.length; i++){
				var n = arr[i];
				if(typeof n == "number"){
					if(max == null) max = n;
					if(n > max) max = n;
				}
			}
			if(max == null) max = 0;
			return(max);
		},

		Min(arr_name)
		{
			if(this.isArrayEmpty(arr_name)){
				return(0);
				return;
			}
			var arr = this.arrays[arr_name];
			var min;
			for(var i = 0; i < arr.length; i++){
				var n = arr[i];
				if(typeof n == "number"){
					if(min == null) min = n;
					if(n < min) min = n;
				}
			}
			if(min == null) min = 0;
			return(min);
		},

		Pop(arr_name)
		{
			if(this.isArrayEmpty(arr_name)){
				return("");
				return;
			}
			return(this.arrays[arr_name].pop());
		},

		Dequeue(arr_name)
		{
			if(this.isArrayEmpty(arr_name)){
				return("");
				return;
			}
			return(this.arrays[arr_name].shift());
		},

		Last(arr_name)
		{
			if(this.isArrayEmpty(arr_name)){
				return("");
				return;
			}
			return(this.arrays[arr_name][this.arrays[arr_name].length-1]);
		},

		First(arr_name)
		{
			if(this.isArrayEmpty(arr_name)){
				return("");
				return;
			}
			return(this.arrays[arr_name][0]);
		},

		Random(arr_name)
		{
			if(this.isArrayEmpty(arr_name)){
				return("");
				return;
			}
			var rnd = Math.floor(Math.random() * this.arrays[arr_name].length);
			return(this.arrays[arr_name][rnd]);
		},

		RetrieveRandom(arr_name)
		{
			if(this.isArrayEmpty(arr_name)){
				return("");
				return;
			}
			var rnd = Math.floor(Math.random() * this.arrays[arr_name].length);
			var tmp = this.arrays[arr_name][rnd];
			this.arrays[arr_name].splice(rnd, 1);
			return(tmp);
		},

		Count(arr_name, item)
		{
			if(this.isArrayEmpty(arr_name)){
				return(0);
				return;
			}
			var count = 0;
			for(var i = 0; i < this.arrays[arr_name].length; i++){
				if(this.arrays[arr_name][i] == item){
					count++;
				}
			}
			return(count);
		},

		Mode(arr_name)
		{

			if(this.isArrayEmpty(arr_name)){
				return("");
				return;
			}

			var count = {};
			var max = {item: "", count: 0};
			for(var i = 0; i < this.arrays[arr_name].length; i++){
				var currentItem = this.arrays[arr_name][i].toString();
				if(count[currentItem]){
					count[currentItem] += 1;
				}else{
					count[currentItem] = 1;
				}
				if(count[currentItem] > max.count){
					max.item = currentItem;
					max.count = count[currentItem];
				}
			}
			return(max.item);
			count = null;
			max = null;
		},

		Mean(arr_name)
		{
			if(this.isArrayEmpty(arr_name)){
				return(0);
				return;
			}
			var arr = this.arrays[arr_name];
			var count = 0;
			var total = 0;
			for(var i = 0; i < arr.length; i++){
				var n = arr[i];
				if(typeof n == "number"){
					total++;
					count+=n;
				}
			}
			return(total == 0 ? 0 : count/total);
		},

		CurrentArray()
		{
			return(this.current_arr);
		},

		CurrentIndex()
		{
			return(this.current_index);
		},

		CurrentValue()
		{
			return(this.current_value);
		}


	};
}