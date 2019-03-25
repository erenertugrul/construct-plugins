"use strict";

{
	C3.Plugins.MouseLock.Cnds =
	{
		IsSupported()
		{
			return this.is_supported;
		},

		IsLocked()
		{
			return this.is_locked;
		},

		IsMoving()
		{
			return this.is_moving;
		},
		
		OnLock()
		{
			return true;
		},	
		
		OnUnlock()
		{
			return true;
		}	

	};
}