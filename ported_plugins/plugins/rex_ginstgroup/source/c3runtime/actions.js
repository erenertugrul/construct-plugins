"use strict";

{
	C3.Plugins.Rex_gInstGroup.Acts =
	{
		DestroyAll() 
		{
			var name;
			for (name in this.groups)
				delete this.groups[name];
		},

		Clean(name) 
		{
			this.GetGroup(name).Clean();
		},

		DestroyGroup(name) 
		{
			this.DestroyGroup(name);
		},

		Copy(source, target) 
		{
			if (source == target)
				return;
			this.GetGroup(target).Copy(this.GetGroup(source));
		},

		String2Group(JSONString, name) 
		{
			this.GetGroup(name).JSONString2Group(JSONString);
		},

		String2All(JSONString) 
		{
			var groups = JSON.parse(JSONString);
			var name;
			for (name in groups)
				this.GetGroup(name).JSONString2Group(groups[name]);
		},

		AddInsts(objtype, name) 
		{
			if (!objtype)
				return;

			var insts = objtype.GetCurrentSol().GetInstances();
			var cnt = insts.length;
			if (cnt == 1)
				this.GetGroup(name).AddUID(insts[0].GetUID());
			else {
				var i, uids = [];
				uids.length = insts.length;
				for (i = 0; i < cnt; i++)
					uids[i] = insts[i].GetUID();

				this.GetGroup(name).AddUID(uids);
			}
		},

		AddInstByUID(uid, name) 
		{
			this.GetGroup(name).AddUID(uid);
		},

		RemoveInsts(objtype, name) 
		{
			if (!objtype)
				return;

			var insts = objtype.GetCurrentSol().GetInstances();
			var cnt = insts.length;
			if (cnt == 1)
				this.GetGroup(name).RemoveUID(insts[0].GetUID());
			else {
				var i, uids = [];
				uids.length = insts.length;
				for (i = 0; i < cnt; i++)
					uids[i] = insts[i].GetUID();

				this.GetGroup(name).RemoveUID(uids);
			}
		},

		RemoveInst(uid, name) 
		{
			this.GetGroup(name).RemoveUID(uid);
		},

		Union(groupA, groupB, groupResult) 
		{
			var groups = this.getGroupAB(groupA, groupB, groupResult);
			this.GetGroup(groups["a"]).Union(this.GetGroup(groups["b"]));
		},

		Complement(groupA, groupB, groupResult) 
		{
			var groups = this.getGroupAB(groupA, groupB, groupResult);
			this.GetGroup(groups["a"]).Complement(this.GetGroup(groups["b"]));
		},

		Intersection(groupA, groupB, groupResult) 
		{
			var groups = this.getGroupAB(groupA, groupB, groupResult);
			this.GetGroup(groups["a"]).Intersection(this.GetGroup(groups["b"]));
		},

		Shuffle(name) 
		{
			this.GetGroup(name).Shuffle(this.randomGen);
		},

		SortByFn(name, fnName) 
		{
			var uidList = this.GetGroup(name).GetList();
			var self = this;
			uidList.sort(function (uidA, uidB) {
				self.cmpUIDA = uidA;
				self.cmpUIDB = uidB;
				self.cmpResult = 0;
				self.Trigger(C3.Plugins.Rex_gInstGroup.Cnds.OnSortingFn); // dikkat self, fnName)
				return self.cmpResult;
			});
		},

		SetCmpResultDirectly(result) 
		{
			this.cmpResult = result;
		},

		SetCmpResultCombo(result) 
		{
			this.cmpResult = result - 1;
		},

		Group2Insts(name, objtype, isPop) 
		{
			if (!objtype)
				return;

			this.group2insts(name, objtype, isPop);
		},

		SortByUID(name, method) 
		{
			var uidList = this.GetGroup(name).GetList();
			uidList.sort();
			if (method === 0)
				uidList.reverse();
		},

		// deprecated
		SortByUIDDec(name) 
		{
			this.GetGroup(name).GetList().sort().reverse();
		},

		Reverse(name) 
		{
			this.GetGroup(name).GetList().reverse();
		},

		Slice(source, start, end, target, isPop) 
		{
			var sourceGroup = this.GetGroup(source);
			var targetGroup = this.GetGroup(target);
			var _list = sourceGroup.GetList().slice(start, end);
			targetGroup.SetByUIDList(_list);
			if (isPop == 1)
				sourceGroup.Complement(targetGroup);
		},

		PopInst(name, index, objtype, isPop) 
		{
			if (!objtype)
				return;
			this.popInstance(name, index, objtype, isPop);
		},

		SetRandomGenerator(objType) 
		{
			var randomGen = objType.GetFirstPicked();
			if (randomGen.check_name == "RANDOM")
				this.randomGen = randomGen;
		},

		PushInsts(isFront, objtype, name) 
		{
			if (!objtype)
				return;

			var insts = objtype.GetCurrentSol().GetInstances();
			var cnt = insts.length;
			if (cnt == 1)
				this.GetGroup(name).PushUID(isFront, insts[0].GetUID());
			else {
				var i, uids = [];
				uids.length = insts.length;
				for (i = 0; i < cnt; i++)
					uids[i] = insts[i].GetUID();

				this.GetGroup(name).PushUID(uids, isFront);
			}
		},

		PushInstByUID(isFront, uid, name) 
		{
			this.GetGroup(name).PushUID(uid, isFront);
		},

		InsertInsts(objtype, name, index) 
		{
			if (!objtype)
				return;

			var insts = objtype.GetCurrentSol().GetInstances();
			var cnt = insts.length;
			if (cnt == 1)
				this.GetGroup(name).InsertUID(insts[0].GetUID(), index);
			else {
				var i, uids = [];
				uids.length = insts.length;
				for (i = 0; i < cnt; i++)
					uids[i] = insts[i].GetUID();

				this.GetGroup(name).InsertUID(uids, index);
			}
		},

		InsertInstByUID(uid, name, index) 
		{
			this.GetGroup(name).InsertUID(uid, index);
		},

		CleanAdddInsts(objtype, name) 
		{
			C3.Plugins.Rex_gInstGroup.Acts.Clean.call(this, name);
			C3.Plugins.Rex_gInstGroup.Acts.AddInsts.call(this, objtype, name);
		},

		CleanAdddInstByUID(uid, name) 
		{
			C3.Plugins.Rex_gInstGroup.Acts.Clean.call(this, name);
			C3.Plugins.Rex_gInstGroup.Acts.AddInstByUID.call(this, uid, name);
		},

		RandomPopInstance(name, objtype, isPop) 
		{
			if (!objtype)
				return;
			var index = Math.floor(Math.random() * this.GetGroup(name).GetList().length);
			return this.popInstance(name, index, objtype, isPop);
		},

		SetMappingResult(val) 
		{
			this.mappingResult = val;
		},

		PopInstByMappingFunction(name, objtype, isPop, mapFnName, resultType) 
		{
			if (!objtype)
				return;
			return this.popInstanceByMapFn(name, objtype, isPop, mapFnName, resultType);
		},

		SortByMappingFunction(name, fnName, method_) 
		{
			var uidList = this.GetGroup(name).GetList();
			var self = this;
			var uid2result = {};
			uidList.sort(function (uidA, uidB) {
				if (!uid2result.hasOwnProperty(uidA))
					uid2result[uidA] = self.callMapFunction(fnName, uidA);
				if (!uid2result.hasOwnProperty(uidB))
					uid2result[uidB] = self.callMapFunction(fnName, uidB);

				var method = method_;
				var valA = uid2result[uidA];
				var valB = uid2result[uidB];

				if (method >= 2) {
					valA = parseFloat(valA);
					valB = parseFloat(valB);
					method -= 2;
				}

				if (valA === valB)
					return 0;
				else if (valA > valB) {
					if (method === 1)
						return 1;
					else
						return -1;
				} else {
					if (method === 1)
						return -1;
					else
						return 1;
				}
			});
		},

		DestroyInstanceInGroup(name) 
		{
			if (!this.HasGroup(name))
				return;

			var uids = this.GetGroup(name).GetList();
			var i, cnt = uids.length,
				inst;
			for (i = 0; i < cnt; i++) {
				inst = this.uid2Inst(uids[i]);
				if (inst)
					this._runtime.DestroyInstance(inst);
			}
		}
	};
}