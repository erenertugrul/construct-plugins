"use strict";

{
	C3.Plugins.MagiCam.Acts =
	{
		FollowObject(CameraName, FollowedObject, ObjectWeight, ImagePoint)
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
				var followedObject = FollowedObject.GetFirstPicked();
				// Check to ensure that if the camera is global and the object isn't that the object isn't followed
				if (camera.global && !FollowedObject.global) // todo fix it
				{
					alert("MagiCam:\n\nObject not global - global cameras must follow global objects.");
					return;
				}
				
				// Follow the specified object
				camera.followedObjects.push(followedObject);
				camera.objectWeights.push(ObjectWeight);
				camera.followedObjectIPs.push(ImagePoint);
			}
		},
		
		SetFollowLag(CameraName, FollowLag)
		{
			// Retrieve the specified camera
			var camera = this.GetCamera(CameraName);
			
			// Check that a camera was found
			if (camera != null)
			{
				// Set the follow lag for this object
				camera.followLag = 1 - FollowLag / 100;
			}
		},
		
		ZoomToContain(CameraName, Zoom, ZoomMarginH, ZoomMarginV, ZoomBoundU, ZoomBoundL)
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
		},
		
		EnableFollowing(CameraName, Following)
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
		},

		// FollowObject
		UnfollowObject(CameraName, FollowedObject)
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
				var followedObject = FollowedObject.GetFirstPicked();
				
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
		},
		
		// CreateLocalCamera
		CreateLocalCamera(cameraName, cameraX, cameraY, cameraScale, Active)
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
				this._runtime.GetMainRunningLayout().SetScale(this.activeCamera.scale);
			}
			else{
				var x  = this.localCameras[this.localCameras.length - 1];
			}
		},
		
		// CreateGlobalCamera
		CreateGlobalCamera(cameraName, cameraX, cameraY, cameraScale, Active)
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
				this._runtime.GetMainRunningLayout().SetScrollX(this.activeCamera.GetX());
				this._runtime.GetMainRunningLayout().SetScrollY(this.activeCamera.GetY());
				this._runtime.GetMainRunningLayout().SetScale(this.activeCamera.scale);
			}
		},
		
		// SetActiveCamera
		SetActiveCamera(CameraName)
		{
			// Retrieve the specified camera
			var camera = this.GetCamera(CameraName);
			
			// Check that a camera was found
			if (camera != null)
			{
				// Set the new active camera
				this.activeCamera = camera;
				
				// Setup the layout to match
				this._runtime.GetMainRunningLayout().SetScrollX(camera.GetX());
				this._runtime.GetMainRunningLayout().SetScrollY(camera.GetY());
				this._runtime.GetMainRunningLayout().SetScale(camera.scale);
			}
		},
		
		// SetXPosition
		SetScrollSmoothing(CameraName)
		{
		},
		
		// SetXPosition
		SetXPosition(CameraName, X)
		{
			// Retrieve the specified camera
			var camera = this.GetCamera(CameraName);
			
			// Check that a camera was found
			if (camera != null)
			{
				// Set the camera position
				camera.SetX(X);
			}
		},
		
		// SetYPosition
		SetYPosition(CameraName, Y)
		{
			// Retrieve the specified camera
			var camera = this.GetCamera(CameraName);
			
			// Check that a camera was found
			if (camera != null)
			{
				// Set the camera position
				camera.SetY(Y);
			}
		},
		
		// SetPosition
		SetPosition(CameraName, X, Y)
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
		},
		
		// SetZoom
		SetZoom(CameraName, Zoom)
		{
			// Retrieve the specified camera
			var camera = this.GetCamera(CameraName);
			
			// Check that a camera was found
			if (camera != null)
			{
				// Set the camera position
				camera.scale = Zoom;
			}
		},
		
		// TransitionToPoint
		TransitionToPoint(CameraName, X, Y, Duration)
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
		},
		
		// TransitionToZoom
		TransitionToZoom(CameraName, Zoom, Duration)
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
		},

		// TransitionToCamera
		TransitionToCamera(CameraName, Duration)
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
		},

		// ShakeCamera
		ShakeCamera(CameraName, Strength, MaxDeviation, MaxZoomDeviation, BuildLength, DropTime, Duration)
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
		}
	
	};
}