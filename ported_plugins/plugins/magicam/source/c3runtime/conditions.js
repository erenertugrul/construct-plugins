"use strict";

{
	C3.Plugins.MagiCam.Cnds =
	{
		TransitionFinished(CameraName, Transition)
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
		},
		TransitionIsInProgress(CameraName, Transition)
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
		}
	};
}