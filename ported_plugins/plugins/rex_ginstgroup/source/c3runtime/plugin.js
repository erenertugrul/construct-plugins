"use strict";
	var _uids = []; // private global object
	var PGPrefix = "@";
	var PGPostfix = "$";
	var getUIDOfPrivateGroup = function (name) {
		if (name.charAt(0) != PGPrefix)
			return (-1);

		var index = name.indexOf(PGPostfix);
		if (index == (-1))
			return (-1);

		var uid = parseInt(name.substring(1, index));
		return uid;
	};
{
	C3.Plugins.Rex_gInstGroup = class Rex_gInstGroupPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
			(function () {
				// general pick instances function
				if (globalThis.RexC2PickUIDs != null)
					return;

				var _uidmap = {};
				var PickUIDs = function (uids, objtype, checkCb) {
					var sol = objtype.GetCurrentSol();
					sol._instances.length = 0;
					sol._SetSelectAll(false);
					var isFamily = objtype._isFamily;
					var members, memberCnt, i;
					if (isFamily) {
						members = objtype._familyMembers;
						memberCnt = members.length;
					}
					var i, j, uid_cnt = uids.length;
					for (i = 0; i < uid_cnt; i++) {
						var uid = uids[i];
						if (uid == null)
							continue;

						if (_uidmap.hasOwnProperty(uid))
							continue;
						_uidmap[uid] = true;

						var inst = this._runtime.GetInstanceByUID(uid);
						if (inst == null)
							continue;
						if ((checkCb != null) && (!checkCb(uid)))
							continue;

						var typeName = inst.GetObjectClass().GetName();
						if (isFamily) {
							for (j = 0; j < memberCnt; j++) {
								if (typeName == members[j]._name) {
									sol._instances.push(inst);
									break;
								}
							}
						} else {
							if (typeName == objtype._name) {
								sol._instances.push(inst);
							}
						}
					}
					objtype.ApplySolToContainer();

					for (var k in _uidmap)
						delete _uidmap[k];

					return (sol._instances.length > 0);
				};

				globalThis.RexC2PickUIDs = PickUIDs;
			}());

			(function () {
				// general group class
				if (globalThis.RexC2GroupKlass != null)
					return;

				var GroupKlass = function () {
					this._set = {};
					this._list = [];
				};
				var GroupKlassProto = GroupKlass.prototype;

				GroupKlassProto.Clean = function () {
					var key;
					for (key in this._set)
						delete this._set[key];
					this._list.length = 0;
					return this;
				};

				GroupKlassProto.Copy = function (group) {
					var key, table;
					table = this._set;
					for (key in table)
						delete this._set[key];
					table = group._set;
					for (key in table)
						this._set[key] = table[key];
					C3.shallowAssignArray(this._list, group._list);
					return this;
				};

				GroupKlassProto.SetByUIDList = function (uidList, can_repeat) {
					if (can_repeat) // special case
					{
						C3.shallowAssignArray(this._list, uidList);
						var listLen = uidList.length;
						var i, key, table;
						table = this._set;
						for (key in table)
							delete this._set[key];
						for (i = 0; i < listLen; i++)
							this._set[uidList[i]] = true;
					} else {
						this.Clean();
						this.AddUID(uidList);
					}
					return this;
				};

				GroupKlassProto.AddUID = function (_uid) // single number, number list
				{
					if (typeof (_uid) === "object") // uid list      
					{
						var i, uid, cnt = _uid.length;
						for (i = 0; i < cnt; i++) {
							uid = _uid[i];
							if (this._set[uid] == null) // not in group
							{
								this._set[uid] = true;
								this._list.push(uid); // push back
							}
							// else ingored 
						}
					} else // single number
					{
						if (this._set[_uid] == null) // not in group
						{
							this._set[_uid] = true;
							this._list.push(_uid); // push back
						}
						// else ingored 
					}
					return this;
				};

				GroupKlassProto.PushUID = function (_uid, isFront) // single number, number list
				{
					if (typeof (_uid) === "object") // uid list      
					{
						var i, uid, cnt = _uid.length;
						for (i = 0; i < cnt; i++) {
							uid = _uid[i];
							if (this._set[uid] == null)
								this._set[uid] = true;
							else // remove existed item in this._list
								C3.arrayRemove(this._list, this._list.indexOf(uid));
						}

						// add uid ( no repeating check )
						if (isFront)
							this._list.unshift.apply(this._list, _uid); // push front
						else
							this._list.push.apply(this._list, _uid); // push back	  

					} else // single number
					{
						if (this._set[_uid] == null)
							this._set[_uid] = true;
						else // remove existed item in this._list
							C3.arrayRemove(this._list, this._list.indexOf(_uid));


						// add uid
						if (isFront)
							this._list.unshift(_uid); // push front
						else
							this._list.push(_uid); // push back	        
					}
					return this;
				};

				GroupKlassProto.InsertUID = function (_uid, index) // single number, number list
				{
					if (typeof (_uid) === "object") // uid list             
					{
						var i, uid, cnt = _uid.length;
						for (i = 0; i < cnt; i++) {
							uid = _uid[i];
							if (this._set[uid] == null)
								this._set[uid] = true;
							else // remove existed item in this._list
								C3.arrayRemove(this._list, this._list.indexOf(uid));
						}

						// add uid ( no repeating check )
						arrayInsert(this._list, _uid, index)

					} else // single number
					{
						if (this._set[_uid] == null)
							this._set[_uid] = true;
						else // remove existed item in this._list
							C3.arrayRemove(this._list, this._list.indexOf(_uid));

						arrayInsert(this._list, _uid, index)
					}
					return this;
				};

				GroupKlassProto.RemoveUID = function (_uid) // single number, number list
				{
					if (typeof (_uid) === "object") // uid list                         
					{
						var i, uid, cnt = _uid.length;
						for (i = 0; i < cnt; i++) {
							uid = _uid[i];
							if (this._set[uid] != null) {
								delete this._set[uid];
								C3.arrayRemove(this._list, this._list.indexOf(uid));
							}
							// else ingored 
						}
					} else // single number
					{
						if (this._set[_uid] != null) {
							delete this._set[_uid];
							C3.arrayRemove(this._list, this._list.indexOf(_uid));
						}
					}
					return this;
				};

				GroupKlassProto.UID2Index = function (uid) {
					return this._list.indexOf(uid);
				};

				GroupKlassProto.Index2UID = function (index) {
					var _list = this._list;
					var uid = _list[index];
					if (uid == null)
						uid = -1;
					return uid;
				};

				GroupKlassProto.Pop = function (index) {
					var _list = this._list;
					if (index < 0)
						index = _list.length + index;

					var uid = _list[index];
					if (uid == null)
						uid = -1;
					else
						this.RemoveUID(uid);

					return uid;
				};
				GroupKlassProto.Union = function (group) {
					var uids = group._set;
					var uid;
					for (uid in uids)
						this.AddUID(parseInt(uid));
					return this;
				};

				GroupKlassProto.Complement = function (group) {
					this.RemoveUID(group._list);
					return this;
				};

				GroupKlassProto.Intersection = function (group) {
					// copy this._set
					var uid, uids = this._set;
					var flags = {};
					for (uid in uids)
						flags[uid] = true;

					// clean all
					this.Clean();

					// add intersection itme
					uids = group._set;
					for (uid in uids) {
						if (flags[uid] != null)
							this.AddUID(parseInt(uid));
					}
					return this;
				};

				GroupKlassProto.IsSubset = function (subsetGroup) {
					var subsetUIDs = subsetGroup._set;
					var uid;
					var isSubset = true;
					for (uid in subsetUIDs) {
						if (!(uid in this._set)) {
							isSubset = false;
							break;
						}
					}
					return isSubset;
				};

				GroupKlassProto.GetSet = function () {
					return this._set;
				};

				GroupKlassProto.GetList = function () {
					return this._list;
				};

				GroupKlassProto.IsInGroup = function (uid) {
					return (this._set[uid] != null);
				};

				GroupKlassProto.ToString = function () {
					return JSON.stringify(this._list);
				};

				GroupKlassProto.JSONString2Group = function (JSONString) {
					this.SetByUIDList(JSON.parse(JSONString));
				};

				GroupKlassProto.Shuffle = function (randomGen) {
					_shuffle(this._list, randomGen);
				};

				var _shuffle = function (arr, randomGen) {
			        if (randomGen == null)
			            randomGen = Math;

			        var i = arr.length, j, temp;
			        if (i == 0) return;
			        while (--i) {
			            j = Math.floor(randomGen.random() * (i + 1));
			            temp = arr[i];
			            arr[i] = arr[j];
			            arr[j] = temp;
			        }
			    };

				var arrayInsert = function (arr, _value, index) {
					var arrLen = arr.length;
					if (index > arrLen)
						index = arrLen;
					if (typeof (_value) != "object") {
						if (index == 0)
							arr.unshift(_value);
						else if (index == arrLen)
							arr.push(_value);
						else {
							var i, last_index = arr.length;
							arr.length += 1;
							for (i = last_index; i > index; i--)
								arr[i] = arr[i - 1];
							arr[index] = _value;
						}
					} else {
						if (index == 0)
							arr.unshift.apply(arr, _value);
						else if (index == arrLen)
							arr.push.apply(arr, _value);
						else {
							var start_index = arr.length - 1;
							var end_index = index;
							var cnt = _value.length;
							arr.length += cnt;
							var i;
							for (i = start_index; i >= end_index; i--)
								arr[i + cnt] = arr[i];
							for (i = 0; i < cnt; i++)
								arr[i + index] = _value[i];
						}
					}
				};

				globalThis.RexC2GroupKlass = GroupKlass;
			}());
		}
		
		Release()
		{
			super.Release();
		}
	};
}