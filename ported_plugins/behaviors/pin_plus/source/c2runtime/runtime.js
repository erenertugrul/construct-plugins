// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.PinPlus = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.PinPlus.prototype;
		
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
		this.x = this.properties[0];
		this.y = this.properties[1];
		this.zIndex = this.properties[2];
		this.angle = this.properties[3];
		this.width = this.properties[4];
		this.height = this.properties[5];
		this.opacity = this.properties[6];
		this.visibility = this.properties[7];
		this.collisions = this.properties[8];
		this.timescale = this.properties[9];
		this.hotspotX = this.properties[10];
		this.hotspotY = this.properties[11];
		this.pinImagepoint = this.properties[12];
		this.pinAnimation = this.properties[13];
		this.pinFrame = this.properties[14];
		this.pinMirror = this.properties[15];
		this.pinFlip = this.properties[16];
		//this.pinMirrorAngle = this.properties[17];
		//this.pinFlipAngle = this.properties[18];
		this.pinDestroy = this.properties[17];
		
		this.pinned = false;
		
		this.scaleCoordX = false;
		this.scaleCoordY = false;
		this.mirrorPosition = false;
		this.flipPosition = false;
		this.isMirrored = false;
		this.isFlipped = false;
		
		var self = this;
		
		// Need to know if pinned object gets destroyed
		if (!this.recycled)
		{
			this.myDestroyCallback = (function(inst) {
													self.onInstanceDestroyed(inst);
												});
		}
										
		this.runtime.addDestroyCallback(this.myDestroyCallback);
	};
	
	behinstProto.saveToJSON = function ()
	{
		return {
			"uid": this.pinObject ? this.pinObject.uid : -1,
			"pa": this.pinAngle,
			"pd": this.pinDist,
			"msa": this.myStartAngle,
			"tsa": this.theirStartAngle,
			"lka": this.lastKnownAngle,
			"m": this.mode
		};
	};
	
	behinstProto.loadFromJSON = function (o)
	{
		this.pinObjectUid = o["uid"];		// wait until afterLoad to look up		
		this.pinAngle = o["pa"];
		this.pinDist = o["pd"];
		this.myStartAngle = o["msa"];
		this.theirStartAngle = o["tsa"];
		this.lastKnownAngle = o["lka"];
		this.mode = o["m"];
	};
	
	behinstProto.afterLoad = function ()
	{
		// Look up the pinned object UID now getObjectByUID is available
		if (this.pinObjectUid === -1)
			this.pinObject = null;
		else
		{
			this.pinObject = this.runtime.getObjectByUID(this.pinObjectUid);
			assert2(this.pinObject, "Failed to find pin object by UID");
		}
		
		this.pinObjectUid = -1;
	};
	
	behinstProto.onInstanceDestroyed = function (inst)
	{
		// Pinned object being destroyed
		if (this.pinObject == inst)
			this.pinObject = null;
	};
	
	behinstProto.onDestroy = function()
	{
		this.pinObject = null;
		this.runtime.removeDestroyCallback(this.myDestroyCallback);
	};
	
	behinstProto.tick = function ()
	{
		
		if (this.pinDestroy !==0 && this.pinned && this.pinObject==null)
		{
			this.pinned = false;
			this.runtime.DestroyInstance(this.inst);
		}
		
		// do work in tick2 instead, after events to get latest object position
	};

	behinstProto.tick2 = function ()
	{
		if (!this.pinObject)
			return;
			
		// Instance angle has changed by events/something else
		if (this.lastKnownAngle !== this.inst.angle)
			this.myStartAngle = cr.clamp_angle(this.myStartAngle + (this.inst.angle - this.lastKnownAngle));
			
		var newx = this.inst.x;
		var newy = this.inst.y;
		var objx = this.pinImagepoint===0?this.pinObject.x:this.pinObject.getImagePoint(this.pinImagepoint, true);
		var objy = this.pinImagepoint===0?this.pinObject.y:this.pinObject.getImagePoint(this.pinImagepoint, false);
		
		if (this.mode === 3 || this.mode === 4)		// rope mode or bar mode
		{
			var dist = cr.distanceTo(this.inst.x, this.inst.y, objx, objy);
			
			if ((dist > this.pinDist) || (this.mode === 4 && dist < this.pinDist))
			{
				var a = cr.angleTo(objx, objy, this.inst.x, this.inst.y);
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
			
			this.isMirrored = (this.pinOriginalWidth/Math.abs(this.pinOriginalWidth) !== this.pinObject.width/Math.abs(this.pinObject.width));
			this.isFlipped = (this.pinOriginalHeight/Math.abs(this.pinOriginalHeight) !== this.pinObject.height/Math.abs(this.pinObject.height));
				
			if(this.x===3)this.scaleCoordX = true;
			if(this.y===3)this.scaleCoordY = true;
			if(this.pinMirror >=3 && this.x===1 && this.isMirrored)this.mirrorPosition = true;
			if(this.pinFlip >=3 && this.y===1 && this.isFlipped)this.flipPosition = true;
			
			var a=0,pa=this.pinAngle,scaleX=1,scaleY=1;
			
			if(this.scaleCoordX)scaleX = Math.abs(this.pinObject.width/this.pinOriginalWidth);
			if(this.scaleCoordY)scaleY = Math.abs(this.pinObject.height/this.pinOriginalHeight);
			if((this.mirrorPosition && this.flipPosition) || (this.scaleCoordX && this.isMirrored && this.scaleCoordY && this.isFlipped)){
				pa = this.pinAngle + cr.to_radians(180);
			}else if(this.mirrorPosition || (this.scaleCoordX && this.isMirrored)){
				pa = this.pinAngle;
				a = cr.angleDiff(pa, cr.to_radians(90));
				if(pa<cr.to_radians(270) && pa>cr.to_radians(90))pa -= a*2;
				else pa += a*2;
			}else if(this.flipPosition || (this.scaleCoordY && this.isFlipped)){
				pa = this.pinAngle;
				a = cr.angleDiff(pa, 0);
				if(pa<cr.to_radians(180) && pa>0)pa -= a*2;
				else pa += a*2;
			}
			newx = objx + Math.cos(this.pinObject.angle + pa) * this.pinDist * scaleX;
			newy = objy + Math.sin(this.pinObject.angle + pa) * this.pinDist * scaleY;
				
			if(this.x===2)newx = objx;
			if(this.y===2)newy = objy;
		}
		
		var newangle = cr.clamp_angle(this.myStartAngle + (this.pinObject.angle - this.theirStartAngle));
		this.lastKnownAngle = newangle;
		
		if ((this.mode === 0 || this.mode === 1 || this.mode === 3 || this.mode === 4)
			&& ((this.x!==0&&this.inst.x !== newx) || (this.y!==0&&this.inst.y !== newy)))
		{
			if(this.x!==0)this.inst.x = newx;
			if(this.y!==0)this.inst.y = newy;
			this.inst.set_bbox_changed();
		}
		
		if ((this.mode === 0 || this.mode === 2 || this.angle!==0) && (this.inst.angle !== newangle) && this.angle!==0)
		{
			if(this.angle===2)this.inst.angle = this.pinObject.angle;
			else this.inst.angle = newangle;
			this.inst.set_bbox_changed();
		}
		
		if (this.zIndex !== 0 && (Math.abs(this.pinObject.zindex-this.inst.zindex)>1 || this.pinObject.layer.index !== this.inst.layer.index ))
		{
			//console.log(this.inst.zindex+","+this.pinObject.zindex+","+this.inst.layer.index+","+this.pinObject.layer.index);
			
			var sol = this.pinObject.type.getCurrentSol();
			
			//save current
			var old_instances = sol.instances;
			var old_select_all = sol.select_all;

			// set new
			sol.instances = [this.pinObject];
			sol.select_all = false;

			// call action here
			this.inst.type.plugin.__proto__.acts.ZMoveToObject.call(this.inst,this.zIndex-1,this.pinObject.type);
			
			//restore old
			sol.instances = old_instances;
			sol.select_all = old_select_all;
				
		}
		if (this.width !== 0 )
		{
			var newWidth = this.pinObject.width;
			
			switch(this.width){
				case 1:
					if(newWidth !== this.inst.width){
						this.inst.width = newWidth;
						this.inst.set_bbox_changed();
					}
					break;
				case 2:
					newWidth = this.pinObject.width+this.pinWidthRelative;
					if(newWidth !== this.inst.width){
						this.inst.width = newWidth;
						this.inst.set_bbox_changed();
					}
					break;
				case 3:
					newWidth = this.inst.curFrame.width*(this.pinObject.width/this.pinObject.curFrame.width);
					if(newWidth !== this.inst.width){
						this.inst.width = newWidth;
						this.inst.set_bbox_changed();
					}
					break;
				case 4:
					newWidth = this.pinObject.width*this.pinScaleRelativeX;
					if(newWidth !== this.inst.width){
						this.inst.width = newWidth;
						this.inst.set_bbox_changed();
					}
					break;
				default:
					break;
			}
				
		}
		if (this.height !== 0 )
		{
			var newHeight = this.pinObject.height;
			
			switch(this.height){
				case 1:
					if(newHeight !== this.inst.height){
						this.inst.height = newHeight;
						this.inst.set_bbox_changed();
					}
					break;
				case 2:
					newHeight = this.pinObject.height+this.pinHeightRelative;
					if(newHeight !== this.inst.height){
						this.inst.height = newHeight;
						this.inst.set_bbox_changed();
					}
					break;
				case 3:
					newHeight = this.inst.curFrame.height*(this.pinObject.height/this.pinObject.curFrame.height);
					if(newHeight !== this.inst.height){
						this.inst.height = newHeight;
						this.inst.set_bbox_changed();
					}
					break;
				case 4:
					newHeight = this.pinObject.height*this.pinScaleRelativeY;
					if(newHeight !== this.inst.height){
						this.inst.height = newHeight;
						this.inst.set_bbox_changed();
					}
					break;
				default:
					break;
			}
		}
		if (this.opacity === 1 && this.pinObject.opacity !== this.inst.opacity)
		{
			this.inst.opacity = this.pinObject.opacity;				
			this.runtime.redraw = true;
		}
		if (this.visibility === 1 && this.pinObject.visible !== this.inst.visible)
		{
			this.inst.visible = this.pinObject.visible;				
			this.runtime.redraw = true;
		}
		if (this.collisions === 1 && this.pinObject.collisionsEnabled !== this.inst.collisionsEnabled)
		{
			this.inst.collisionsEnabled = this.pinObject.collisionsEnabled;
			//this.inst.type.plugin.__proto__.acts.SetCollisions.call(this.inst.collisionsEnabled==true?1:0);
			//for some reason there is error if setCollisions is called, so I'll just copy it for now:
			if (this.inst.collisionsEnabled)
				this.inst.set_bbox_changed();		// needs to be added back to cells
			else
			{
				// remove from any current cells and restore to uninitialised state
				if (this.inst.collcells.right >= this.inst.collcells.left)
					this.inst.type.collision_grid.update(this.inst, this.inst.collcells, null);
				
				this.inst.collcells.set(0, 0, -1, -1);
			}
		}
		if (this.timescale === 1 && this.pinObject.my_timescale !== this.inst.my_timescale)
		{
			this.inst.my_timescale = this.pinObject.my_timescale;
		}
		if (this.hotspotX === 1 && this.pinObject.hotspotX !== this.inst.hotspotX)
		{
			this.inst.hotspotX = this.pinObject.hotspotX;
			this.inst.set_bbox_changed();
		}
		if (this.hotspotY === 1 && this.pinObject.hotspotY !== this.inst.hotspotY)
		{
			this.inst.hotspotY = this.pinObject.hotspotY;
			this.inst.set_bbox_changed();
		}
		if (this.pinAnimation !== 0 && this.pinObject.cur_animation.name !== this.inst.cur_animation.name )
		{
			//this.inst.type.plugin.__proto__.acts.prototype.SetAnim(this.pinObject.cur_animation.name,1);
			//this.inst.set_bbox_changed();
			this.inst.changeAnimName = this.pinObject.cur_animation.name;
			this.inst.changeAnimFrom = this.pinAnimation-1;
			
			// start ticking if not already
			if (!this.inst.isTicking)
			{
				this.inst.runtime.tickMe(this.inst);
				this.inst.isTicking = true;
			}
			
			// not in trigger: apply immediately
			if (!this.inst.inAnimTrigger)
				this.inst.doChangeAnim();
		
		}
		if (this.pinFrame === 1 && this.pinObject.cur_frame !== this.inst.cur_frame )
		{
			//this.inst.type.plugin.__proto__.acts.prototype.SetAnimFrame(this.pinObject.cur_frame);
			//this.inst.set_bbox_changed();
			this.inst.changeAnimFrame = this.pinObject.cur_frame;
			// start ticking if not already
			if (!this.inst.isTicking)
			{
				this.inst.runtime.tickMe(this.inst);
				this.inst.isTicking = true;
			}
			
			// not in trigger: apply immediately
			if (!this.inst.inAnimTrigger)
				this.inst.doChangeAnimFrame();
		}
		var mirrorSwitch = false;
		if (this.pinMirror !== 0 )
		{
			if(this.pinObject.width != 0){
				var childMirror = (this.inst.width/Math.abs(this.inst.width));
				var parentMirror = (this.pinObject.width/Math.abs(this.pinObject.width));
				switch(this.pinMirror){
					case 1:
					case 3:
						if(parentMirror !== childMirror){
							this.inst.width = Math.abs(this.inst.width)*parentMirror;
							this.inst.set_bbox_changed();
							mirrorSwitch=true;
						}
						break;
					case 2:
					case 4:
						if(parentMirror !== this.parentMirror){
							this.inst.width = this.childMirror>0?-this.inst.width:Math.abs(this.inst.width);
							this.childMirror *= -1;
							this.parentMirror *= -1;
							this.inst.set_bbox_changed();
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
			if(this.pinObject.height != 0){
				var childFlip = (this.inst.height/Math.abs(this.inst.height));
				var parentFlip = (this.pinObject.height/Math.abs(this.pinObject.height));
				switch(this.pinFlip){
					case 1:
					case 3:
						if(parentFlip !== childFlip){
							this.inst.height = Math.abs(this.inst.height)*parentFlip;
							this.inst.set_bbox_changed();
							flipSwitch=true;
						}
						break;
					case 2:
					case 4:
						if(parentFlip !== this.parentFlip){
							this.inst.height = this.childFlip>0?-this.inst.height:Math.abs(this.inst.height);
							this.childFlip *= -1;
							this.parentFlip *= -1;
							this.inst.set_bbox_changed();
							flipSwitch=true;
						}
						break;
					default:
						break;
				}
			}
		}
		/*if (this.pinMirrorAngle !== 0 )
		{
			if(this.pinObject.width != 0){
				var childMirror = (this.inst.width/Math.abs(this.inst.width));
				var parentMirror = (this.pinObject.width/Math.abs(this.pinObject.width));
				
				if(parentMirror !== childMirror || mirrorSwitch){
					var pa = this.inst.angle;
					var a = cr.angleDiff(pa, cr.to_radians(90));
					if(pa<cr.to_radians(270) && pa>cr.to_radians(90))this.inst.angle -= a*2;
					else this.inst.angle += a*2;
					
					this.inst.set_bbox_changed();
				}
			}
		}
		if (this.pinFlipAngle !== 0 )
		{		
			if(this.pinObject.height != 0){
				var childFlip = (this.inst.height/Math.abs(this.inst.height));
				var parentFlip = (this.pinObject.height/Math.abs(this.pinObject.height));
				
				if(parentFlip !== childFlip || flipSwitch){
					var pa = this.inst.angle;
					var a = cr.angleDiff(pa, 0);
					if(pa<cr.to_radians(180) && pa>0)this.inst.angle -= a*2;
					else this.inst.angle += a*2;
					
					this.inst.set_bbox_changed();
				}
			}
		}*/
		
	};
	
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": this.type.name,
			"properties": [
				{"name": "Is pinned", "value": !!this.pinObject, "readonly": true},
				{"name": "Pinned UID", "value": this.pinObject ? this.pinObject.uid : 0, "readonly": true}
			]
		});
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.IsPinned = function ()
	{
		return !!this.pinObject;
	};
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Pin = function (obj, mode_)
	{
		if (!obj)
			return;
			
		var otherinst = obj.getFirstPicked(this.inst);
		//console.log(this);
		//console.log(otherinst);
		//console.log(cr);
		if (!otherinst)
			return;
			
		this.pinObject = otherinst;
		
		var objx = this.pinImagepoint===0?this.pinObject.x:this.pinObject.getImagePoint(this.pinImagepoint, true);
		var objy = this.pinImagepoint===0?this.pinObject.y:this.pinObject.getImagePoint(this.pinImagepoint, false);
		
		this.pinAngle = cr.angleTo(objx, objy, this.inst.x, this.inst.y) - otherinst.angle;
		this.pinDist = cr.distanceTo(objx, objy, this.inst.x, this.inst.y);
		this.myStartAngle = this.inst.angle;
		this.lastKnownAngle = this.inst.angle;
		this.theirStartAngle = otherinst.angle;
		this.mode = mode_;
		
		this.pinWidthRelative = this.inst.width-this.pinObject.width;
		this.pinHeightRelative = this.inst.height-this.pinObject.height;
		this.pinScaleRelativeX = this.inst.width/this.pinObject.width;
		this.pinScaleRelativeY = this.inst.height/this.pinObject.height;
		this.pinOriginalWidth = this.pinObject.width;
		this.pinOriginalHeight = this.pinObject.height;
		this.childMirror = (this.inst.width/Math.abs(this.inst.width));
		this.parentMirror = (this.pinObject.width/Math.abs(this.pinObject.width));
		this.childFlip = (this.inst.height/Math.abs(this.inst.height));
		this.parentFlip = (this.pinObject.height/Math.abs(this.pinObject.height));
		
		this.pinned = true;
	};
	
	Acts.prototype.Unpin = function ()
	{
		this.pinObject = null;
		this.pinned = false;
	};
	
	Acts.prototype.pinX = function (choice_)
	{
		this.x = choice_;
	};
	Acts.prototype.pinY = function (choice_)
	{
		this.y = choice_;
	};
	Acts.prototype.pinZindex = function (choice_)
	{
		this.zIndex = choice_;
	};
	Acts.prototype.pinAngle = function (choice_)
	{
		this.angle = choice_;
	};
	Acts.prototype.pinWidth = function (choice_)
	{
		this.width = choice_;
	};
	Acts.prototype.pinHeight = function (choice_)
	{
		this.height = choice_;
	};
	Acts.prototype.pinOpacity = function (choice_)
	{
		this.opacity = choice_;
	};
	Acts.prototype.pinVisibility = function (choice_)
	{
		this.visibility = choice_;
	};
	Acts.prototype.pinCollisionEnabled = function (choice_)
	{
		this.collisions = choice_;
	};
	Acts.prototype.pinHotspotX = function (choice_)
	{
		this.hotspotX = choice_;
	};
	Acts.prototype.pinHotspotY = function (choice_)
	{
		this.hotspotY = choice_;
	};
	Acts.prototype.pinImagepoint = function (choice_)
	{
		this.pinImagepoint = choice_;
	};
	Acts.prototype.pinAnimation = function (choice_)
	{
		this.pinAnimation = choice_;
	};
	Acts.prototype.pinFrame = function (choice_)
	{
		this.pinFrame = choice_;
	};
	Acts.prototype.pinMirror = function (choice_)
	{
		this.pinMirror = choice_;
	};
	Acts.prototype.pinFlip = function (choice_)
	{
		this.pinFlip = choice_;
	};
	Acts.prototype.pinDestroy = function (choice_)
	{
		this.pinDestroy = choice_;
	};
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.PinnedUID = function (ret)
	{
		ret.set_int(this.pinObject ? this.pinObject.uid : -1);
	};
	
	Exps.prototype.isPinnedX = function (ret)
	{
		ret.set_int(this.pinObject ? this.x : -1);
	};
	Exps.prototype.isPinnedY = function (ret)
	{
		ret.set_int(this.pinObject ? this.y : -1);
	};
	Exps.prototype.isPinnedZindex = function (ret)
	{
		ret.set_int(this.pinObject ? this.zIndex : -1);
	};
	Exps.prototype.isPinnedAngle = function (ret)
	{
		ret.set_int(this.pinObject ? this.angle : -1);
	};
	Exps.prototype.isPinnedWidth = function (ret)
	{
		ret.set_int(this.pinObject ? this.width : -1);
	};
	Exps.prototype.isPinnedHeight = function (ret)
	{
		ret.set_int(this.pinObject ? this.height : -1);
	};
	Exps.prototype.isPinnedOpacity = function (ret)
	{
		ret.set_int(this.pinObject ? this.opacity : -1);
	};
	Exps.prototype.isPinnedVisibility = function (ret)
	{
		ret.set_int(this.pinObject ? this.visibility : -1);
	};
	Exps.prototype.isPinnedCollisionEnabled = function (ret)
	{
		ret.set_int(this.pinObject ? this.collisions : -1);
	};
	Exps.prototype.isPinnedTimescale = function (ret)
	{
		ret.set_int(this.pinObject ? this.timescale : -1);
	};
	Exps.prototype.isPinnedHotspotX = function (ret)
	{
		ret.set_int(this.pinObject ? this.hotspotX : -1);
	};
	Exps.prototype.isPinnedHotspotY = function (ret)
	{
		ret.set_int(this.pinObject ? this.hotspotY : -1);
	};	
	Exps.prototype.PinnedImagepoint = function (ret)
	{
		ret.set_int(this.pinObject ? this.pinImagepoint : -1);
	};
	Exps.prototype.isPinnedAnimation = function (ret)
	{
		ret.set_int(this.pinObject ? this.pinAnimation : -1);
	};
	Exps.prototype.isPinnedFrame = function (ret)
	{
		ret.set_int(this.pinObject ? this.pinFrame : -1);
	};	
	Exps.prototype.isPinnedMirror = function (ret)
	{
		ret.set_int(this.pinObject ? this.pinMirror : -1);
	};	
	Exps.prototype.isPinnedFlip = function (ret)
	{
		ret.set_int(this.pinObject ? this.pinFlip : -1);
	};	
	Exps.prototype.isPinnedDestroy = function (ret)
	{
		ret.set_int(this.pinObject ? this.pinDestroy : -1);
	};	
	
	behaviorProto.exps = new Exps();
	
}());