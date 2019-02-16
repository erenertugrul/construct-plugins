// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.Circle = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.Circle.prototype;
		
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
		// Load properties
		this.speed = cr.to_radians(this.properties[0]);
		this.acc = cr.to_radians(this.properties[1]);
		this.angle = cr.to_radians(this.properties[2]);
		this.radiusX = this.properties[3];
		this.radiusY = this.properties[4];
		this.enabled = (this.properties[5] !== 0);
		// set default
		this.originX = this.inst.x - Math.cos(this.angle) * this.radiusX;
		this.originY = this.inst.y - Math.sin(this.angle) * this.radiusY;
	};
	
	behinstProto.onDestroy = function ()
	{
		// called when associated object is being destroyed
		// note runtime may keep the object and behavior alive after this call for recycling;
		// release, recycle or reset any references here as necessary
	};
	
	// called when saving the full state of the game
	behinstProto.saveToJSON = function ()
	{
		return {
			"speed": this.speed,
			"acc": this.acc,
			"angle": this.angle,
			"radiusX": this.radiusX,
			"radiusY": this.radiusY,
			"originX": this.originX,
			"originY": this.originY,
			"enabled": this.enabled
		};
	};
	
	// called when loading the full state of the game
	behinstProto.loadFromJSON = function (o)
	{
		this.speed = o["speed"];
		this.acc = o["acc"];
		this.angle = o["angle"];
		this.radiusX = o["radiusX"];
		this.radiusY = o["radiusY"];
		this.originX = o["originX"];
		this.originY = o["originY"];
		this.enabled = o["enabled"];
	};
	
	behinstProto.tick = function ()
	{
		if(!this.enabled)
			return;

		var dt = this.runtime.getDt(this.inst);

		if (dt === 0)
			return;
			
		if (this.acc !== 0)
			this.speed += this.acc * dt;
			
		if (this.speed !== 0)
		{
			// increment angle
			this.angle = cr.clamp_angle(this.angle + this.speed * dt);
			this.inst.x = (Math.cos(this.angle) * (this.radiusX) ) + this.originX,
			this.inst.y = (Math.sin(this.angle) * (this.radiusY) ) + this.originY;
			
			this.inst.set_bbox_changed();
		}
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": this.type.name,
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				{"name": "Speed", "value": cr.to_degrees(this.speed)},
				{"name": "Acceleration", "value": cr.to_degrees(this.acc)},
				{"name": "Circle Angle", "value": cr.to_degrees(this.angle)},
				{"name": "RadiusX", "value": this.radiusX},
				{"name": "RadiusY", "value": this.radiusY},
				{"name": "Origin X", "value": this.originX},
				{"name": "Origin Y", "value": this.originY},
				{"name": "Enabled", "value": this.enabled}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		switch (name) {
		case "Speed":				this.speed = cr.to_radians(value);			break;
		case "Acceleration":		this.acc = cr.to_radians(value);			break;
		case "Circle Angle":		this.angle = cr.to_radians(value);			break;
		case "RadiusX":				this.radiusX = value;						break;
		case "RadiusY":				this.radiusY = value;						break;
		case "OriginX":				this.originX = value;						break;
		case "OriginY":				this.originY = value;						break;
		case "Enabled":				this.enabled = value;						break;
		}
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.IsEnabled = function ()
	{
		return this.enabled;
	};
	
	Cnds.prototype.CompareSpeed = function (cmp, s)
	{
		return cr.do_cmp(this.speed, cmp, s);
	};

	Cnds.prototype.CompareRadiusX = function (cmp, r)
	{
		return cr.do_cmp(this.radiusX, cmp, r);
	};
	Cnds.prototype.CompareRadiusY = function (cmp, r)
	{
		return cr.do_cmp(this.radiusY, cmp, r);
	};
	Cnds.prototype.CompareOriginX = function (cmp, o)
	{
		return cr.do_cmp(this.originX, cmp, o);
	};
	Cnds.prototype.CompareOriginY = function (cmp, o)
	{
		return cr.do_cmp(this.originY, cmp, o);
	};
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetSpeed = function (s)
	{
		this.speed = cr.to_radians(s);
	};
	
	Acts.prototype.SetAcceleration = function (a)
	{
		this.acc = cr.to_radians(a);
	};
	
	Acts.prototype.SetAngle = function (a)
	{
		this.angle = cr.to_radians(a);
	};

	Acts.prototype.SetEnabled = function (en)
	{
		this.enabled = (en === 1);
	};

	Acts.prototype.SetRadiusX = function (rX)
	{
		this.radiusX = rX;
	};
	
	Acts.prototype.SetRadiusY = function (rY)
	{
		this.radiusY = rY;
	};

	Acts.prototype.SetOriginX = function (oX)
	{
		this.originX = oX;
	};
	
	Acts.prototype.SetOriginY = function (oY)
	{
		this.originY = oY;
	};

	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(cr.to_degrees(this.speed));
	};
	
	Exps.prototype.Acceleration = function (ret)
	{
		ret.set_float(cr.to_degrees(this.acc));
	};

	Exps.prototype.Angle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.angle));
	};
	
	Exps.prototype.RadiusX = function (ret)	
	{
		ret.set_float(this.radiusX);
	};
	
	Exps.prototype.RadiusY = function (ret)
	{
		ret.set_float(this.radiusY);
	};

	Exps.prototype.OriginX = function (ret)	
	{
		ret.set_float(this.originX);
	};
	
	Exps.prototype.OriginY = function (ret)
	{
		ret.set_float(this.originY);
	};
	
	
	behaviorProto.exps = new Exps();
	
}());