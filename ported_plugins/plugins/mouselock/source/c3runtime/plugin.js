"use strict";
var mouseX_screenLock = 0;			//TIM: mouse position w/ screen lock
var mouseY_screenLock  = 0;
var isInPreview = false; 
	
//Create alias vars for Mouselock runtime, instance, and div id.
var MouseLock_Runtime = null;
var MouseLock_Instance = null;
var elem = null;
//If there is an error locking pointer, log to console.

{
	C3.Plugins.MouseLock = class MouseLockPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}