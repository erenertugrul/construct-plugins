"use strict";

function getShakeBehavior(inst)
{
	var i, len, binst;
	for (i = 0, len = inst.behavior_insts.length; i < len; ++i)
	{
		binst = inst.behavior_insts[i];
		
		if (binst.behavior instanceof cr.behaviors.lgshake)
			return binst;
	}
	
	return null;
};
{
	C3.Behaviors.lgshake = class lgshake extends C3.SDKBehaviorBase
	{
		constructor(opts)
		{
			super(opts);
			this.shakeMag = 0;
			this.shakeStart = 0;
			this.shakeEnd = 0;
			this.shakeMode = 0;
			this.shakeEnforcePosition = 0;
			this.shakeOriginalX = 0;
			this.shakeOriginalY = 0;
			this.axis = 0; //eklenen
		}
		
		Release()
		{
			super.Release();
		}
	};
}