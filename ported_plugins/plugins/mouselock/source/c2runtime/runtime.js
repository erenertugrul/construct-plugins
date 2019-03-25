// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
//'Global' vars
/////////////////////////////////////
var mouseX_screenLock = 0;			//TIM: mouse position w/ screen lock
var mouseY_screenLock  = 0;

/////////////////////////////////////

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.MouseLock = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.MouseLock.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};
	
	//Set in InstanceProto.onCreate
	var isInPreview = false; 
		
	//Create alias vars for Mouselock runtime, instance, and div id.
	var MouseLock_Runtime = null;
	var MouseLock_Instance = null;
	var elem = null;

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		MouseLock_Runtime	= this.runtime;	//This is for document event listeners to refer back to the plugin.
		MouseLock_Instance	= this;			//Ditto above. Need both of these.
		elem = this.runtime.canvasdiv;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...

		//START// Tim mod: runtime properties//
		
		//Debug:
		
		this.tickTest = 0; 

		//For Internal Logic
		
			//so that we know if we are in preview mode or not.
		isInPreview = (typeof cr_is_preview !== "undefined");

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

		//END// Tim mod: runtime properties//

		//ALIAS PROPERTIES CLASS
		var props = this.properties;

		//START// Tim mod: Alias properties define in edittime//

		this.activate_on		=	props[0];
		//Stores keycode of custom button to activate mouse lock. For now, not a property; default to Enter(keycode 13).
		this.custom_key_lock	=	/*props[1]*/	13;
		this.bounding 			=	props[1];
		this.disable_if_unlock	=	props[2];
//		this.quantum_tunneling	=	props[3];		//Told you this was useless! 
		this.smoothing			=	props[4];
		this.invert_x			=	props[5];
		this.invert_y			=	props[6];
		this.cursor_speed		=	props[7];
		this.dead_zone			=	props[8];
		this.speed_cap			=	props[9];
		this.response_curve		=	props[10];

		//END// Tim mod: Alias properties define in edittime//

		////////////////////////////////////STARTUP FUNCTIONS////////////////////////////////
		
		//Set is_supported. 0 if false, 1 if true.
		this.is_supported = 'pointerLockElement' in document	|| 
							'mozPointerLockElement' in document	|| 
							'webkitPointerLockElement' in document;

		//If is_supported is null, log to console:
		if(this.is_supported) 	{ console.log("Warning! Mouse lock is not supported on this platform!"); }
		else					{ console.log("Mouse lock should be supported on this platform."); }
		
		//START:	ESC Fix: Makes ESC work in node-webkit.
		jQuery(document).keyup(	function(e) 
			{
			if(e.keyCode === 27)	
				instanceProto.unlockPointer();
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
			console.log("Custom key if statement has run.");		
			var self = this;
			
		//On key up, if said key(e) matches the keycode in custom_key_lock, call lockPointer.
		jQuery(document).keyup(	function(e) 
			{
			console.log("jquery key up has run. any key being released should call this.");		
			if(e.keyCode === self.custom_key_lock)	
				{
				console.log("e.keyCode matches custom_key_lock. Now, lock pointer will be called.");					
				self.lockPointer();
				}
			else
				{
				console.log("e.keyCode did not match custom_key_lock. Here are the vals:");					
				console.log("e.keyCode:");	
				console.log(e.keyCode);	
				console.log("self.custom_key_lock:");
				console.log(self.custom_key_lock);				
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
		this.runtime.tickMe(this);
	};
	
	//Call this function to lock pointer. Doesn't test any conditions.
	instanceProto.lockPointer = function () 
	{
	//Set Is Locked to true. I think, if this fails, it will go back to 0.
	this.is_locked = 1;
	
	//this feeds the correct function (browser dependant terminology) into requestPointerLock
	this.runtime.canvas.requestPointerLock = this.runtime.canvas["requestPointerLock"] || this.runtime.canvas["mozRequestPointerLock"] || this.runtime.canvas["webkitRequestPointerLock"];

	//Lock the pointer
   	this.runtime.canvas.requestPointerLock();
	};
	
	//Call this function to unlock pointer. Doesn't test any conditions.
	instanceProto.unlockPointer = function () 
	{
	//Set Is Locked to false. Isn't possible to relock without calling lockPointer, which will reset this.
	this.is_locked = 0;	
	
	//this feeds the correct function (browser dependant terminology) into exitPointerLock
	document.exitPointerLock =	document["exitPointerLock"]		|| 
								document["mozExitPointerLock"]	|| 
								document["webkitExitPointerLock"];
	//Unlock the pointer
   	document.exitPointerLock();
	};	
	
	
	instanceProto.moveCallback = function (e) 
	{
	
		//Set vars
		mouseX_screenLock =  e["movementX"] || e["mozMovementX"] || e["webkitMovementX"] || 0;
		mouseY_screenLock =  e["movementY"] || e["mozMovementY"] || e["webkitMovementY"] || 0;

		//Track all mouse movements into console
   		console.log("Mouse Moved ...");
   		console.log(mouseX_screenLock);
  		console.log(mouseY_screenLock);
	};
	
	instanceProto.MovementLogic = function	(raw_xy, invert_xy, x_or_y) 
											//raw_x/y, invert status, and whether feeding x or y (for caching last_x/y)
	{
		//Speed cap correct
		
		var speed_cap_proxy = this.speed_cap; //proxy this.speed_cap
		
		//equal to or less than 0? Make improbably large (effectively disabled).
		if(speed_cap_proxy <= 0)	{speed_cap_proxy = 1000000;}
		
		//Cursor speed
		this.temp_xy = raw_xy * this.cursor_speed;
		
		//deadzone and speed cap (temp_xy, deadzone, speed cap)
		if(this.temp_xy < 0)	//temp_x is negative number
			
			this.temp_xy = cr.clamp(this.temp_xy, speed_cap_proxy * -1, this.dead_zone * -1);
		
		else				//temp_x is positive number
	
			this.temp_xy = cr.clamp(this.temp_xy, this.dead_zone, speed_cap_proxy);
			
		//deadzone correct (if temp_xy < deadzone, should return 0, but clamp returns deadzone instead. So, follow clamp with this)
		if(Math.abs(this.temp_xy) == this.dead_zone)	{ this.temp_xy = 0; }
		
		//If not over deadzone threshold, increment is_moving (for condition 'Is Moving')
		else											{ this.is_moving += 1; }
		
		//If invert is true, invert		
		if (invert_xy) { this.temp_xy *= -1;	/*console.log("Invert is true");*/}
		//for debug
		//else {console.log("Invert is false");}

		//Now that raw val has been speed adjusted, clamped(dead_zone, speedcap), and inverted(?)
		//And mouse lock x/y has been cached in last_x/y, add adjusted val to mouse_lock_x/y		
		//Before we mess with it, move mouse_x/y into this.last_x/y
		
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
	};
	
	instanceProto.BoundingLogic = function	(xy, x_or_y) 
											//val being fed in, and what kind of val (x or y) being fed in.
	{
	/*
	//Bounds the incoming val by relevant boundary 
		function Bounder(e)	
		{
		if(e == 0)	//Bound to window
			//If x_or_y is "x", return window width; if "y", return window height; if neither, "Null Return"(should show up as NaN).
			return	x_or_y == "x" ? this.runtime.width	: 
					x_or_y == "y" ? this.runtime.height	: "Null Return";
					
		if(e == 1)	//Bound to layout
			//If x_or_y is "x", return layout width; if "y", return layout height; if neither, "Null Return"(should show up as NaN).
			return	x_or_y == "x" ? this.layout.width		: 
					x_or_y == "y" ? this.layout.height	: "Null Return";		
		
		else
			console.log("Bounder function (inside BoundingLogic) was called, but has been fed the wrong value. This is...strange.");
			
		};
	*/	
		
	//Begin Bounding tests:
		
		//Bound to Window:
		if(this.bounding == 0)
			{
			xy = cr.clamp( xy, 0,	x_or_y == "x" ? this.runtime.width	: 
									x_or_y == "y" ? this.runtime.height	: 
									"Null Return" );
			}	
			
		//Bound to Layout:
		if(this.bounding == 1)
			{
			xy = cr.clamp( xy, 0,	x_or_y == "x" ? this.runtime.running_layout.width	: 
									x_or_y == "y" ? this.runtime.running_layout.height	: 
									"Null Return" );			
			//Old:						
			//xy = cr.clamp( xy, 0, Bounder(1) );
			}				
	
	//Return Final val. 
	//If neither of the above run, the mouse is essentially 'Unbounded'.
		
		return xy;
	};
	
	//This runs every tick
	instanceProto.tick = function () 
	{

	//Clear this at the beginning of every tick
		this.is_moving = 0;
	
	//Movement stuff:
			
		//Raw Values: Cache old vals (ALWAYS DO BEFORE UPDATING RAW VALUES!!!)
		
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
			this.move_angle_tmp = cr.to_degrees( cr.angleTo(this.last_x, this.last_y, this.mouse_lock_x, this.mouse_lock_y) );
		
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
	};	
	
	//When pointer lock state changes
	instanceProto.pointerLockChange = function () 
	{	
	/*
		if(MouseLock_Instance.is_locked == 1)
		{
			console.log("Pointer is locked. is_locked is true. Calling trigger OnLock.");
			MouseLock_Runtime.trigger(cr.plugins_.MouseLock.prototype.cnds.OnLock, MouseLock_Instance);			
		}
		if(MouseLock_Instance.is_locked == 0)
		{
			console.log("Pointer is unlocked. is_unlocked is true. Calling trigger OnUnlock.");
			MouseLock_Runtime.trigger(cr.plugins_.MouseLock.prototype.cnds.OnUnlock, MouseLock_Instance);				
		}		
	*/	
		//the below isn't working. Commented out for now.
				
		document.pointerLockElement =	/*document.pointerLockElement    	||*/
										//commenting out the above line makes this work as intended. Don't know why.
										document["mozPointerLockElement"]	||
										document["webkitPointerLockElement"];
										
		if (document.pointerLockElement === MouseLock_Runtime.canvas)
		{
			console.log("Pointer is locked. is_locked is true. Calling trigger OnLock.");
			MouseLock_Instance.is_locked = 1;		//I do this elsewhere; consider this a double check.
			MouseLock_Runtime.trigger(cr.plugins_.MouseLock.prototype.cnds.OnLock, MouseLock_Instance);				
			
		} 
		else 
		{
			console.log("Pointer is unlocked. is_unlocked is true. Calling trigger OnUnlock.");
			MouseLock_Instance.is_locked = 0;		//I do this elsewhere; consider this a double check.
			MouseLock_Runtime.trigger(cr.plugins_.MouseLock.prototype.cnds.OnUnlock, MouseLock_Instance);		
		}
		
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "Status",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}	
				
				{"name": "Is Supported?",	"value": this.is_supported	?	"True" : "False",	"readonly": true},			
				{"name": "Is Locked?",		"value": this.is_locked		?	"True" : "False",	"readonly": true},
				{"name": "Is Moving?",		"value": this.is_moving		?	"True" : "False",	"readonly": true},		
			]
		});
		
		propsections.push({
			"title": "Settings",
			"properties": [
				{"name": "Activate On",			"value": this.activate_on,							"readonly": true},
				{"name": "Disable if Unlocked",	"value": this.disable_if_unlock ? "True" : "False",	"readonly": false},
				{"name": "Invert X",			"value": this.invert_x ? "True" : "False",			"readonly": false},
				{"name": "Invert Y",			"value": this.invert_y ? "True" : "False",			"readonly": false},				
				{"name": "Cursor Speed",		"value": this.cursor_speed,							"readonly": false},		
				{"name": "Deadzone",			"value": this.dead_zone,							"readonly": false},		
				{"name": "Speed Cap",			"value": this.speed_cap,							"readonly": false},	
				{"name": "Tick Test",			"value": this.tickTest,								"readonly": false},	
				{"name": "Custom Key Readout",	"value": this.custom_key_lock,						"readonly": false},				
			]
		});			
		
		propsections.push({
			"title": "Movement Data",
			"properties": [
				{"name": "Movement Angle",		"value": this.movement_angle,	"readonly": true},
				{"name": "Raw X",				"value": this.raw_x,			"readonly": true},
				{"name": "Raw Y",				"value": this.raw_y,			"readonly": true},
				{"name": "Mouse Lock X",		"value": this.mouse_lock_x,		"readonly": true},
				{"name": "Mouse Lock Y",		"value": this.mouse_lock_y,		"readonly": true},
			]
		});	
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.

		if (name === "Disable if Unlocked")
			this.disable_if_unlock = value;		
			
		if (name === "Invert X")
			this.invert_x = value;
			
		if (name === "Invert Y")
			this.invert_y = value;	

		if (name === "Cursor Speed")
			this.cursor_speed = value;
			
		if (name === "Deadzone")
			this.dead_zone = value;	

		if (name === "Speed Cap")
			this.speed_cap = value;		
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	//Normal Conditions:

	// Is pointer lock supported?
	Cnds.prototype.IsSupported = function ()
	{
		return this.is_supported;
	};

	// Is pointer currently locked?
	Cnds.prototype.IsLocked = function ()
	{
		return this.is_locked;
	};

	// Is mouse moving?
	Cnds.prototype.IsMoving = function ()
	{
		return this.is_moving;
	};
	
	//Trigger Conditions:
	
	// This is triggered when pointer is locked.
	Cnds.prototype.OnLock = function ()
	{
		return true;
	};	
	
	// This is triggered when pointer is unlocked.
	Cnds.prototype.OnUnlock = function ()
	{
		return true;
	};	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.SetMouseLock = function (setMouseLock)
	{
		// set mouse lock
		this.mouse_lock_state = setMouseLock;
		
		if(this.mouse_lock_state == 0)	//action is calling for lock to be enabled
			{
			// alert the message
			console.log("Trying to enable mouse lock");
			//lock pointer
			this.lockPointer();
			}
		else							//action calling for lock to be disabled
			{
			// print to console
			console.log("Trying to disable mouse lock (or, this test could be failing)");
			//Unlock pointer
			this.unlockPointer();
			}
	};

	Acts.prototype.InvertX = function (NewInvertX)
	{
		// invert x axis
		this.invert_x = NewInvertX;
	};

	Acts.prototype.InvertY = function (NewInvertY)
	{
		// invert y axis
		this.invert_y = NewInvertY;
	};
	
	Acts.prototype.SetCursorSpeed = function (NewCursorSpeed)
	{
		//set cursor_speed to new value
		this.cursor_speed = NewCursorSpeed;
	};
	
	Acts.prototype.SetSpeedCap = function (NewSpeedCap)
	{
		//set speed_cap to new value
		this.speed_cap = NewSpeedCap;
	};

	Acts.prototype.SetDeadZone = function (NewDeadZone)
	{
		//set dead_zone to new value
		this.dead_zone = NewDeadZone;
	};	
	
	Acts.prototype.SetResponseCurve = function (NewResponseCurve)
	{
		//set dead_zone to new value
		this.response_curve = NewResponseCurve;
	};	
	
	Acts.prototype.SetCustomLockActivateKey = function (NewCustomKey)
	{
		//set custome key lock to new value
		if(this.custom_key_lock === 27)	//If keycode is ESC(keycode 27)...
			{
			//warn developer...
			console.log("Warning: you tried to set custom lock key to ESC. Defaulting back to Enter/Return(keycode 13). ESC is hardwired to unlock the pointer. When you set it to lock the pointer on keyup, it always relocks when you let up on ESC. This, obviously, creates a very nasty situation where the user loses control over his browser; thus, this override.");
			//and if he is in debug, warn him even better:
			if(isInPreview)
				{
				alert(	"Warning: you tried to set custom lock key to ESC. Defaulting back to Enter/Return(keycode 13). ESC is hardwired to unlock the pointer. When you set it to lock the pointer on keyup, it always relocks when you let up on ESC. This, obviously, creates a very nasty situation where the user loses control over his browser; thus, this override.");
				}
			//and, finally, correct keycode to enter(13):
			this.custom_key_lock = 13;
			}
		else	//Otherwise, set value as usual	
			{this.custom_key_lock = NewCustomKey;}
	};	
	
	// ... other actions here ...

///////////////////////////////////////////////////////////////
//Stand Alone Functions:
///////////////////////////////////////////////////////////////

//If there is an error locking pointer, log to console.
function pointerLockError() 
	{
		//If there is a pointer lock error, assume that it is an error to lock, not unlock (unable to unlock very unlikely.)
		//MouseLock_Instance is used since this isn't a sub-function of InstanceProto or TypeProto.
		MouseLock_Instance.is_locked = 0;	
		
		//Debug log
  		console.log("Error while locking pointer.");
	}

///////////////////////////////////////////////////////////////
//END: Stand Alone Functions
///////////////////////////////////////////////////////////////
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	//Raw X val
	Exps.prototype.RawX = function (ret)
	{
		//disable on unlock is true and not locked? Return 0 (this is the movement val. So, no movement).
		if(this.disable_if_unlock && !this.is_locked)	{ret.set_float(0);}
		//otherwise, return normal val
		else											{ret.set_float(this.raw_x);}
	};
	
	//Raw Y val
	Exps.prototype.RawY = function (ret)
	{
		//disable on unlock is true and not locked? Return 0 (this is the movement val. So, no movement).
		if(this.disable_if_unlock && !this.is_locked)	{ret.set_float(0);}
		//otherwise, return normal val
		else											{ret.set_float(this.raw_y);}
	};

//New MouseLock X/Y Functions (just return values) (Okay, so do a little more than just return values...)
	
Exps.prototype.MouseLockX = function (ret, layerparam)
	{
		//disable on unlock is true? Return 0 (x and y both 0, so pointer goes to upper left hand corner of window/layout)
		if(this.disable_if_unlock && !this.is_locked)	{ret.set_float(0);}
		
		//otherwise, do normal logic
		else											
		{
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		
			if (cr.is_undefined(layerparam))
			{
				//I copied this in almost verbatim from Ashley's mouse plugin. It's a little confusing at first,
				//so here's what's going on: the code below stores a few parameters for layer 0 in oldEtc.
				//It then resets those params to their 'default' values. After X/Y is returned, the oldEtc vals
				//are feed back into the layer, returning it to it's original state. This is all basically a
				//hack to make the canvasToLayer function work. It may look bloated for an every tick action, but
				//since there is only ever 1 cursor or instance of mouselock (ditto for the original mouse plugin),
				//it's really an insignificant overhead.

				// calculate X position on bottom layer as if its scale were 1.0
				layer = this.runtime.getLayerByNumber(0);
				oldScale = layer.scale;
				oldZoomRate = layer.zoomRate;
				oldParallaxX = layer.parallaxX;
				oldAngle = layer.angle;
				layer.scale = this.runtime.running_layout.scale;
				layer.zoomRate = 1.0;
				layer.parallaxX = 1.0;
				layer.angle = this.runtime.running_layout.angle;
				ret.set_float(layer.canvasToLayer(this.mouse_lock_x, this.mouse_lock_y, true)); //true for x, false for y
				layer.scale = oldScale;
				layer.zoomRate = oldZoomRate;
				layer.parallaxX = oldParallaxX;
				layer.angle = oldAngle;
			}
			else
			{
				// use given layer param
				if (cr.is_number(layerparam))
					layer = this.runtime.getLayerByNumber(layerparam);
				else
					layer = this.runtime.getLayerByName(layerparam);
					
				if (layer)
					ret.set_float(layer.canvasToLayer(this.mouse_lock_x, this.mouse_lock_y, true)); //true for x, false for y
				else
					ret.set_float(0);
			}		
		}
	};

	Exps.prototype.MouseLockY = function (ret, layerparam)
	{
		//disable on unlock is true? Return 0 (x and y both 0, so pointer goes to upper left hand corner of window/layout).
		if(this.disable_if_unlock && !this.is_locked)	{ret.set_float(0);}
		
		//otherwise, do normal logic
		else											
		{
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		
			if (cr.is_undefined(layerparam))
			{
				//I copied this in almost verbatim from Ashley's mouse plugin. It's a little confusing at first,
				//so here's what's going on: the code below stores a few parameters for layer 0 in oldEtc.
				//It then resets those params to their 'default' values. After X/Y is returned, the oldEtc vals
				//are feed back into the layer, returning it to it's original state. This is all basically a
				//hack to make the canvasToLayer function work. It may look bloated for an every tick action, but
				//since there is only ever 1 cursor or instance of mouselock (ditto for the original mouse plugin),
				//it's really an insignificant overhead.

				// calculate X position on bottom layer as if its scale were 1.0
				layer = this.runtime.getLayerByNumber(0);
				oldScale = layer.scale;
				oldZoomRate = layer.zoomRate;
				oldParallaxY = layer.parallaxY;
				oldAngle = layer.angle;
				layer.scale = this.runtime.running_layout.scale;
				layer.zoomRate = 1.0;
				layer.parallaxY = 1.0;
				layer.angle = this.runtime.running_layout.angle;
				ret.set_float(layer.canvasToLayer(this.mouse_lock_x, this.mouse_lock_y, false)); //true for x, false for y
				layer.scale = oldScale;
				layer.zoomRate = oldZoomRate;
				layer.parallaxY = oldParallaxY;
				layer.angle = oldAngle;
			}
			else
			{
				// use given layer param
				if (cr.is_number(layerparam))
					layer = this.runtime.getLayerByNumber(layerparam);
				else
					layer = this.runtime.getLayerByName(layerparam);
					
				if (layer)
					ret.set_float(layer.canvasToLayer(this.mouse_lock_x, this.mouse_lock_y, false)); //true for x, false for y
				else
					ret.set_float(0);
			}		
		}
	};	
	
	//Current movement angle
	Exps.prototype.MovementAngle = function (ret)
	{
		//return angle
		ret.set_float(this.movement_angle);
	};
///////////////////END TIM MOD///////////////////	
	
	pluginProto.exps = new Exps();

}());