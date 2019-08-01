"use strict";

{
	C3.Behaviors.Rex_ShakeMod.Cnds =
	{
		OnShackingEnd()
		{
			return (this.is_my_call);
		}, 
		IsShaking()
		{
			return (this.enabled && this.isShaking);
		} 
	};
}