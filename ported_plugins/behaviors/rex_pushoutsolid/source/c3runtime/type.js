"use strict";

{
	C3.Behaviors.Rex_pushOutSolid.Type = class Rex_pushOutSolidType extends C3.SDKBehaviorTypeBase
	{
		constructor(objectClass)
		{
			super(objectClass);
			this.obstacleTypes = [];
		}
		
		Release()
		{
			super.Release();
		}
		
		OnCreate()
		{	
		}
	    GetObstacleTypes() 
	    {
        	return this.obstacleTypes;
    	}
	};
}