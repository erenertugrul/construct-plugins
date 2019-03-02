"use strict";
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

					sumX += followed[i].GetImagePoint(followedObjectIPs[i],true)[0] * this.objectWeights[i];
					sumY += followed[i].GetImagePoint(followedObjectIPs[i],false)[1] * this.objectWeights[i];
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
					fObject.GetWorldInfo()._UpdateBbox();
					if (minXChanged)
					{
						minX = Math.min(minX, fObject.GetWorldInfo().GetBoundingBox().getLeft());
					}
					else
					{
						minX = fObject.GetWorldInfo().GetBoundingBox().getRight();
						minXChanged = true;
					}
					if (maxXChanged)
					{
						maxX = Math.max(maxX, fObject.GetWorldInfo().GetBoundingBox().getRight());
					}
					else
					{
						maxX = fObject.GetWorldInfo().GetBoundingBox().getRight();
						maxXChanged = true;
					}
					if (minYChanged)
					{
						minY = Math.min(minY, fObject.GetWorldInfo().GetBoundingBox().getTop());
					}
					else
					{
						minY = fObject.GetWorldInfo().GetBoundingBox().getTop();
						minYChanged = true;
					}
					if (maxYChanged)
					{
						maxY = Math.max(maxY, fObject.GetWorldInfo().GetBoundingBox().getBottom());
					}
					else
					{
						maxY = fObject.GetWorldInfo().GetBoundingBox().getBottom();
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
				
				if (this.x > (layout.GetWidth() - (screenWidth / 2) / tempXScale))
				{
					tempXScale = (screenWidth - this.zoomMarginH) / (layout.GetWidth() - minX);
					tempX = layout.GetWidth() - (screenWidth / tempXScale) / 2;
				}
				
				// Check if the view is going over the layout bound
				if (this.y < ((screenHeight / 2) / tempYScale))
				{
					tempYScale = (screenHeight - this.zoomMarginV) / maxY;
					tempY = (screenHeight / tempYScale) / 2;
				}
				
				if (this.y > (layout.GetHeight() - (screenHeight / 2) / tempYScale))
				{
					tempYScale = (screenHeight - this.zoomMarginV) / (layout.GetHeight() - minY);
					tempY = layout.GetHeight() - (screenHeight / tempYScale) / 2;
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
{
	C3.Plugins.MagiCam = class MagiCamPlugin extends C3.SDKPluginBase
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