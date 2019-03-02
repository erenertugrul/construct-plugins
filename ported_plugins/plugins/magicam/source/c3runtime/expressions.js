"use strict";

{
	C3.Plugins.MagiCam.Exps =
	{
		MovementTransitionProgress(CameraName)
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
						return camera.transitions[i].progress;
					}
				}
			}

			// Return 0 by default
			return 0;
		},

		// ZoomTransitionProgress
		ZoomTransitionProgress(CameraName)
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
						return camera.transitions[i].progress;
						
					}
				}
			}

			// Return 0 by default
			return 0;
		},

		// GetX
		GetX(CameraName)
		{
			// Retrieve the specified camera
			var camera = this.GetCamera(CameraName);

			// Check that a camera was found
			if (null != camera)
			{
				return camera.x;
				
			}

			// Return 0 by default
			return 0;
		},

		// GetY
		GetY(CameraName)
		{
			// Retrieve the specified camera
			var camera = this.GetCamera(CameraName);

			// Check that a camera was found
			if (null != camera)
			{
				return camera.y;
				
			}

			// Return 0 by default
			return 0;
		},

		// GetZoom
		GetZoom(CameraName)
		{
			// Retrieve the specified camera
			var camera = this.GetCamera(CameraName);

			// Check that a camera was found
			if (null != camera)
			{
				return camera.scale;
				
			}

			// Return 0 by default
			return 0;
		},

		// GetActiveCamera
		GetActiveCamera(ret)
		{
			// Check that a camera was found
			if (null != this.activeCamera)
			{
				return this.activeCamera.name;
				
			}

			// Return 0 by default
			return "null";
		}
	
	};
}