"use strict";
{
	C3.Plugins.MagiCam.Instance = class MagiCamInstance extends C3.SDKWorldInstanceBase //SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			const b = this._runtime.Dispatcher();
			this._disposables = new C3.CompositeDisposable(C3.Disposable.From(b, "layoutchange", () => this._OnLayoutChange()), C3.Disposable.From(b, "afterload", () => this._OnAfterLoad()))
			// Initialise object properties
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
			//this._runtime.tickMe(this);
			if (properties)		// note properties may be null in some cases
			{
				
			}
			this._inst.GetTimeScale();
			this._StartTicking();
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
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
					o["lc" + i + "fo" + f] = this.localCameras[i].followedObjects[f].GetUID();
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
					o["gc" + i + "fo" + f] = this.globalCameras[i].followedObjects[f].GetUID();
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

		LoadFromJson(o)
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
		}
        _OnLayoutChange() {
        			// Get rid of the old local cameras
			for (var i = 0; i < this.localCameraCountOld; i++)
			{
				this.localCameras.shift();
			}
			
			this.localCameraCount -= this.localCameraCountOld;
        }
        _OnAfterLoad() {
			for (var i = 0; i < this.localCameras.length; i++)
			{
				for (var o = 0; o < this.localCameras[i].followedObjectUIDs.length; o++)
				{
					this.localCameras[i].followedObjects.push(this._runtime.GetInstanceByUID(this.localCameras[i].followedObjectUIDs[o]));
				}
			}

			for (var i = 0; i < this.globalCameras.length; i++)
			{
				for (var o = 0; o < this.globalCameras[i].followedObjectUIDs.length; o++)
				{
					this.globalCameras[i].followedObjects.push(this._runtime.GetInstanceByUID(this.globalCameras[i].followedObjectUIDs[o]));
				}
			}
    	}
		GetCamera(Name)
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
		}

		Tick()
		{
			// Update the old camera count
			this.localCameraCountOld = this.localCameraCount;
			//var dt = this.runtime.getDt(this);
			var dt = this._runtime.GetDt(this._inst);
			if (dt == 0)
			{
				dt = 0.1;
			}
			
			// Update all of the global cameras
			for (var i = 0; i < this.globalCameras.length; i++)
			{
				this.globalCameras[i].ProcessTransitions(dt);
				this.globalCameras[i].ProcessFollowing(dt, this._runtime.GetOriginalViewportWidth(), this._runtime.GetOriginalViewportHeight(), this._runtime.GetMainRunningLayout());
				this.globalCameras[i].ShakeCamera(dt);
			}
			
			// Update all of the local cameras
			for (var i = 0; i < this.localCameras.length; i++)
			{
				this.localCameras[i].ProcessTransitions(dt);
				this.localCameras[i].ProcessFollowing(dt, this._runtime.GetOriginalViewportWidth(), this._runtime.GetOriginalViewportHeight(), this._runtime.GetMainRunningLayout());
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
				this._runtime.GetMainRunningLayout().SetScrollX(this.activeCamera.GetX() + this.activeCamera.GetShakeX());
				this._runtime.GetMainRunningLayout().SetScrollY(this.activeCamera.GetY() + this.activeCamera.GetShakeY());
				// Set the scale
				this._runtime.GetMainRunningLayout().SetScale(this.activeCamera.scale + this.activeCamera.shakeZoom);
				
				// Have the layout redrawn
				this.GetRuntime().UpdateRender();
			}
		}
	};
}