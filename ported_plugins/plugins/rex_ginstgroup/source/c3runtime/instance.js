"use strict";

{
	C3.Plugins.Rex_gInstGroup.Instance = class Rex_gInstGroupInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			const b = this._runtime.Dispatcher();
        	this._disposables = new C3.CompositeDisposable(C3.Disposable.From(b, "instancedestroy", (a) => this._OnInstanceDestroyed(a.instance)), C3.Disposable.From(b, "afterload", () => this._OnAfterLoad()))
    
			// Initialise object properties
			this.check_name = "INSTGROUP";
			this.groups = {};
			this.randomGen = null;
			this.randomGenUid = -1; // for loading
			this.mapUID = 0;
			this.cmpUIDA = 0;
			this.cmpUIDB = 0;
			this.mapFnName = "";
			this.sortFnName = "";
			this.mappingResult = 0;
			this.cmpResult = 0;
			this.foreachItem = {};
			this.foreachIndex = {};
			this.privateGroupName = {};
			
			if (properties)		// note properties may be null in some cases
			{
				
			}
		}
		
		Release()
		{
			super.Release();
		}
		_OnInstanceDestroyed(inst)
		{
			// auto remove uid from groups
			var uid = inst.GetUID();
			var name;
			var groups = this.groups;
			for (name in groups)
				groups[name].RemoveUID(uid);

			this.removePrivateGroup(uid);
		}
		_OnAfterLoad()
		{
	        if (this.randomGenUid === -1)
	            this.randomGen = null;
	        else{
        		this.randomGen = this._runtime.GetInstanceByUID(this.randomGenUid);
	        }
            this.randomGenUid = -1;
        }
		SaveToJson()
		{			
			var info = {};
			var name;
			var groups = this.groups;
			for (name in groups)
				info[name] = groups[name].GetList();

			var randomGenUid = (this.randomGen != null) ? this.randomGen.uid : (-1);
			return {
				"d": info,
				"randomuid": randomGenUid
			};
		}
		
		LoadFromJson(o)
		{
			var info = o["d"];
			var name, group;
			for (name in info)
				this.GetGroup(name).SetByUIDList(info[name]);

			this.randomGenUid = o["randomuid"];
		}
		GetDebuggerProperties() 
		{
			var prop = [];
			var groups = this.groups,
				groupName;
			var uid, uids, inst;
			var types = {},
				typeName, s;
			for (groupName in groups) {
				// clean types
				for (typeName in types) {
					delete types[typeName];
				}
				uids = groups[groupName].GetSet();
				for (uid in uids) {
					inst = this._runtime.GetInstanceByUID(uid);
					if (inst == null)
						continue;
					typeName = inst.GetObjectClass().GetName();
					if (typeName in types)
						types[typeName] += 1;
					else
						types[typeName] = 1;
				}
				s = "";
				for (typeName in types)
					s += typeName.toString() + ":" + types[typeName].toString() + "  ";
				prop.push({
					"name": groupName,
					"value": s
				});
			}
		}
		appendPrivateGroup(name) 
		{
			var uid = getUIDOfPrivateGroup(name);
			if (uid == (-1))
				return;

			var nameList = this.privateGroupName[uid];
			if (nameList == null) {
				nameList = [name];
				this.privateGroupName[uid] = nameList;
			} else
				nameList.push(name);
		}

		removePrivateGroup(uid) 
		{
			var nameList = this.privateGroupName[uid];
			if (nameList == null)
				return;

			var listLen = nameList.length;
			var i;
			for (i = 0; i < listLen; i++)
				this.DestroyGroup(nameList[i]);
			delete this.privateGroupName[uid];
		}

		GetGroup(name) 
		{
			var group = this.groups[name];

			if (group == null) {
				group = new window.RexC2GroupKlass();
				this.groups[name] = group;
				this.appendPrivateGroup(name);
			}
			return group;
		}

		HasGroup(name) 
		{
			return this.groups.hasOwnProperty(name);
		}

		DestroyGroup(name) 
		{
			if (this.HasGroup(name))
				delete this.groups[name];
		}

		all2string() 
		{
			var strings = {};
			var name;
			var groups = this.groups;
			for (name in groups)
				strings[name] = groups[name].ToString();
			return JSON.stringify(strings);
		}


		getGroupAB(groupA, groupB, groupResult) 
		{
			if ((groupA != groupResult) && (groupB != groupResult)) {
				this.GetGroup(groupResult).Copy(this.GetGroup(groupA));
				groupA = groupResult;
			} else if (groupResult == groupB) {
				groupB = groupA;
				groupA = groupResult;
			}
			return {
				"a": groupA,
				"b": groupB
			};
		}

		uid2Inst(uid, objtype) 
		{
			var inst = this._runtime.GetInstanceByUID(uid);
			if (inst == null)
				return null;

			if ((objtype == null) || (inst.GetObjectClass() == objtype))
				return inst;
			else if (objtype._isFamily) {
				var families = inst.GetObjectClass()._families;
				var cnt = families.length,
					i;
				for (i = 0; i < cnt; i++) {
					if (objtype == families[i])
						return inst;
				}
			}
			// objtype mismatch
			return null;
		}

		PickUIDs(uids, objType) 
		{
			if (!objType)
				return false;

			return window.RexC2PickUIDs.call(this, uids, objType);
		}

		callMapFunction(fnName, uid) 
		{
			this.mapFnName = fnName;
			this.mappingResult = 0;
			this.mapUID = uid;
			this.Trigger(C3.Plugins.Rex_gInstGroup.Cnds.OnMappingFn,this); // dikkat this, fnName);
			//this.FastTrigger(C3.Plugins.Rex_gInstGroup.Cnds.OnMappingFn,this,fnName); // dikkat this, fnName);
			return this.mappingResult;
		}

		group2insts(name, objtype, isPop) 
		{
			var group = this.GetGroup(name);
			var uidList = group.GetList();
			var i, cnt = uidList.length;
			for (i = 0; i < cnt; i++) {
				_uids.push(uidList[i]);
			}
			var hasInst = this.PickUIDs(_uids, objtype);
			if (isPop == 1) {
				for (i = 0; i < cnt; i++)
					group.RemoveUID(_uids[i]);
			}
			_uids.length = 0;
			return hasInst;
		}

		popInstance(name, index, objtype, isPop) 
		{
			var group = this.GetGroup(name);
			var uidList = group.GetList();
			var uid = uidList[index];
			_uids.push(uid);

			// output        
			var hasInst = this.PickUIDs(_uids, objtype);
			if (isPop == 1) {
				group.RemoveUID(uid);
			}
			_uids.length = 0;
			return hasInst;
		}
		popInstanceByMapFn(name, objtype, isPop, mapFnName, resultType) 
		{
			var group = this.GetGroup(name);
			var uidList = group.GetList();
			var i, cnt = uidList.length;
			var result = null,
				val;
			var isMax = (resultType === 1);
			var uid = -1,
				isUpdated;
			for (i = 0; i < cnt; i++) {
				val = this.callMapFunction(mapFnName, uidList[i]);
				isUpdated = (result === null) ||
					(!isMax && (result > val)) ||
					(isMax && (result < val));

				if (isUpdated) {
					result = val;
					uid = uidList[i];
				}
			}
			_uids.push(uid);

			// output        
			var hasInst = this.PickUIDs(_uids, objtype);
			if (isPop == 1) {
				group.RemoveUID(uid);
			}
			_uids.length = 0;
			return hasInst;
		}

	};
}