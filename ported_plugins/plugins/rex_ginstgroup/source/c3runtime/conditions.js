"use strict";

{
	C3.Plugins.Rex_gInstGroup.Cnds =
	{
		OnMappingFn(name) 
		{
			return (this.mapFnName === name);
		},
		OnSortingFn(name) 
		{
			return (this.sortFnName === name);
		},

		ForEachUID(var_name, name) 
		{
			var uids = this.GetGroup(name).GetList();
			var uids_len = uids.length;
			var i;
			var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
		    var current_event = current_frame.GetCurrentEvent();
		    var solmod = current_event.GetSolModifiers();
		    var c = this._runtime.GetEventSheetManager().GetEventStack();
		    var p = this._runtime.GetEventStack(); 
		    var h = c.Push(current_event);
			for (i = 0; i < uids_len; i++) 
			{
				this.foreachItem[var_name] = uids[i];
				this.foreachIndex[var_name] = i;
				this._runtime.GetEventSheetManager().PushCopySol(solmod);
				current_event.Retrigger(current_frame,h);
				this._runtime.GetEventSheetManager().PopSol(solmod);
			}

			return false;
		},

		Group2Insts(name, objtype, isPop) 
		{
			if (!objtype)
				return;
			return this.group2insts(name, objtype, isPop);
		},

		IsInGroup(uid, name) 
		{
			return this.GetGroup(name).IsInGroup(uid);
		},

		IsEmpty(name) 
		{
			return (this.GetGroup(name).GetList().length == 0);
		},

		PopInst(name, index, objtype, isPop) 
		{
			if (!objtype)
				return;
			return this.popInstance(name, index, objtype, isPop);
		},

		IsSubset(subset_name, main_name) 
		{
			var main_group = this.GetGroup(main_name);
			var subsetGroup = this.GetGroup(subset_name);
			return main_group.IsSubset(subsetGroup);
		},

		RandomPopInstance(name, objtype, isPop) 
		{
			if (!objtype)
				return;
			var index = Math.floor(Math.random() * this.GetGroup(name).GetList().length);
			return this.popInstance(name, index, objtype, isPop);
		},

		PopInstByMappingFunction(name, objtype, isPop, mapFnName, resultType) 
		{
			if (!objtype)
				return;
			return this.popInstanceByMapFn(name, objtype, isPop, mapFnName, resultType);
		}
	};
}