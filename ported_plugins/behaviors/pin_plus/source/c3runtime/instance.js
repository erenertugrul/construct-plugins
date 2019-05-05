"use strict";

{
	C3.Behaviors.PinPlus.Instance = class PinPlusInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
				this.inst = this._inst;
				this.pinObject = null;
				this.pinObjectUid = -1;		// for loading
				this.pinAngle = 0;
				this.pinDist = 0;
				this.myStartAngle = 0;
				this.theirStartAngle = 0;
				this.lastKnownAngle = 0;
				this.mode = 0;				// 0 = position & angle; 1 = position; 2 = angle; 3 = rope; 4 = bar
				this.pinWidthRelative = 0;
				this.pinHeightRelative = 0;
				this.pinScaleRelativeX = 1;
				this.pinScaleRelativeY = 1;
				this.pinOriginalWidth = 0;
				this.pinOriginalHeight = 0;
			
			if (properties)
			{

				this.x = properties[0];
				this.y = properties[1];
				this.zIndex = properties[2];
				this.angle = properties[3];
				this.width = properties[4];
				this.height = properties[5];
				this.opacity = properties[6];
				this.visibility = properties[7];
				this.collisions = properties[8];
				this.timescale = properties[9];
				this.hotspotX = properties[10];
				this.hotspotY = properties[11];
				this.pinImagepoint = properties[12];
				this.pinAnimation = properties[13];
				this.pinFrame = properties[14];
				this.pinMirror = properties[15];
				this.pinFlip = properties[16];
				//this.pinMirrorAngle = properties[17];
				//this.pinFlipAngle = properties[18];
				this.pinDestroy = properties[17];
				

			}
				this.pinned = false;
				this.scaleCoordX = false;
				this.scaleCoordY = false;
				this.mirrorPosition = false;
				this.flipPosition = false;
				this.isMirrored = false;
				this.isFlipped = false;
				
				var self = this;
			// Opt-in to getting calls to Tick()
			const b = this._runtime.Dispatcher();
        	this._disposables = new C3.CompositeDisposable(C3.Disposable.From(b, "instancedestroy", (a) => this._OnInstanceDestroyed(a.instance)), C3.Disposable.From(b, "afterload", () => this._OnAfterLoad()))
   
			this._StartTicking();
			this._StartTicking2();
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"uid": this.pinObject ? this.pinObject.GetUID() : -1,
				"pa": this.pinAngle,
				"pd": this.pinDist,
				"msa": this.myStartAngle,
				"tsa": this.theirStartAngle,
				"lka": this.lastKnownAngle,
				"m": this.mode
			};
		}

		LoadFromJson(o)
		{
			this.pinObjectUid = o["uid"];		// wait until afterLoad to look up		
			this.pinAngle = o["pa"];
			this.pinDist = o["pd"];
			this.myStartAngle = o["msa"];
			this.theirStartAngle = o["tsa"];
			this.lastKnownAngle = o["lka"];
			this.mode = o["m"];
		}
	    _OnAfterLoad() 
	    {
			if (this.pinObjectUid === -1)
				this.pinObject = null;
			else
			{
				this.pinObject = this._runtime.GetInstanceByUID(this.pinObjectUid);
			}
			
			this.pinObjectUid = -1;
    	}
    	_OnInstanceDestroyed(a) 
    	{
			if (this.pinObject == a)
				this.pinObject = null;
    	}
		
		Tick()
		{
			if (this.pinDestroy !==0 && this.pinned && this.pinObject==null)
			{
				this.pinned = false;
				this._runtime.DestroyInstance(this._inst);
				/*if (this.pinObject == inst)
					this.pinObject = null;*/
			}
			
		}
		
		Tick2()
		{

			if (!this.pinObject)
				return;
				
			if (this.lastKnownAngle !== this.inst.GetWorldInfo().GetAngle())
				this.myStartAngle = C3.clampAngle(this.myStartAngle + (this.inst.GetWorldInfo().GetAngle() - this.lastKnownAngle));
				
			var newx = this.inst.GetWorldInfo().GetX();
			var newy = this.inst.GetWorldInfo().GetY();
			var objx = this.pinImagepoint===0?this.pinObject.GetWorldInfo().GetX():this.pinObject.GetImagePoint(this.pinImagepoint, true)[0];
			var objy = this.pinImagepoint===0?this.pinObject.GetWorldInfo().GetY():this.pinObject.GetImagePoint(this.pinImagepoint, false)[1];

			if (this.mode === 3 || this.mode === 4)		// rope mode or bar mode
			{
				var dist = C3.distanceTo(this.inst.GetWorldInfo().GetX(), this.inst.GetWorldInfo().GetY(), objx, objy);
				
				if ((dist > this.pinDist) || (this.mode === 4 && dist < this.pinDist))
				{
					var a = C3.angleTo(objx, objy, this.inst.GetWorldInfo().GetX(), this.inst.GetWorldInfo().GetY());
					newx = objx + Math.cos(a) * this.pinDist;
					newy = objy + Math.sin(a) * this.pinDist;
				}
			}
			else
			{
				this.scaleCoordX = false;
				this.scaleCoordY = false;
				this.mirrorPosition = false;
				this.flipPosition = false;
				
				this.isMirrored = (this.pinOriginalWidth/Math.abs(this.pinOriginalWidth) !== this.pinObject.GetWorldInfo().GetWidth()/Math.abs(this.pinObject.GetWorldInfo().GetWidth()));
				this.isFlipped = (this.pinOriginalHeight/Math.abs(this.pinOriginalHeight) !== this.pinObject.GetWorldInfo().GetHeight()/Math.abs(this.pinObject.GetWorldInfo().GetHeight()));
					
				if(this.x===3)this.scaleCoordX = true;
				if(this.y===3)this.scaleCoordY = true;
				if(this.pinMirror >=3 && this.x===1 && this.isMirrored)this.mirrorPosition = true;
				if(this.pinFlip >=3 && this.y===1 && this.isFlipped)this.flipPosition = true;
				
				var a=0,pa=this.pinAngle,scaleX=1,scaleY=1;
				
				if(this.scaleCoordX)scaleX = Math.abs(this.pinObject.GetWorldInfo().GetWidth()/this.pinOriginalWidth);
				if(this.scaleCoordY)scaleY = Math.abs(this.pinObject.GetWorldInfo().GetHeight()/this.pinOriginalHeight);
				if((this.mirrorPosition && this.flipPosition) || (this.scaleCoordX && this.isMirrored && this.scaleCoordY && this.isFlipped)){
					pa = this.pinAngle + C3.toRadians(180);
				}else if(this.mirrorPosition || (this.scaleCoordX && this.isMirrored)){
					pa = this.pinAngle;
					a = C3.angleDiff(pa, C3.toRadians(90));
					if(pa<C3.toRadians(270) && pa>C3.toRadians(90))pa -= a*2;
					else pa += a*2;
				}else if(this.flipPosition || (this.scaleCoordY && this.isFlipped)){
					pa = this.pinAngle;
					a = C3.angleDiff(pa, 0);
					if(pa<C3.toRadians(180) && pa>0)pa -= a*2;
					else pa += a*2;
				}
				newx = objx + Math.cos(this.pinObject.GetWorldInfo().GetAngle() + pa) * this.pinDist * scaleX;
				newy = objy + Math.sin(this.pinObject.GetWorldInfo().GetAngle() + pa) * this.pinDist * scaleY;
					
				if(this.x===2)newx = objx;
				if(this.y===2)newy = objy;
			}

			var newangle = C3.clampAngle(this.myStartAngle + (this.pinObject.GetWorldInfo().GetAngle() - this.theirStartAngle));
			this.lastKnownAngle = newangle;

			if ((this.mode === 0 || this.mode === 1 || this.mode === 3 || this.mode === 4)
				&& ((this.x!==0&&this.inst.GetWorldInfo().GetX() !== newx) || (this.y!==0&&this.inst.GetWorldInfo().GetY() !== newy)))
			{
				if(this.x!==0)this.inst.GetWorldInfo().SetX(newx);
				if(this.y!==0)this.inst.GetWorldInfo().SetY(newy);
				this.inst.GetWorldInfo().SetBboxChanged();
			}

			if ((this.mode === 0 || this.mode === 2 || this.angle!==0) && (this.inst.GetWorldInfo().GetAngle() !== newangle) && this.angle!==0)
			{
				if(this.angle===2)this.inst.GetWorldInfo().SetAngle(this.pinObject.GetWorldInfo().GetAngle());
				else this.inst.GetWorldInfo().SetAngle(newangle);
				this.inst.GetWorldInfo().SetBboxChanged();
			}

			if (this.zIndex !== 0 && (Math.abs(this.pinObject.GetWorldInfo().GetZIndex()-this.inst.GetWorldInfo().GetZIndex())>1 || this.pinObject.GetWorldInfo().GetLayer().GetIndex() !== this.inst.GetWorldInfo().GetLayer().GetIndex() ))
			{
				
				var sol = this.pinObject.GetObjectClass().GetCurrentSol();
				
				//save current
				var old_instances = sol.GetInstances();
				var old_select_all = sol._selectAll;

				// set new
				sol._instances = [this.pinObject];
				sol._selectAll = false;

				//C3.Plugins.Sprite.Acts.SetZElevation.call(this.inst,this.zIndex-1,this.pinObject.GetObjectClass())
				this.inst.GetObjectClass().GetPlugin().constructor.Acts.ZMoveToObject.call(this.inst.GetWorldInfo(),this.zIndex-1,this.pinObject.GetObjectClass());
				//restore old
				sol._instances = old_instances;
				sol._selectAll = old_select_all;
					
			}
			if (this.width !== 0 )
			{
				var newWidth = this.pinObject.GetWorldInfo().GetWidth();
				
				switch(this.width){
					case 1:
						if(newWidth !== this.inst.GetWorldInfo().GetWidth()){
							this.inst.GetWorldInfo().SetWidth(newWidth);
							this.inst.GetWorldInfo().SetBboxChanged();
						}
						break;
					case 2:
						newWidth = this.pinObject.GetWorldInfo().GetWidth()+this.pinWidthRelative;
						if(newWidth !== this.inst.GetWorldInfo().GetWidth()){
							this.inst.GetWorldInfo().SetWidth(newWidth);
							this.inst.GetWorldInfo().SetBboxChanged();
						}
						break;
					case 3:
						newWidth = this.inst.GetSdkInstance()._currentAnimationFrame.GetImageInfo().GetWidth()*(this.pinObject.GetWorldInfo().GetWidth()/this.pinObject.GetSdkInstance()._currentAnimationFrame.GetImageInfo().GetWidth());
						if(newWidth !== this.inst.GetWorldInfo().GetWidth()){
							this.inst.GetWorldInfo().SetWidth(newWidth);
							this.inst.GetWorldInfo().SetBboxChanged();
						}
						break;
					case 4:
						newWidth = this.pinObject.GetWorldInfo().GetWidth()*this.pinScaleRelativeX;
						if(newWidth !== this.inst.GetWorldInfo().GetWidth()){
							this.inst.GetWorldInfo().SetWidth(newWidth);
							this.inst.GetWorldInfo().SetBboxChanged();
						}
						break;
					default:
						break;
				}
					
			}
			if (this.height !== 0 )
			{
				var newHeight = this.pinObject.GetWorldInfo().GetHeight();
				
				switch(this.height){
					case 1:
						if(newHeight !== this.inst.GetWorldInfo().GetHeight()){
							this.inst.GetWorldInfo().SetHeight(newHeight);
							this.inst.GetWorldInfo().SetBboxChanged();
						}
						break;
					case 2:
						newHeight = this.pinObject.GetWorldInfo().GetHeight()+this.pinHeightRelative;
						if(newHeight !== this.inst.GetWorldInfo().GetHeight()){
							this.inst.GetWorldInfo().SetHeight(newHeight);
							this.inst.GetWorldInfo().SetBboxChanged();
						}
						break;
					case 3:
						newHeight = this.inst.GetSdkInstance()._currentAnimationFrame.GetImageInfo().GetHeight()*(this.pinObject.GetWorldInfo().GetHeight()/this.pinObject.GetSdkInstance()._currentAnimationFrame.GetImageInfo().GetHeight());
						if(newHeight !== this.inst.GetWorldInfo().GetHeight()){
							this.inst.GetWorldInfo().SetHeight(newHeight);
							this.inst.GetWorldInfo().SetBboxChanged();
						}
						break;
					case 4:
						newHeight = this.pinObject.GetWorldInfo().GetHeight()*this.pinScaleRelativeY;
						if(newHeight !== this.inst.GetWorldInfo().GetHeight()){
							this.inst.GetWorldInfo().SetHeight(newHeight);
							this.inst.GetWorldInfo().SetBboxChanged();
						}
						break;
					default:
						break;
				}
			}
			if (this.opacity === 1 && this.pinObject.GetWorldInfo().GetOpacity() !== this.inst.GetWorldInfo().GetOpacity())
			{
				this.inst.GetWorldInfo().SetOpacity(this.pinObject.GetWorldInfo().GetOpacity());				
				this._runtime.UpdateRender();
			}
			if (this.visibility === 1 && this.pinObject.GetWorldInfo().IsVisible() !== this.inst.GetWorldInfo().IsVisible())
			{
				this.inst.GetWorldInfo().SetVisible(this.pinObject.GetWorldInfo().IsVisible());				
				this._runtime.UpdateRender();
			}
			if (this.collisions === 1 && this.pinObject.GetWorldInfo().IsCollisionEnabled() !== this.inst.GetWorldInfo().IsCollisionEnabled())
			{
				this.inst.GetWorldInfo().SetCollisionEnabled(this.pinObject.GetWorldInfo().IsCollisionEnabled());
				//this.inst.type.plugin.__proto__.acts.SetCollisions.call(this.inst.collisionsEnabled==true?1:0);
				//for some reason there is error if setCollisions is called, so I'll just copy it for now:
				if (this.inst.GetWorldInfo().IsCollisionEnabled())
					this.inst.GetWorldInfo().SetBboxChanged();		// needs to be added back to cells
				else
				{
					// remove from any current cells and restore to uninitialised state
					if (this.inst.GetWorldInfo().GetCollisionCellRange().getRight() >= this.inst.GetWorldInfo().GetCollisionCellRange().getLeft())
						this.inst.GetObjectClass()._GetCollisionCellGrid().Update(this.inst, this.inst.GetWorldInfo().GetCollisionCellRange(), null); //dikkat
					
					this.inst.GetWorldInfo().GetCollisionCellRange().set(0, 0, -1, -1);
				}
			}
			if (this.timescale === 1 && this.pinObject.GetTimeScale() !== this.inst.GetTimeScale())
			{
				this.inst.SetTimeScale(this.pinObject.GetTimeScale());
			}
			if (this.hotspotX === 1 && this.pinObject.GetWorldInfo().GetOriginX() !== this.inst.GetWorldInfo().GetOriginX())
			{
				this.inst.GetWorldInfo().SetOriginX(this.pinObject.GetWorldInfo().GetOriginX());
				this.inst.GetWorldInfo().SetBboxChanged();
			}
			if (this.hotspotY === 1 && this.pinObject.GetWorldInfo().GetOriginY() !== this.inst.GetWorldInfo().GetOriginY())
			{
				this.inst.GetWorldInfo().SetOriginY(this.pinObject.GetWorldInfo().GetOriginY());
				this.inst.GetWorldInfo().SetBboxChanged();
			}
			if (this.pinAnimation !== 0 && this.pinObject.GetSdkInstance()._currentAnimation.GetName() !== this.inst.GetSdkInstance()._currentAnimation.GetName() )
			{
				this.inst.GetSdkInstance()._changeAnimationName = this.pinObject.GetSdkInstance()._currentAnimation.GetName();
				this.inst.GetSdkInstance()._changeAnimationFrom = this.pinAnimation-1;
				
				// start ticking if not already
				if (!this.inst.GetSdkInstance().IsTicking())
				{
					//this.inst.runtime.tickMe(this.inst); //buna bak
					this.inst.GetSdkInstance()._isTicking = true;
				}
				
				// not in trigger: apply immediately
				if (!this.inst.GetSdkInstance()._isInAnimTrigger)
					this.inst.GetSdkInstance()._DoChangeAnimation();

			}
			if (this.pinFrame === 1 && this.pinObject.GetSdkInstance()._currentFrameIndex !== this.inst.GetSdkInstance()._currentFrameIndex )
			{
				this.inst.GetSdkInstance()._changeAnimFrameIndex = this.pinObject.GetSdkInstance()._currentFrameIndex;
				// start ticking if not already
				
				if (!this.inst.GetSdkInstance().IsTicking())
				{
					//this.inst.runtime.tickMe(this.inst); //buna bak
					this.inst.GetSdkInstance()._isTicking = true;
				}
				
				// not in trigger: apply immediately
				if (!this.inst.GetSdkInstance()._isInAnimTrigger)
					this.inst.GetSdkInstance()._DoChangeAnimFrame();
			}
			var mirrorSwitch = false;
			if (this.pinMirror !== 0 )
			{
				if(this.pinObject.GetWorldInfo().GetWidth() != 0){
					var childMirror = (this.inst.GetWorldInfo().GetWidth()/Math.abs(this.inst.GetWorldInfo().GetWidth()));
					var parentMirror = (this.pinObject.GetWorldInfo().GetWidth()/Math.abs(this.pinObject.GetWorldInfo().GetWidth()));
					switch(this.pinMirror){
						case 1:
						case 3:
							if(parentMirror !== childMirror){
								this.inst.GetWorldInfo().SetWidth(Math.abs(this.inst.GetWorldInfo().GetWidth())*parentMirror);
								this.inst.GetWorldInfo().SetBboxChanged();
								mirrorSwitch=true;
							}
							break;
						case 2:
						case 4:
							if(parentMirror !== this.parentMirror){
								this.inst.GetWorldInfo().SetWidth(this.childMirror>0?-this.inst.GetWorldInfo().GetWidth():Math.abs(this.inst.GetWorldInfo().GetWidth()));
								this.childMirror *= -1;
								this.parentMirror *= -1;
								this.inst.GetWorldInfo().SetBboxChanged();
								mirrorSwitch=true;
							}
							break;
						default:
							break;
					}
				}
			}
			var flipSwitch = false;
			if (this.pinFlip !== 0 )
			{
				if(this.pinObject.GetWorldInfo().GetHeight() != 0){
					var childFlip = (this.inst.GetWorldInfo().GetHeight()/Math.abs(this.inst.GetWorldInfo().GetHeight()));
					var parentFlip = (this.pinObject.GetWorldInfo().GetHeight()/Math.abs(this.pinObject.GetWorldInfo().GetHeight()));
					switch(this.pinFlip){
						case 1:
						case 3:
							if(parentFlip !== childFlip){
								this.inst.GetWorldInfo().SetHeight(Math.abs(this.inst.GetWorldInfo().GetHeight())*parentFlip);
								this.inst.GetWorldInfo().SetBboxChanged();
								flipSwitch=true;
							}
							break;
						case 2:
						case 4:
							if(parentFlip !== this.parentFlip){
								this.inst.GetWorldInfo().SetHeight(this.childFlip>0?-this.inst.GetWorldInfo().GetHeight():Math.abs(this.inst.GetWorldInfo().GetHeight()));
								this.childFlip *= -1;
								this.parentFlip *= -1;
								this.inst.GetWorldInfo().SetBboxChanged();
								flipSwitch=true;
							}
							break;
						default:
							break;
					}
				}
			}	
		}
	};
}