"use strict";

{
	C3.Behaviors.Rex_GridMove.Type = class Rex_GridMoveType extends C3.SDKBehaviorTypeBase
	{
		constructor(behaviorType)
		{
			super(behaviorType);
	        this.group = null;
        	this.randomGen = null;
		}
		
		Release()
		{
			super.Release();
		}
		
		OnCreate()
		{	
		}
		GetInstGroup()
		{
		    if (this.group != null)
		        return this.group;
		        
		    var plugins = this._runtime.GetAllObjectClasses();
		    var name, inst;
		    for (name in plugins)
		    {
		        inst = plugins[name]._instances[0];
		        
		        if (inst && C3.Plugins.Rex_gInstGroup && (inst._sdkInst instanceof C3.Plugins.Rex_gInstGroup.Instance))
		        {
		            this.group = inst._sdkInst;
		            return this.group;
		        }            
		    }
		    return null;
		}
	};
}