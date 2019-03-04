"use strict";

	var candidates = [];
{
	const tempQuad = new C3.Quad();
	
	C3.Plugins.jcw_trace.Instance = class jcw_traceInstance extends C3.SDKWorldInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			inst = this._inst;
			this.tr = new TR(); 
			if (properties)
			{
				this.obstacleMode = properties[0];
				this.useCollisionCells = (properties[1] !== 0);
				this.padding = C3.clamp(properties[2], 0, 1);
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		
		SaveToJson()
		{
			return {
				// data to be saved for savegames
			};
		}
		
		LoadFromJson(o)
		{
			// load state for savegames
		}
		GetDebuggerProperties()
		{
			const Acts = C3.Behaviors.Circle;
			const prefix = "Circle.";
			return [{
				title: prefix + "Debug",
				properties: [
					{name: "Padding",	value: this.padding, onedit: v => C3.clamp(value, 0, 1)},
					{name: "HitFrac",		value: this.tr.t, onedit: v => C3.toRadians(value)},
					{name: "HitX",			value:  this.tr.hitx, onedit: v => C3.toRadians(value) },
					{name: "HitY",				value:  this.tr.hity},
					{name: "NormalAngle",		value: C3.toDegrees(this.tr.normalang)},
					{name: "ReflectAngle",	value: C3.toDegrees(this.tr.GetReflectAng())}

				]
			}];
		}
		GetOverlapCandidates()
		{
			var tr = this.tr;
			var i, leni;

			if (this.obstacleMode === 0)
			{
				if (this.useCollisionCells)
				{
					this._runtime.GetCollisionEngine().GetSolidCollisionCandidates(null, tr.bounds, candidates);
				}
				else
				{
					var solid = this._runtime.GetSolidBehavior();
					if (solid) C3.appendArray(candidates, solid.GetInstances());
				}
			}
			else
			{
				if (this.useCollisionCells)
				{
					
					this._runtime.GetCollisionEngine().GetObjectClassesCollisionCandidates(null, this.GetSdkType().GetObstacleTypes(), tr.bounds, candidates);
				}
				else
				{
					for (i = 0, leni = this.GetSdkType().GetObstacleTypes().length; i < leni; ++i)
					{   
						C3.appendArray(candidates, this.GetSdkType().GetObstacleTypes()[i].GetInstances());
					}
				}
			}
		}
	};
	
}