"use strict";

{
	C3.Behaviors.Rex_light.Type = class Rex_lightType extends C3.SDKBehaviorTypeBase
	{
		constructor(behaviorType)
		{
			super(behaviorType);
		}
		
		Release()
		{
			super.Release();
		}
		
		OnCreate()
		{	
			this._obstacleTypes = [];
		}
	    GetObstacleTypes() {
        	return this._obstacleTypes;
    	}
	};
}