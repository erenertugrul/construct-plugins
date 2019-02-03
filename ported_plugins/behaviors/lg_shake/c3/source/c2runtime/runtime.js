// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.lgshake = function(runtime)
{
	this.runtime = runtime;
	
	this.shakeMag = 0;
	this.shakeStart = 0;
	this.shakeEnd = 0;
	this.shakeMode = 0;
	this.shakeEnforcePosition = 0;
	this.shakeOriginalX = 0;
	this.shakeOriginalY = 0;
	this.axis = 0; //eklenen
};

(function ()
{
	var behaviorProto = cr.behaviors.lgshake.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};

	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		this.enabled = (this.properties[0] !== 0);
	};

	behinstProto.saveToJSON = function ()
	{
		return {
			"smg": this.shakeMag,
			"ss": this.shakeStart,
			"se": this.shakeEnd,
			"smd": this.shakeMode
		};
	};
	
	behinstProto.loadFromJSON = function (o)
	{
		this.shakeMag = o["smg"];
		this.shakeStart = o["ss"];
		this.shakeEnd = o["se"];
		this.shakeMode = o["smd"];
	};
	
	behinstProto.tick = function ()
	{
		// Do work in tick2 instead, to eliminate one-frame lag if object position changes in events
	};
	
	function getShakeBehavior(inst)
	{
		var i, len, binst;
		for (i = 0, len = inst.behavior_insts.length; i < len; ++i)
		{
			binst = inst.behavior_insts[i];
			
			if (binst.behavior instanceof cr.behaviors.lgshake)
				return binst;
		}
		
		return null;
	};
	
	behinstProto.tick2 = function ()
	{
		if (!this.enabled)
			return;
		
		// Is in a shake?
		var now = this.runtime.kahanTime.sum;
		var offx = 0, offy = 0;
		
		if (now >= this.shakeStart && now < this.shakeEnd)
		{
			var mag = this.shakeMag * Math.min(this.runtime.timescale, 1);
			
			// Mode 0 - reducing magnitude - lerp to zero
			if (this.shakeMode === 0)
				mag *= 1 - (now - this.shakeStart) / (this.shakeEnd - this.shakeStart);
				
			var a = Math.random() * Math.PI * 2;
			var d = Math.random() * mag;
			offx = Math.cos(a) * d;
			offy = Math.sin(a) * d;
		}
		
		//update only when necessary and one more time to enforce object position
		if (offx != 0 || offy != 0 || (this.shakeEnforcePosition === 1 && this.shakeStart > 0)) {
			if (this.axis == 1){
				this.inst.x = this.shakeEnforcePosition ? this.shakeOriginalX + offx : this.inst.x + offx;
			}
			else if (this.axis == 2){
				this.inst.y = this.shakeEnforcePosition ? this.shakeOriginalY + offy : this.inst.y + offy;
			}
			else{
				this.inst.x = this.shakeEnforcePosition ? this.shakeOriginalX + offx : this.inst.x + offx;
				this.inst.y = this.shakeEnforcePosition ? this.shakeOriginalY + offy : this.inst.y + offy;
			}
			this.inst.set_bbox_changed();
			
			//turn off
			if (this.shakeEnforcePosition === 1 && now > this.shakeEnd)
				this.shakeStart = 0;
		}
	};
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Shake = function (mag, dur, mode, enforcePosition,axis)
	{
		this.shakeMag = mag;
		this.shakeStart = this.runtime.kahanTime.sum;
		this.shakeEnd = this.shakeStart + dur;
		this.shakeMode = mode;
		this.shakeEnforcePosition = enforcePosition;
		this.shakeOriginalX = this.inst.x;
		this.shakeOriginalY = this.inst.y;
		this.axis = axis; //eklenen
	};
	
	Acts.prototype.SetEnabled = function (e)
	{
		this.enabled = (e !== 0);
	};
	
	behaviorProto.acts = new Acts();
	
}());