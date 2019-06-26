"use strict";

{
	C3.Plugins.Rex_gInstGroup.Exps =
	{
		MapUID()
		{
			return(this.mapUID);
		},
		CmpUIDA()
		{
			return(this.cmpUIDA);
		},

		CmpUIDB()
		{
			return(this.cmpUIDB);
		},

		InstCnt(name) 
		{
			return(this.GetGroup(name).GetList().length);
		},

		UID2Index(name, uid) 
		{
			return(this.GetGroup(name).UID2Index(uid));
		},

		Index2UID(name, index) 
		{
			return(this.GetGroup(name).Index2UID(index));
		},

		Item(var_name) 
		{
			var item = this.foreachItem[var_name];
			if (item == null)
				item = (-1);
			return(item);
		},

		Index(var_name) 
		{
			var index = this.foreachIndex[var_name];
			if (index == null)
				index = (-1);
			return(index);
		},

		GroupToString(name) 
		{
			return(this.GetGroup(name).ToString());
		},

		AllToString()
		{
			return(this.all2string());
		},

		PrivateGroup(uid, name) 
		{
			return(PGPrefix + uid.toString() + PGPostfix + name);
		},

		Pop(name, index) 
		{
			return(this.GetGroup(name).Pop(index));
		},

		FirstUID(name) 
		{
			return(this.GetGroup(name).Index2UID(0));
		},

		LastUID(name) 
		{
			var uidList = this.GetGroup(name).GetList();
			var index = uidList.length - 1;
			var uid = uidList[index];
			if (uid == null) 
			{
				uid = -1;
			}
			return(uid);
		},

		RandomIndex(name) 
		{
			var index = Math.floor(Math.random() * this.GetGroup(name).GetList().length);
			return(index);
		},

		RandomIndex2UID(name) 
		{
			var group = this.GetGroup(name);
			var index = Math.floor(Math.random() * group.GetList().length);
			return(group.Index2UID(index));
		},

		RandomPop(name) 
		{
			var index = Math.floor(Math.random() * this.GetGroup(name).GetList().length);
			return(this.GetGroup(name).Pop(index));
		}
	};
}