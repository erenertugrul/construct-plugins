"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.MagiCam;

	PLUGIN_CLASS.Instance = class MagiCamInstance extends SDK.IInstanceBase
	{
		constructor(sdkType, inst)
		{
			super(sdkType, inst);
		}
		Release()
		{
		}
		OnCreate()
		{
			//this._runtime.tickMe(this);
			//this._runtime.UpdateRender()
			
		}
		OnPropertyChanged(id, value)
		{
		}
		LoadC2Property(name, valueString)
		{
			return false;       // not handled
		}
	};
}
