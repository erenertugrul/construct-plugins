"use strict";

{
	C3.Plugins.jcw_trace.Type = class jcw_traceType extends C3.SDKTypeBase
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
	    GetObstacleTypes() {
        	return this.obstacleTypes;
    	}

	};
}