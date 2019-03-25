"use strict";
function pointerLockError() {
		//If there is a pointer lock error, assume that it is an error to lock, not unlock (unable to unlock very unlikely.)
		//MouseLock_Instance is used since this isn't a sub-function of InstanceProto or TypeProto.
		MouseLock_Instance.is_locked = 0;	
		
		//Debug log
  		//console.log("Error while locking pointer.");
}
{
	C3.Plugins.MouseLock.Instance = class MouseLockInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			MouseLock_Runtime	= this._runtime;	//This is for document event listeners to refer back to the plugin.
			MouseLock_Instance	= this;			//Ditto above. Need both of these.
			//elem = this._runtime.canvasdiv;
			this.tickTest = 0; 

			//For Internal Logic
			
				//so that we know if we are in preview mode or not.
			isInPreview = (typeof this._runtime.IsPreview() !== "undefined");

				//cache last x/y reading. For computing movement angle, dead zone, smoothing.
			this.last_x				= 0; 
			this.last_y				= 0;
			
				//cache last raw x/y reading. For custom movement (also, right now, for movement angle).
			this.last_raw_x			= 0; 
			this.last_raw_y			= 0;
			
				//Used in tick function for generating movement angle.
			this.move_angle_tmp		= 0;
			
			//ACE's:

			//For actions:

			this.mouse_lock_state	= 0;	//mouse lock state //DEBUG: What is this for?

			//For conditions:

			this.is_supported		= 0;	//is mouse lock supported?
			this.is_locked			= 0;	//is mouse locked?
			this.is_moving			= 0;	//is mouse moving?

			//For expressions:

			this.raw_x				= 0;	//raw y val
			this.raw_y				= 0;	//raw x val
			this.mouse_lock_x		= 0;	//mouse lock x val
			this.mouse_lock_y		= 0;	//mouse lock y val
			this.movement_angle		= 0;	//angle of movement

			
			if (properties)		// note properties may be null in some cases
			{
				this._testProperty = properties[0];
				this.activate_on		=	properties[0];
				this.custom_key_lock	=	13;
				this.bounding 			=	properties[1];
				this.disable_if_unlock	=	properties[2];
				//this.quantum_tunneling	=	//Told you this was useless! 
				this.smoothing			=	properties[4];
				this.invert_x			=	properties[5];
				this.invert_y			=	properties[6];
				this.cursor_speed		=	properties[7];
				this.dead_zone			=	properties[8];
				this.speed_cap			=	properties[9];
				this.response_curve		=	properties[10];
			}
						//Set is_supported. 0 if false, 1 if true.
			this.is_supported = 'pointerLockElement' in document	|| 
								'mozPointerLockElement' in document	|| 
								'webkitPointerLockElement' in document;

			//If is_supported is null, log to console:
			/*if(this.is_supported) 	{ //console.log("Warning! Mouse lock is not supported on this platform!"); }
			else					{ //console.log("Mouse lock should be supported on this platform."); }
			*/
			//START:	ESC Fix: Makes ESC work in node-webkit.
			jQuery(document).keyup(	function(e) 
				{
					var self = this;
				if(e.keyCode === 27)	
					self.unlockPointer();
				}	
			);		
			//END: 		ESC Fix: Makes ESC work in node-webkit.
			if(this.activate_on == 0) //activate on single click
			{
				var self = this;
				
				//associates single click with function onDoubleClick
				jQuery(document).click(	function() {self.lockPointer();}	);	
			};
			
			if(this.activate_on == 1) //activate on double click
			{
				//Listens for double click, call lock pointer

				var self = this;
			
				//associates double click with function onDoubleClick
				jQuery(document).dblclick(	function() {self.lockPointer();}	);		
			};
			
			//Activate on custom key
			if(this.activate_on == 2) //custom key
			{
				//console.log("Custom key if statement has run.");		
				var self = this;
				
			//On key up, if said key(e) matches the keycode in custom_key_lock, call lockPointer.
			jQuery(document).keyup(	function(e) 
				{
				//console.log("jquery key up has run. any key being released should call this.");		
				if(e.keyCode === self.custom_key_lock)	
					{
					//console.log("e.keyCode matches custom_key_lock. Now, lock pointer will be called.");					
					self.lockPointer();
					}
				else
					{
					//console.log("e.keyCode did not match custom_key_lock. Here are the vals:");					
					//console.log("e.keyCode:");	
					//console.log(e.keyCode);	
					//console.log("self.custom_key_lock:");
					//console.log(self.custom_key_lock);				
					}				
				}	
				);
			};

			//////////////////////////////////END STARTUP FUNCTIONS//////////////////////////////
		
			//TIM MOD: Listeners:

			//Listens for mouse to move, calls moveCallback to update vars mouseX/Y_screenLock.

			document.addEventListener("mousemove",				this.moveCallback,		false);

			//Listens for errors

			document.addEventListener('pointerlockerror',		pointerLockError,		false);
			document.addEventListener('mozpointerlockerror',	pointerLockError,		false);
			document.addEventListener('webkitpointerlockerror',	pointerLockError,		false);
			
			//Listens for changes (trying to face the strange -- cha-cha-chang-ge's)

			document.addEventListener('pointerlockchange',		this.pointerLockChange,	false);
			document.addEventListener('mozpointerlockchange',	this.pointerLockChange,	false);
			document.addEventListener('webkitpointerlockchange',this.pointerLockChange,	false);

			//Tick Me. Why am I specifically calling this again?
			this._runtime.UpdateRender();
			this._StartTicking();
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

		lockPointer() 
		{
			this.is_locked = 1;
			
			this._runtime.GetCanvasManager()._canvas.requestPointerLock = this._runtime.GetCanvasManager()._canvas["requestPointerLock"] || this._runtime.GetCanvasManager()._canvas["mozRequestPointerLock"] || this._runtime.GetCanvasManager()._canvas["webkitRequestPointerLock"];

		   	this._runtime.GetCanvasManager()._canvas.requestPointerLock();
		}
		
		unlockPointer() 
		{
			this.is_locked = 0;	
			
			document.exitPointerLock =	document["exitPointerLock"]		|| 
										document["mozExitPointerLock"]	|| 
										document["webkitExitPointerLock"];
		   	document.exitPointerLock();
		}	
		
		
		moveCallback(e) 
		{
		
			//Set vars
			mouseX_screenLock =  e["movementX"] || e["mozMovementX"] || e["webkitMovementX"] || 0;
			mouseY_screenLock =  e["movementY"] || e["mozMovementY"] || e["webkitMovementY"] || 0;

			//Track all mouse movements into console
	   		/*//console.log("Mouse Moved ...");
	   		//console.log(mouseX_screenLock);
	  		//console.log(mouseY_screenLock);*/
		}
		
		MovementLogic(raw_xy, invert_xy, x_or_y) 
		{
			//Speed cap correct
			
			var speed_cap_proxy = this.speed_cap; //proxy this.speed_cap
			
			//equal to or less than 0? Make improbably large (effectively disabled).
			if(speed_cap_proxy <= 0)	{speed_cap_proxy = 1000000;}
			
			//Cursor speed
			this.temp_xy = raw_xy * this.cursor_speed;
			
			//deadzone and speed cap (temp_xy, deadzone, speed cap)
			if(this.temp_xy < 0)	//temp_x is negative number
				
				this.temp_xy = C3.clamp(this.temp_xy, speed_cap_proxy * -1, this.dead_zone * -1);
			
			else				//temp_x is positive number
		
				this.temp_xy = C3.clamp(this.temp_xy, this.dead_zone, speed_cap_proxy);
				
			//deadzone correct (if temp_xy < deadzone, should return 0, but clamp returns deadzone instead. So, follow clamp with this)
			if(Math.abs(this.temp_xy) == this.dead_zone)	{ this.temp_xy = 0; }
			
			//If not over deadzone threshold, increment is_moving (for condition 'Is Moving')
			else											{ this.is_moving += 1; }
			
			//If invert is true, invert		
			if (invert_xy) { this.temp_xy *= -1;	/*//console.log("Invert is true");*/}

			
			//for x...
			if(x_or_y == "x")
				{
				this.last_x = this.mouse_lock_x;		//cache last mouse x
				this.mouse_lock_x += this.temp_xy;		//add temp_xy to current mouse x
				}
			//for y...
			if(x_or_y == "y")
				{
				this.last_y = this.mouse_lock_y;		//see above
				this.mouse_lock_y += this.temp_xy;		//see above
				}
		}
		
		BoundingLogic(xy, x_or_y) 
		{
			//Bound to Window:
			if(this.bounding == 0)
				{
				xy = C3.clamp( xy, 0,	x_or_y == "x" ? this._runtime.GetDrawWidth()	: 
										x_or_y == "y" ? this._runtime.GetDrawHeight()	: 
										"Null Return" );
				}	
				
			//Bound to Layout:
			if(this.bounding == 1)
				{
				xy = C3.clamp( xy, 0,	x_or_y == "x" ? this._runtime.GetMainRunningLayout().GetWidth()	: 
										x_or_y == "y" ? this._runtime.GetMainRunningLayout().GetHeight(): 
										"Null Return" );	
				}				

			return xy;
		}
		
		//This runs every tick
		Tick() 
		{

			this.is_moving = 0;
			
			this.last_raw_x = this.raw_x;
			this.last_raw_y = this.raw_y;
			
			//Raw Values: Update to new vals
			
			this.raw_x = mouseX_screenLock;
			this.raw_y = mouseY_screenLock;		
			
			//Movement Logic:
			
				//for x...
				this.MovementLogic(this.raw_x, this.invert_x, "x"); //send in raw x, invert x, tell movement logic to process as 'x'
				//for y...
				this.MovementLogic(this.raw_y, this.invert_y, "y"); //send in raw y, invert y, tell movement logic to process as 'y'
			
			//Bounding: (Always run after 'Movement Logic')
				//for x...
				this.mouse_lock_x = this.BoundingLogic(this.mouse_lock_x, "x");	//send in mouse_lock_x, tell that sending in x
				//for y...
				this.mouse_lock_y = this.BoundingLogic(this.mouse_lock_y, "y");	//send in mouse_lock_y, tell that sending in y
			
			//Movement Angle Calc:
			
				//Figure current angle from current and last mouse position. 
				this.move_angle_tmp = C3.toDegrees( C3.angleTo(this.last_x, this.last_y, this.mouse_lock_x, this.mouse_lock_y) );
			
				//Correct angle if less than 0
				if(this.move_angle_tmp < 0) {this.move_angle_tmp += 360;}

				//if the mouse position hasn't changed more than the deadzone for either x or y, set move angle to -1. 
				if( (Math.abs(this.last_x - this.raw_x) && Math.abs(this.last_y - this.raw_y)) < this.dead_zone) 
							{this.movement_angle = -1;}
				//otherwise, set it to computed angle
				else		{this.movement_angle = this.move_angle_tmp;}
			
			//Clear these vals at end of tick.
			mouseX_screenLock	= 0; 
			mouseY_screenLock	= 0; 		
		}
		
		//When pointer lock state changes
		pointerLockChange() 
		{	
			//document.pointerLockElement =	/*document.pointerLockElement    	||*/
											//commenting out the above line makes this work as intended. Don't know why.
											//document["mozPointerLockElement"]	||
											//document["webkitPointerLockElement"];
																						
			if (document.pointerLockElement === MouseLock_Runtime.GetCanvasManager()._canvas)
			{
				//console.log("Pointer is locked. is_locked is true. Calling trigger OnLock.");
				MouseLock_Instance.is_locked = 1;		//I do this elsewhere; consider this a double check.
				MouseLock_Instance.Trigger(C3.Plugins.MouseLock.Cnds.OnLock);				
				
			} 
			else 
			{
				//console.log("Pointer is unlocked. is_unlocked is true. Calling trigger OnUnlock.");
				MouseLock_Instance.is_locked = 0;		//I do this elsewhere; consider this a double check.
				MouseLock_Instance.Trigger(C3.Plugins.MouseLock.Cnds.OnUnlock);		
			}
			
		}
	
	};
}