// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");
/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.MagiCam = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// Custom math namespace
	var CMath = {};
	
	// Lerp function
	CMath.lerp = function(a, b, x)
	{
		return a + (b - a) * x;
	};
	
	// Cubic function
	CMath.cubic = function(a, b, c, d, x)
	{
		return this.lerp(this.lerp(this.lerp(a, b, x), this.lerp(b, c, x), x), this.lerp(this.lerp(b, c, x), this.lerp(c, d, x), x), x);
	}
	
	// Clamp function
	CMath.clamp = function(x, min, max)
	{
		if (x < min)
		{
			return min;
		}
		else if (x > max)
		{
			return max;
		}
		
		return x;
	};
	
	// Transition class
	function Transition(Type, Duration, Param1, Param2, Param3, Param4)
	{
		// Standard properties
		this.type = Type;
		this.duration = Duration;
		this.param1 = Param1;
		this.param2 = Param2;
		this.param3 = Param3;
		this.param4 = Param4;
		
		// Working values
		this.progress = 0;
	}
	
	// Camera class or something
	function Camera(Name, X, Y, Scale, Global)
	{
		// Standard properties
		this.global = Global;
		this.name = Name;
		this.x = X;
		this.y = Y;
		this.scale = Scale;
		
		// Following
		this.following = false;
		this.followedObjects = [];
		this.followedObjectUIDs = [];
		this.objectWeights = [];
		this.followedObjectIPs = [];
		this.followLag = 1;
		
		// Zoom to contain
		this.zoomToContain = false;
		this.zoomMarginH = 0;
		this.zoomMarginV = 0;
		this.zoomBoundU = -1;
		this.zoomBoundL = -1;
		
		// Camera transitions
		this.transitions = [];
		this.moveTransFinished = false;
		this.zoomTransFinished = false;

		// Camera shake
		this.isShaking = false;
		this.shakeX = 0;
		this.shakeY = 0;
		this.shakeZoom = 0;
		this.shakeTimer = 0;
		this.shakeStrength = 0;
		this.shakeMaxDeviation = 0;
		this.shakeMaxZoomDeviation = 0;
		this.shakeLength = 0;
		this.shakeBuildTime = 0;
		this.shakeDropTime = 0;
	}
	
	Camera.prototype.GetName = function()
	{
		return this.name;
	};

	Camera.prototype.GetX = function()
	{
		return this.x;
	};
	
	Camera.prototype.SetX = function(value)
	{
		this.x = value;
	};
	
	Camera.prototype.GetY = function()
	{
		return this.y;
	};
	
	Camera.prototype.SetY = function(value)
	{
		this.y = value;
	};

	Camera.prototype.GetShakeX = function()
	{
		return this.shakeX;
	};
	
	Camera.prototype.GetShakeY = function()
	{
		return this.shakeY;
	};
	
	Camera.prototype.SetFollowedObject = function(fObject)
	{
		this.followedObject = fObject;
	};

	Camera.prototype.ShakeCamera = function(dt)
	{
		// Check if the camera should be shaking
		if (this.isShaking)
		{
			this.shakeTimer += dt;

			if (this.shakeTimer < this.shakeLength)
			{
				var shakeStrength = 0;

				if (this.shakeTimer < this.shakeBuildTime)
				{
					shakeStrength = CMath.lerp(0, this.shakeStrength, this.shakeTimer / this.shakeBuildTime);
				}
				else
				{
					shakeStrength = this.shakeStrength;
				}

				if (this.shakeTimer > this.shakeDropTime)
				{
					shakeStrength = CMath.lerp(this.shakeStrength, 0, (this.shakeTimer - this.shakeDropTime) / (this.shakeLength - this.shakeDropTime));
				}

				var shakeAngle = Math.floor(Math.random() * 361) / 57.2958;
				var shakeX = CMath.lerp(0, Math.cos(shakeAngle) * this.shakeMaxDeviation, shakeStrength);
				var shakeY = CMath.lerp(0, Math.sin(shakeAngle) * this.shakeMaxDeviation, shakeStrength);
				var shakeZoom = CMath.lerp(0, (Math.floor(Math.random() * 201 - 100) / 100) * this.shakeMaxZoomDeviation, shakeStrength);

				this.shakeX = CMath.lerp(this.shakeX, shakeX, shakeStrength);
				this.shakeY = CMath.lerp(this.shakeY, shakeY, shakeStrength);
				this.shakeZoom = CMath.lerp(this.shakeZoom, shakeZoom, shakeStrength);
			}
			else
			{
				this.isShaking = false;
				this.shakeX = 0;
				this.shakeY = 0;
				this.shakeZoom = 0;
			}
		}
	}
	
	Camera.prototype.ProcessTransitions = function(dt)
	{
		// Reset the transition finished values
		this.moveTransFinished = false;
		this.zoomTransFinished = false;
		
		// Temporary value
		var transition;
		
		// Camera transitions
		for (var i = 0; i < this.transitions.length; )
		{
			transition = this.transitions[i];
			
			transition.progress = CMath.clamp(transition.progress + (1.0 / transition.duration * dt), 0.0, 1.0);
			
			if (transition.type == "MOVE")
			{
				this.x = CMath.cubic(transition.param3, transition.param3, transition.param1, transition.param1, transition.progress);
				this.y = CMath.cubic(transition.param4, transition.param4, transition.param2, transition.param2, transition.progress);
			}
			else if (transition.type == "SCALE")
			{
				this.scale = CMath.cubic(transition.param2, transition.param2, transition.param1, transition.param1, transition.progress);
			}
			
			if (transition.progress == 1)
			{
				// Check the transition type and mark it as finished
				if (transition.type == "MOVE")
				{
					this.moveTransFinished = true;
				}
				else if (transition.type == "SCALE")
				{
					this.zoomTransFinished = true;
				}
				
				this.transitions.splice(i, 1);
			}
			else
			{
				i++;
			}
		}
	};

	Camera.prototype.UpdateCameraTarget = function(dt, targetCamera)
	{
		// Update the transition stuff
		for (var i = 0; i < this.transitions.length; i++)
		{
			var transition = this.transitions[i];
			if (transition.type == "MOVE")
			{
				transition.param1 = targetCamera.GetX();
				transition.param2 = targetCamera.GetY();
			}
			else if (transition.type == "SCALE")
			{
				transition.param1 = targetCamera.scale;
			}
		}
	};
	
	Camera.prototype.ProcessFollowing = function(dt, screenWidth, screenHeight, layout)
	{
			// Followed objects
		var followed = this.followedObjects;
		var followedObjectIPs = this.followedObjectIPs;
		
		// Object following
		if (this.following && followed.length > 0)
		{
			// Temporary position
			var tempX = 0, tempY = 0, tempScale = 0;
			
			// Perform a weighted follow if the camera is not set to zoom to contain
			if (!this.zoomToContain)
			{
				var sumX = 0, sumY = 0, sumW = 0;
				
				for (var i = 0; i < followed.length; i++)
				{
					sumX += followed[i].getImagePoint(followedObjectIPs[i], true) * this.objectWeights[i];
					sumY += followed[i].getImagePoint(followedObjectIPs[i], false) * this.objectWeights[i];
					sumW += this.objectWeights[i];
				}
				
				// Set the temporary position
				tempX = sumX / sumW;
				tempY = sumY / sumW;

			}
			else
			{
				var minX = 0, maxX = 0, minY = 0, maxY = 0;
				var minXChanged = false, maxXChanged = false, minYChanged = false, maxYChanged = false;
				
				for (var i = 0; i < followed.length; i++)
				{
					var fObject = followed[i];
					fObject.update_bbox();
					
					if (minXChanged)
					{
						minX = Math.min(minX, fObject.bbox.left);
					}
					else
					{
						minX = fObject.bbox.left;
						minXChanged = true;
					}
					if (maxXChanged)
					{
						maxX = Math.max(maxX, fObject.bbox.right);
					}
					else
					{
						maxX = fObject.bbox.right;
						maxXChanged = true;
					}
					if (minYChanged)
					{
						minY = Math.min(minY, fObject.bbox.top);
					}
					else
					{
						minY = fObject.bbox.top;
						minYChanged = true;
					}
					if (maxYChanged)
					{
						maxY = Math.max(maxY, fObject.bbox.bottom);
					}
					else
					{
						maxY = fObject.bbox.bottom;
						maxYChanged = true;
					}
				}
				
				// Zoom
				var tempXScale = (screenWidth - this.zoomMarginH * 2) / (maxX - minX);
				var tempYScale = (screenHeight - this.zoomMarginV * 2) / (maxY - minY);
				
				// Scroll to the middle
				tempX = CMath.lerp(minX, maxX, 0.5);
				tempY = CMath.lerp(minY, maxY, 0.5);
				
				// Check if the view is going over the layout bound
				if (this.x < ((screenWidth / 2) / tempXScale))
				{
					tempXScale = (screenWidth - this.zoomMarginH) / maxX;
					tempX = (screenWidth / tempXScale) / 2;
				}
				
				if (this.x > (layout.width - (screenWidth / 2) / tempXScale))
				{
					tempXScale = (screenWidth - this.zoomMarginH) / (layout.width - minX);
					tempX = layout.width - (screenWidth / tempXScale) / 2;
				}
				
				// Check if the view is going over the layout bound
				if (this.y < ((screenHeight / 2) / tempYScale))
				{
					tempYScale = (screenHeight - this.zoomMarginV) / maxY;
					tempY = (screenHeight / tempYScale) / 2;
				}
				
				if (this.y > (layout.height - (screenHeight / 2) / tempYScale))
				{
					tempYScale = (screenHeight - this.zoomMarginV) / (layout.height - minY);
					tempY = layout.height - (screenHeight / tempYScale) / 2;
				}
				
				// Set the calculated temp scale
				tempScale = Math.min(tempXScale, tempYScale);

				// Ensure that tempScale is bounded properly
				if (this.zoomBoundL != -1)
				{
					if (tempScale < this.zoomBoundL)
					{
						tempScale = this.zoomBoundL;
					}
				}
				if (this.zoomBoundU != -1)
				{
					if (tempScale > this.zoomBoundU)
					{
						tempScale = this.zoomBoundU;
					}
				}
			}
			
			// Scroll
			if (this.followLag == 1)
			{
				this.x = tempX;
				this.y = tempY;
				
				// Scale if zoom to contain is enabled
				if (this.zoomToContain)
				{
					this.scale = tempScale;
				}
			}
			else
			{
				var lag = (this.followLag * 4.0 * dt) * Math.sqrt(1.0 / dt);
				this.x = CMath.lerp(this.x, tempX, lag);
				this.y = CMath.lerp(this.y, tempY, lag);
				
				// Scale if zoom to contain is enabled
				if (this.zoomToContain)
				{
					this.scale = CMath.lerp(this.scale, tempScale, lag);
				}
			}
		}
	};

	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.MagiCam.prototype;
		
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

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// Local cameras
		this.localCameras = [];
		this.localCameraCount = 0;
		this.localCameraCountOld = 0;

		// Transition cameras
		this.transCamera = null;
		this.transTarget = null;
		this.isSwitchingCameras = false;
		
		// Global cameras
		this.globalCameras = [];
		
		// Active camera
		this.activeCamera = null;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// Have the runtime call this instances tick function
		this.runtime.tickMe(this);
		
		this.my_timescale = -1.0;
	};

	instanceProto.saveToJSON = function ()
	{
		// Throw the trans camera on top of local cameras list
		if (null != this.transCamera)
		{
			this.localCameras.push(this.transCamera);
		}

		var o = {
			"lcc": this.localCameraCount,
			"olcc": this.localCameraCountOld,
			"alcc": this.localCameras.length,
			"agcc": this.globalCameras.length,
			"tcnn": (this.transCamera == null ? false : true)
		};

		for (var i = 0; i < this.localCameras.length; i++)
		{
			o["lc" + i + "g"] = this.localCameras[i].global;
			o["lc" + i + "n"] = this.localCameras[i].name;
			o["lc" + i + "x"] = this.localCameras[i].x;
			o["lc" + i + "y"] = this.localCameras[i].y;
			o["lc" + i + "s"] = this.localCameras[i].scale;
			o["lc" + i + "f"] = this.localCameras[i].following;
			o["lc" + i + "foc"] = this.localCameras[i].followedObjects.length;
			for (var f = 0; f < this.localCameras[i].followedObjects.length; f++)
			{
				o["lc" + i + "fo" + f] = this.localCameras[i].followedObjects[f].uid;
			}
			for (var w = 0; w < this.localCameras[i].objectWeights.length; w++)
			{
				o["lc" + i + "fow" + w] = this.localCameras[i].objectWeights[w];
			}
			for (var ip = 0; ip < this.localCameras[i].followedObjectIPs.length; ip++)
			{
				o["lc" + i + "foip" + ip] = this.localCameras[i].followedObjectIPs[ip];
			}
			o["lc" + i + "fl"] = this.localCameras[i].followLag;
			o["lc" + i + "ztc"] = this.localCameras[i].zoomToContain;
			o["lc" + i + "zmh"] = this.localCameras[i].zoomMarginH;
			o["lc" + i + "zmv"] = this.localCameras[i].zoomMarginV;
			o["lc" + i + "zbu"] = this.localCameras[i].zoomBoundU;
			o["lc" + i + "zbl"] = this.localCameras[i].zoomBoundL;
			o["lc" + i + "tc"] = this.localCameras[i].transitions.length;
			for (var t = 0; t < this.localCameras[i].transitions.length; t++)
			{
				o["lc" + i + "t" + t + "tp"] = this.localCameras[i].transitions[t].type;
				o["lc" + i + "t" + t + "d"] = this.localCameras[i].transitions[t].duration;
				o["lc" + i + "t" + t + "p1"] = this.localCameras[i].transitions[t].param1;
				o["lc" + i + "t" + t + "p2"] = this.localCameras[i].transitions[t].param2;
				o["lc" + i + "t" + t + "p3"] = this.localCameras[i].transitions[t].param3;
				o["lc" + i + "t" + t + "p4"] = this.localCameras[i].transitions[t].param4;
				o["lc" + i + "t" + t + "pr"] = this.localCameras[i].transitions[t].progress;
			}
			o["lc" + i + "mtf"] = this.localCameras[i].moveTransFinished;
			o["lc" + i + "ztf"] = this.localCameras[i].zoomTransFinished;
			o["lc" + i + "csis"] = this.localCameras[i].isShaking;
			o["lc" + i + "cssx"] = this.localCameras[i].shakeX;
			o["lc" + i + "cssy"] = this.localCameras[i].shakeY;
			o["lc" + i + "cssz"] = this.localCameras[i].shakeZoom;
			o["lc" + i + "csst"] = this.localCameras[i].shakeTimer;
			o["lc" + i + "csss"] = this.localCameras[i].shakeStrength;
			o["lc" + i + "cssmd"] = this.localCameras[i].shakeMaxDeviation;
			o["lc" + i + "cssmzd"] = this.localCameras[i].shakeMaxZoomDeviation;
			o["lc" + i + "cssl"] = this.localCameras[i].shakeLength;
			o["lc" + i + "cssbt"] = this.localCameras[i].shakeBuildTime;
			o["lc" + i + "cssdt"] = this.localCameras[i].shakeDropTime;
		}

		for (var i = 0; i < this.globalCameras.length; i++)
		{
			o["gc" + i + "g"] = this.globalCameras[i].global;
			o["gc" + i + "n"] = this.globalCameras[i].name;
			o["gc" + i + "x"] = this.globalCameras[i].x;
			o["gc" + i + "y"] = this.globalCameras[i].y;
			o["gc" + i + "s"] = this.globalCameras[i].scale;
			o["gc" + i + "f"] = this.globalCameras[i].following;
			o["gc" + i + "foc"] = this.globalCameras[i].followedObjects.length;
			for (var f = 0; f < this.globalCameras[i].followedObjects.length; f++)
			{
				o["gc" + i + "fo" + f] = this.globalCameras[i].followedObjects[f].uid;
			}
			for (var w = 0; w < this.globalCameras[i].objectWeights.length; w++)
			{
				o["gc" + i + "fow" + w] = this.globalCameras[i].objectWeights[w];
			}
			for (var ip = 0; ip < this.globalCameras[i].followedObjectIPs.length; ip++)
			{
				o["gc" + i + "foip" + ip] = this.globalCameras[i].followedObjectIPs[ip];
			}
			o["gc" + i + "fl"] = this.globalCameras[i].followLag;
			o["gc" + i + "ztc"] = this.globalCameras[i].zoomToContain;
			o["gc" + i + "zmh"] = this.globalCameras[i].zoomMarginH;
			o["gc" + i + "zmv"] = this.globalCameras[i].zoomMarginV;
			o["gc" + i + "zbu"] = this.globalCameras[i].zoomBoundU;
			o["gc" + i + "zbl"] = this.globalCameras[i].zoomBoundL;
			o["gc" + i + "tc"] = this.globalCameras[i].transitions.length;
			for (var t = 0; t < this.globalCameras[i].transitions.length; t++)
			{
				o["gc" + i + "t" + t + "tp"] = this.globalCameras[i].transitions[t].type;
				o["gc" + i + "t" + t + "d"] = this.globalCameras[i].transitions[t].duration;
				o["gc" + i + "t" + t + "p1"] = this.globalCameras[i].transitions[t].param1;
				o["gc" + i + "t" + t + "p2"] = this.globalCameras[i].transitions[t].param2;
				o["gc" + i + "t" + t + "p3"] = this.globalCameras[i].transitions[t].param3;
				o["gc" + i + "t" + t + "p4"] = this.globalCameras[i].transitions[t].param4;
			}
			o["gc" + i + "mtf"] = this.globalCameras[i].moveTransFinished;
			o["gc" + i + "ztf"] = this.globalCameras[i].zoomTransFinished;
			o["gc" + i + "csis"] = this.globalCameras[i].isShaking;
			o["gc" + i + "cssx"] = this.globalCameras[i].shakeX;
			o["gc" + i + "cssy"] = this.globalCameras[i].shakeY;
			o["gc" + i + "cssz"] = this.globalCameras[i].shakeZoom;
			o["gc" + i + "csst"] = this.globalCameras[i].shakeTimer;
			o["gc" + i + "csss"] = this.globalCameras[i].shakeStrength;
			o["gc" + i + "cssmd"] = this.globalCameras[i].shakeMaxDeviation;
			o["gc" + i + "cssmzd"] = this.globalCameras[i].shakeMaxZoomDeviation;
			o["gc" + i + "cssl"] = this.globalCameras[i].shakeLength;
			o["gc" + i + "cssbt"] = this.globalCameras[i].shakeBuildTime;
			o["gc" + i + "cssdt"] = this.globalCameras[i].shakeDropTime;
		}

		if (null != this.activeCamera)
		{
			o["ac"] = this.activeCamera.name;
		}
		else
		{
			o["ac"] = "null";
		}

		if (null != this.transTarget)
		{
			o["tt"] = this.transTarget.name;
		}

		return o;
	}

	instanceProto.loadFromJSON = function (o)
	{
		this.localCameras = [];
		this.globalCameras = [];
		this.localCameraCount = o["lcc"];
		this.localCameraCountOld = o["olcc"];

		var localCamCount = o["alcc"];
		for (var i = 0; i < localCamCount; i++)
		{
			var tempCam = new Camera("", 0, 0, 0, false);

			tempCam.global = o["lc" + i + "g"];
			tempCam.name = o["lc" + i + "n"];
			tempCam.x = o["lc" + i + "x"];
			tempCam.y = o["lc" + i + "y"];
			tempCam.scale = o["lc" + i + "s"];
			tempCam.following = o["lc" + i + "f"];

			var foCount = o["lc" + i + "foc"];
			for (var f = 0; f < foCount; f++)
			{
				tempCam.followedObjectUIDs.push(o["lc" + i + "fo" + f]);
			}
			for (var w = 0; w < foCount; w++)
			{
				tempCam.objectWeights.push(o["lc" + i + "fow" + w]);
			}
			for (var ip = 0; ip < foCount; ip++)
			{
				tempCam.followedObjectIPs.push(o["lc" + i + "foip" + ip]);
			}

			tempCam.followLag = o["lc" + i + "fl"];
			tempCam.zoomToContain = o["lc" + i + "ztc"];
			tempCam.zoomMarginH = o["lc" + i + "zmh"];
			tempCam.zoomMarginV = o["lc" + i + "zmv"];
			tempCam.zoomBoundU = o["lc" + i + "zbu"];
			tempCam.zoomBoundL = o["lc" + i + "zbl"];
			var transCount = o["lc" + i + "tc"];
			for (var t = 0; t < transCount; t++)
			{
				var tempTrans = new Transition("", 0, 0, 0, 0);
				tempTrans.type = o["lc" + i + "t" + t + "tp"];
				tempTrans.duration = o["lc" + i + "t" + t + "d"];
				tempTrans.param1 = o["lc" + i + "t" + t + "p1"];
				tempTrans.param2 = o["lc" + i + "t" + t + "p2"];
				tempTrans.param3 = o["lc" + i + "t" + t + "p3"];
				tempTrans.param4 = o["lc" + i + "t" + t + "p4"];
				tempTrans.progress = o["lc" + i + "t" + t + "pr"];
				tempCam.transitions.push(tempTrans);
			}
			tempCam.moveTransFinished = o["lc" + i + "mtf"];
			tempCam.zoomTransFinished = o["lc" + i + "ztf"];
			tempCam.isShaking = o["lc" + i + "csis"];
			tempCam.shakeX = o["lc" + i + "cssx"];
			tempCam.shakeY = o["lc" + i + "cssy"];
			tempCam.shakeZoom = o["lc" + i + "cssz"];
			tempCam.shakeTimer = o["lc" + i + "csst"];
			tempCam.shakeStrength = o["lc" + i + "csss"];
			tempCam.shakeMaxDeviation = o["lc" + i + "cssmd"];
			tempCam.shakeMaxZoomDeviation = o["lc" + i + "cssmzd"];
			tempCam.shakeLength = o["lc" + i + "cssl"];
			tempCam.shakeBuildTime = o["lc" + i + "cssbt"];
			tempCam.shakeDropTime = o["lc" + i + "cssdt"];

			this.localCameras.push(tempCam);
		}

		var globalCamCount = o["agcc"];
		for (var i = 0; i < globalCamCount; i++)
		{
			var tempCam = new Camera("", 0, 0, 0, false);

			tempCam.global = o["gc" + i + "g"];
			tempCam.name = o["gc" + i + "n"];
			tempCam.x = o["gc" + i + "x"];
			tempCam.y = o["gc" + i + "y"];
			tempCam.scale = o["gc" + i + "s"];
			tempCam.following = o["gc" + i + "f"];

			var foCount = o["gc" + i + "foc"];
			for (var f = 0; f < foCount; f++)
			{
				tempCam.followedObjectUIDs.push(o["gc" + i + "fo" + f]);
			}
			for (var w = 0; w < foCount; w++)
			{
				tempCam.objectWeights.push(o["gc" + i + "fow" + w]);
			}
			for (var ip = 0; ip < foCount; ip++)
			{
				tempCam.followedObjectIPs.push(o["gc" + i + "foip" + ip]);
			}

			tempCam.followLag = o["gc" + i + "fl"];
			tempCam.zoomToContain = o["gc" + i + "ztc"];
			tempCam.zoomMarginH = o["gc" + i + "zmh"];
			tempCam.zoomMarginV = o["gc" + i + "zmv"];
			tempCam.zoomBoundU = o["gc" + i + "zbu"];
			tempCam.zoomBoundL = o["gc" + i + "zbl"];
			var transCount = o["gc" + i + "tc"];
			for (var t = 0; t < transCount; t++)
			{
				var tempTrans = new Transition("", 0, 0, 0, 0);
				tempTrans.type = o["gc" + i + "t" + t + "tp"];
				tempTrans.duration = o["gc" + i + "t" + t + "d"];
				tempTrans.param1 = o["gc" + i + "t" + t + "p1"];
				tempTrans.param2 = o["gc" + i + "t" + t + "p2"];
				tempTrans.param3 = o["gc" + i + "t" + t + "p3"];
				tempTrans.param4 = o["gc" + i + "t" + t + "p4"];
				tempCam.transitions.push(tempTrans);
			}
			tempCam.moveTransFinished = o["gc" + i + "mtf"];
			tempCam.zoomTransFinished = o["gc" + i + "ztf"];
			tempCam.isShaking = o["gc" + i + "csis"];
			tempCam.shakeX = o["gc" + i + "cssx"];
			tempCam.shakeY = o["gc" + i + "cssy"];
			tempCam.shakeZoom = o["gc" + i + "cssz"];
			tempCam.shakeTimer = o["gc" + i + "csst"];
			tempCam.shakeStrength = o["gc" + i + "csss"];
			tempCam.shakeMaxDeviation = o["gc" + i + "cssmd"];
			tempCam.shakeMaxZoomDeviation = o["gc" + i + "cssmzd"];
			tempCam.shakeLength = o["gc" + i + "cssl"];
			tempCam.shakeBuildTime = o["gc" + i + "cssbt"];
			tempCam.shakeDropTime = o["gc" + i + "cssdt"];

			this.globalCameras.push(tempCam);
		}

		var activeCam = o["ac"];

		if (activeCam == "null")
		{
			this.activeCamera = null;
		}
		else
		{
			this.activeCamera = this.GetCamera(activeCam);
		}

		var hasTransCam = o["tcnn"];

		if (hasTransCam)
		{
			this.transCamera = this.localCameras.pop();
			this.transTarget = this.GetCamera(o["tt"]);
		}
	}

	instanceProto.afterLoad = function()
	{
		for (var i = 0; i < this.localCameras.length; i++)
		{
			for (var o = 0; o < this.localCameras[i].followedObjectUIDs.length; o++)
			{
				this.localCameras[i].followedObjects.push(this.runtime.getObjectByUID(this.localCameras[i].followedObjectUIDs[o]));
			}
		}

		for (var i = 0; i < this.globalCameras.length; i++)
		{
			for (var o = 0; o < this.globalCameras[i].followedObjectUIDs.length; o++)
			{
				this.globalCameras[i].followedObjects.push(this.runtime.getObjectByUID(this.globalCameras[i].followedObjectUIDs[o]));
			}
		}
	}
	
	// Called when the layout changes
	instanceProto.onLayoutChange = function()
	{
		// Get rid of the old local cameras
		for (var i = 0; i < this.localCameraCountOld; i++)
		{
			this.localCameras.shift();
		}
		
		this.localCameraCount -= this.localCameraCountOld;
	}
	
	// Tick
	instanceProto.tick = function()
	{
		// Update the old camera count
		this.localCameraCountOld = this.localCameraCount;
		
		// Ensurethat delta time is always greater than zero
		var dt = this.runtime.getDt(this);
		if (dt == 0)
		{
			dt = 0.1;
		}
		
		// Update all of the global cameras
		for (var i = 0; i < this.globalCameras.length; i++)
		{
			this.globalCameras[i].ProcessTransitions(dt);
			this.globalCameras[i].ProcessFollowing(dt, this.runtime.original_width, this.runtime.original_height, this.runtime.running_layout);
			this.globalCameras[i].ShakeCamera(dt);
		}
		
		// Update all of the local cameras
		for (var i = 0; i < this.localCameras.length; i++)
		{
			this.localCameras[i].ProcessTransitions(dt);
			this.localCameras[i].ProcessFollowing(dt, this.runtime.original_width, this.runtime.original_height, this.runtime.running_layout);
			this.localCameras[i].ShakeCamera(dt);
		}

		// Update the transition camera
		if (null != this.transCamera)
		{
			this.transCamera.UpdateCameraTarget(dt, this.transTarget);
			this.transCamera.ProcessTransitions(dt);

			if (this.transCamera.moveTransFinished)
			{
				this.activeCamera = this.transTarget;
				this.transCamera = null;
			}
		}
		
		// If there is an active camera, set the scroll and scale values of the layout to match
		if (this.activeCamera != null)
		{
			// Scroll
			this.runtime.running_layout.scrollToX(this.activeCamera.GetX() + this.activeCamera.GetShakeX());
			this.runtime.running_layout.scrollToY(this.activeCamera.GetY() + this.activeCamera.GetShakeY());
			
			// Set the scale
			this.runtime.running_layout.scale = this.activeCamera.scale + this.activeCamera.shakeZoom;
			
			// Have the layout redrawn
			this.runtime.redraw = true;
		}
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};
	
	// GetCamera returns a camera from a given name
	instanceProto.GetCamera = function(Name)
	{
		// Return the active camera if Name is blank
		if (Name == "")
		{
			return this.activeCamera;
		}
		
		// Search through the global cameras first
		for (var i = (this.globalCameras.length - 1) ; i >= 0; i--)
		{
			if (this.globalCameras[i].GetName() == Name)
			{
				return this.globalCameras[i];
			}
		}
		
		// Search through the local cameras second
		for (var i = (this.localCameras.length - 1); i >= 0; i--)
		{
			if (this.localCameras[i].GetName() == Name)
			{
				return this.localCameras[i];
			}
		}
		
		return null;
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.TransitionFinished = function (CameraName, Transition)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Check the type of transition specified
			if (Transition == 0)
			{
				return camera.moveTransFinished;
			}
			else if (Transition == 1)
			{
				return camera.zoomTransFinished;
			}
		}
		
		// Return false by default
		return false;
	};
	
	// the example condition
	Cnds.prototype.TransitionIsInProgress = function (CameraName, Transition)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Check if there is a transition of the type specified in progress
			for (var i = 0; i < camera.transitions.length; i++)
			{
				if (camera.transitions[i].type == "MOVE" && Transition == 0)
				{
					return true;
				}
				else if (camera.transitions[i].type == "SCALE" && Transition == 1)
				{
					return true;
				}
			}
		}
		
		// Return false by default
		return false;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// FollowObject
	Acts.prototype.FollowObject = function (CameraName, FollowedObject, ObjectWeight, ImagePoint)
	{
		// Make sure an object was picked
		if (!FollowedObject)
		{
			return;
		}
		
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Get the first picked instance of the specified object type
			var followedObject = FollowedObject.getFirstPicked();
			
			// Check to ensure that if the camera is global and the object isn't that the object isn't followed
			if (camera.global && !FollowedObject.global)
			{
				alert("MagiCam:\n\nObject not global - global cameras must follow global objects.");
				return;
			}
			
			// Follow the specified object
			camera.followedObjects.push(followedObject);
			camera.objectWeights.push(ObjectWeight);
			camera.followedObjectIPs.push(ImagePoint);
		}
	};
	
	Acts.prototype.SetFollowLag = function (CameraName, FollowLag)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Set the follow lag for this object
			camera.followLag = 1 - FollowLag / 100;
		}
	};
	
	Acts.prototype.ZoomToContain = function (CameraName, Zoom, ZoomMarginH, ZoomMarginV, ZoomBoundU, ZoomBoundL)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Set the zoom value of the camera
			if (Zoom == 0)
			{
				camera.zoomToContain = true;
				camera.zoomMarginH = ZoomMarginH;
				camera.zoomMarginV = ZoomMarginV;
				camera.zoomBoundU = ZoomBoundU;
				camera.zoomBoundL = ZoomBoundL;
			}
			else
			{
				camera.zoomToContain = false;
			}
		}
	};
	
	Acts.prototype.EnableFollowing = function (CameraName, Following)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Set the following state
			if (Following == 0)
			{
				camera.following = true;
			}
			else
			{
				camera.following = false;
			}
		}
	};

	// FollowObject
	Acts.prototype.UnfollowObject = function (CameraName, FollowedObject)
	{
		// Make sure an object was picked
		if (!FollowedObject)
		{
			return;
		}
		
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Get the first picked instance of the specified object type
			var followedObject = FollowedObject.getFirstPicked();
			
			// Check if this object is being followed
			for (var i = 0; i < camera.followedObjects.length; i++)
			{
				if (camera.followedObjects[i] == followedObject)
				{
					// Un-follow
					camera.followedObjects.splice(i, 1);
					break;
				}
			}
		}
	};
	
	// CreateLocalCamera
	Acts.prototype.CreateLocalCamera = function (cameraName, cameraX, cameraY, cameraScale, Active)
	{
		// Make sure that the name isn't blank
		if (cameraName == "")
		{
			alert("Camera name must not be blank.");
			return;
		}
		
		// Add a new camera to the list
		this.localCameras.push(new Camera(cameraName, cameraX, cameraY, cameraScale, false));
		this.localCameraCount++;
		
		// Check if the camera should be made active
		if (Active == 1)
		{
			this.activeCamera = this.localCameras[this.localCameras.length - 1];
			this.runtime.running_layout.scale = this.activeCamera.scale;
		}
	};
	
	// CreateGlobalCamera
	Acts.prototype.CreateGlobalCamera = function (cameraName, cameraX, cameraY, cameraScale, Active)
	{
		// Make sure that the name isn't blank
		if (cameraName == "")
		{
			alert("Camera name must not be blank.");
			return;
		}
		else if (this.GetCamera(cameraName) != null)
		{
			return;
		}
		
		// Add a new camera to the list
		this.globalCameras.push(new Camera(cameraName, cameraX, cameraY, cameraScale, true));
		
		// Check if the camera should be made active
		if (Active == 1)
		{
			this.activeCamera = this.globalCameras[this.globalCameras.length - 1];
			this.runtime.running_layout.scrollToX(this.activeCamera.GetX());
			this.runtime.running_layout.scrollToY(this.activeCamera.GetY());
			this.runtime.running_layout.scale = this.activeCamera.scale;
		}
	};
	
	// SetActiveCamera
	Acts.prototype.SetActiveCamera = function (CameraName)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Set the new active camera
			this.activeCamera = camera;
			
			// Setup the layout to match
			this.runtime.running_layout.scrollToX(camera.GetX());
			this.runtime.running_layout.scrollToY(camera.GetY());
			this.runtime.running_layout.scale = camera.scale;
		}
	};
	
	// SetXPosition
	Acts.prototype.SetScrollSmoothing = function (CameraName)
	{
	};
	
	// SetXPosition
	Acts.prototype.SetXPosition = function (CameraName, X)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Set the camera position
			camera.SetX(X);
		}
	};
	
	// SetYPosition
	Acts.prototype.SetYPosition = function (CameraName, Y)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Set the camera position
			camera.SetY(Y);
		}
	};
	
	// SetPosition
	Acts.prototype.SetPosition = function (CameraName, X, Y)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Set the camera position
			camera.SetX(X);
			camera.SetY(Y);
		}
	};
	
	// SetZoom
	Acts.prototype.SetZoom = function (CameraName, Zoom)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Set the camera position
			camera.scale = Zoom;
		}
	};
	
	// TransitionToPoint
	Acts.prototype.TransitionToPoint = function (CameraName, X, Y, Duration)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Check if there is already a movement transition in progress
			for (var i = 0; i < camera.transitions.length; i++)
			{
				if (camera.transitions[i].type == "MOVE")
				{
					camera.transitions.splice(i, 1);
					break;
				}
			}
			
			// Add the new transition
			camera.transitions.push(new Transition("MOVE", Duration, X, Y, camera.GetX(), camera.GetY()));
			
			// Disable following and zoom to contain
			camera.following = false;
			camera.zoomToContain = false;
		}
	};
	
	// TransitionToZoom
	Acts.prototype.TransitionToZoom = function (CameraName, Zoom, Duration)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Check if there is already a scale transition in progress
			for (var i = 0; i < camera.transitions.length; i++)
			{
				if (camera.transitions[i].type == "SCALE")
				{
					camera.transitions.splice(i, 1);
					break;
				}
			}
			
			// Add the new transition
			camera.transitions.push(new Transition("SCALE", Duration, Zoom, camera.scale, null, null));
			
			// Disable zoom to contain
			camera.zoomToContain = false;
		}
	};

	// TransitionToCamera
	Acts.prototype.TransitionToCamera = function (CameraName, Duration)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Setup the transition
			this.transTarget = camera;
			this.transCamera = new Camera("transCamera", this.activeCamera.GetX(), this.activeCamera.GetY(), this.activeCamera.scale, false);
			this.transCamera.transitions.push(new Transition("MOVE", Duration, this.transTarget.GetX(), this.transTarget.GetY(), this.transCamera.GetX(), this.transCamera.GetY()));
			this.transCamera.transitions.push(new Transition("SCALE", Duration, this.transTarget.scale, this.transCamera.scale, null, null));

			// Switch the active camera to the transition camera
			this.activeCamera = this.transCamera;
			this.isSwitchingCameras = true;
		}
	};

	// ShakeCamera
	Acts.prototype.ShakeCamera = function (CameraName, Strength, MaxDeviation, MaxZoomDeviation, BuildLength, DropTime, Duration)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);
		
		// Check that a camera was found
		if (camera != null)
		{
			// Setup the shake
			camera.isShaking = true;
			camera.shakeStrength = Strength / 100;
			camera.shakeMaxDeviation = MaxDeviation;
			camera.shakeMaxZoomDeviation = MaxZoomDeviation;
			camera.shakeBuildTime = BuildLength;
			camera.shakeDropTime = DropTime;
			camera.shakeLength = Duration;
			camera.shakeTimer = 0;
		}
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// MovementTransitionProgress
	Exps.prototype.MovementTransitionProgress = function (ret, CameraName)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);

		// Check that a camera was found
		if (null != camera)
		{
			// Check if there is already a movement transition in progress
			for (var i = 0; i < camera.transitions.length; i++)
			{
				if (camera.transitions[i].type == "MOVE")
				{
					ret.set_float(camera.transitions[i].progress);
					return;
				}
			}
		}

		// Return 0 by default
		ret.set_float(0);
	};

	// ZoomTransitionProgress
	Exps.prototype.ZoomTransitionProgress = function (ret, CameraName)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);

		// Check that a camera was found
		if (null != camera)
		{
			// Check if there is already a movement transition in progress
			for (var i = 0; i < camera.transitions.length; i++)
			{
				if (camera.transitions[i].type == "SCALE")
				{
					ret.set_float(camera.transitions[i].progress);
					return;
				}
			}
		}

		// Return 0 by default
		ret.set_float(0);
	};

	// GetX
	Exps.prototype.GetX = function (ret, CameraName)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);

		// Check that a camera was found
		if (null != camera)
		{
			ret.set_float(camera.x);
			return;
		}

		// Return 0 by default
		ret.set_float(0);
	};

	// GetY
	Exps.prototype.GetY = function (ret, CameraName)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);

		// Check that a camera was found
		if (null != camera)
		{
			ret.set_float(camera.y);
			return;
		}

		// Return 0 by default
		ret.set_float(0);
	};

	// GetZoom
	Exps.prototype.GetZoom = function (ret, CameraName)
	{
		// Retrieve the specified camera
		var camera = this.GetCamera(CameraName);

		// Check that a camera was found
		if (null != camera)
		{
			ret.set_float(camera.scale);
			return;
		}

		// Return 0 by default
		ret.set_float(0);
	};

	// GetActiveCamera
	Exps.prototype.GetActiveCamera = function (ret)
	{
		// Check that a camera was found
		if (null != this.activeCamera)
		{
			ret.set_string(this.activeCamera.name);
			return;
		}

		// Return 0 by default
		ret.set_string("null");
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());