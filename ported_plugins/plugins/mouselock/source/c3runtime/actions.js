"use strict";

{
	C3.Plugins.MouseLock.Acts =
	{
		SetMouseLock(setMouseLock)
		{
			// set mouse lock
			this.mouse_lock_state = setMouseLock;
			
			if(this.mouse_lock_state == 0)	//action is calling for lock to be enabled
				{
				// alert the message
				//console.log("Trying to enable mouse lock");
				//lock pointer
				this.lockPointer();
				}
			else							//action calling for lock to be disabled
				{
				// print to console
				//console.log("Trying to disable mouse lock (or, this test could be failing)");
				//Unlock pointer
				this.unlockPointer();
				}
		},

		InvertX(NewInvertX)
		{
			// invert x axis
			this.invert_x = NewInvertX;
		},

		InvertY(NewInvertY)
		{
			// invert y axis
			this.invert_y = NewInvertY;
		},
		
		SetCursorSpeed(NewCursorSpeed)
		{
			//set cursor_speed to new value
			this.cursor_speed = NewCursorSpeed;
		},
		
		SetSpeedCap(NewSpeedCap)
		{
			//set speed_cap to new value
			this.speed_cap = NewSpeedCap;
		},

		SetDeadZone(NewDeadZone)
		{
			//set dead_zone to new value
			this.dead_zone = NewDeadZone;
		},	
		
		SetResponseCurve(NewResponseCurve)
		{
			//set dead_zone to new value
			this.response_curve = NewResponseCurve;
		},	
		
		SetCustomLockActivateKey(NewCustomKey)
		{
			//set custome key lock to new value
			if(this.custom_key_lock === 27)	//If keycode is ESC(keycode 27)...
				{
				//warn developer...
				//console.log("Warning: you tried to set custom lock key to ESC. Defaulting back to Enter/Return(keycode 13). ESC is hardwired to unlock the pointer. When you set it to lock the pointer on keyup, it always relocks when you let up on ESC. This, obviously, creates a very nasty situation where the user loses control over his browser; thus, this override.");
				//and if he is in debug, warn him even better:
				if(isInPreview)
					{
					//alert(	"Warning: you tried to set custom lock key to ESC. Defaulting back to Enter/Return(keycode 13). ESC is hardwired to unlock the pointer. When you set it to lock the pointer on keyup, it always relocks when you let up on ESC. This, obviously, creates a very nasty situation where the user loses control over his browser; thus, this override.");
					}
				//and, finally, correct keycode to enter(13):
				this.custom_key_lock = 13;
				}
			else	//Otherwise, set value as usual	
				{this.custom_key_lock = NewCustomKey;}
		}
		
	};
}