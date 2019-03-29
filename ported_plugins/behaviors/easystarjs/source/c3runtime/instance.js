"use strict";

{
	C3.Behaviors.EasystarTilemap.Instance = class EasystarTilemapInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			this.inst = this._inst;
			const b = this._runtime.Dispatcher();
			this._disposables = new C3.CompositeDisposable(C3.Disposable.From(b, "instancedestroy", (a) => this._OnInstanceDestroyed(a.instance)));
			
			this.easystarjs = new EasyStar["js"]();
			this.paths = {};
			this.curTag = "";
			this.baseSetTileAt = this.inst.SetTileAt;
			var arr = [];
			if (properties)
			{
				if(properties[0] === 0)
					this.easystarjs["enableDiagonals"]();
				else
					this.easystarjs["disableDiagonals"]();

				if(properties[1] < 0)
					this.easystarjs["setIterationsPerCalculation"](Number.MAX_VALUE);
				else
					this.easystarjs["setIterationsPerCalculation"](properties[1]);

				if(properties[2] === 0)
					this.emptyWalkable = true;
				else
					this.emptyWalkable = false;
				
				if(properties[3] === 0)
					this.easystarjs["enableCornerCutting"]();
				else
					this.easystarjs["disableCornerCutting"]();
				
				if(properties[4] === 0)
					this.easystarjs["disableSync"]();
				else
					this.easystarjs["enableSync"]();
			}
			if(this.emptyWalkable)
				arr.push(-1 & 0x1FFFFFFF); //TILE_ID_MASK from the Tilemap runtime, add empty tile as an acceptable tile
			this.easystarjs["setAcceptableTiles"](arr);
			// Opt-in to getting calls to Tick()
			this._StartTicking();
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"paths" : this.paths,
				"acceptableTiles" : this.easystarjs["getAcceptableTiles"](),
				"costMap" : this.easystarjs["getCostMap"](),
				"pointsToAvoid" : this.easystarjs["getPointsToAvoid"](),
				"diagonalsEnabled" : this.easystarjs["getDiagonalsEnabled"](),
				"emptyWalkable" : this.emptyWalkable,
				"cornerCuttingEnabled" : this.easystarjs["getAllowCornerCutting"](),
				"pointsToCost" : this.easystarjs["getPointsToCost"](),
				"directionalConditions" : this.easystarjs["getDirectionalConditions"]()
			};
		}
		LoadFromJson(o)
		{
			this.paths = o["paths"];

			var tilegrid = createArray(this.inst.GetSdkInstance().GetMapHeight(), this.inst.GetSdkInstance().GetMapWidth());

			var baseFunction = this.inst.GetSdkInstance().SetTileAt;

			this.inst.setTileAt = function (x_, y_, t_)
			{
				x_ = Math.floor(x_);
				y_ = Math.floor(y_);
				
				if (x_ < 0 || y_ < 0 || x_ >= this.inst.GetSdkInstance().GetMapWidth() || y_ >= this.inst.GetSdkInstance().GetMapHeight())
					return -1;

				tilegrid[y_][x_] = t_ & 0x1FFFFFFF; //TILE_ID_MASK from the Tilemap runtime
				baseFunction(x_, y_, t_);
			}
			fillGridFromTilemap(tilegrid, this.inst);
			this.easystarjs["setGrid"](tilegrid);
			this.easystarjs["setAcceptableTiles"](o["acceptableTiles"]);
			this.easystarjs["setCostMap"](o["costMap"]);
			this.easystarjs["setPointsToAvoid"](o["pointsToAvoid"]);
			if(o["diagonalsEnabled"])
				this.easystarjs["enableDiagonals"]();
			else
				this.easystarjs["disableDiagonals"]();
			this.curTag = "";
			this.emptyWalkable = o["emptyWalkable"];
			if(o["cornerCuttingEnabled"])
				this.easystarjs["enableCornerCutting"]();
			else
				this.easystarjs["disableCornerCutting"]();
			this.easystarjs["setPointsToCost"](o["pointsToCost"]);
			this.easystarjs["setDirectionalConditions"](o["directionalConditions"]);
		
		}
		
		GetDebuggerProperties()
		{

		}

		isTileWalkable(x, y, sourceX, sourceY) 
		{
			// Taken from EasyStarJS helpers section, and modified
			var collisionGrid = this.easystarjs["getGrid"]();
			var acceptableTiles = this.easystarjs["getAcceptableTiles"]();
			
			if(!acceptableTiles || !collisionGrid || x < 0 || y < 0 || sourceX < 0 || sourceY < 0 || x > collisionGrid[0].length - 1 || y > collisionGrid.length - 1 || sourceX > collisionGrid[0].length - 1 || sourceY > collisionGrid.length - 1)
				return false;
			
			if(sourceX && sourceY){
				if(Math.abs(sourceX - x) > 1 || Math.abs(sourceY - y) > 1)
					return false;
				var directionalConditions = this.easystarjs["getDirectionalConditions"]();
				var directionalCondition = directionalConditions &&  directionalConditions[y] && directionalConditions[y][x];
				if (directionalCondition) {
					var direction = calculateDirection(sourceX - x, sourceY - y);
					var directionIncluded = function () {
						for (var i = 0; i < directionalCondition.length; i++) {
							if (directionalCondition[i] === direction) return true;
						}
						return false;
					};
					if (!directionIncluded()) return false;
				}
			}
			
			for (var i = 0; i < acceptableTiles.length; i++) {
				if (collisionGrid[y][x] === acceptableTiles[i]) {
					return true;
				}
			}
			return false;
		}
		doPathingRequest(tag_, x_, y_, x2_, y2_)
		{
			if(!this.easystarjs["collisionGrid"]){
				var tilegrid = createArray(this.inst.GetSdkInstance().GetMapHeight(), this.inst.GetSdkInstance().GetMapWidth());
				

				var baseFunction;

				if(this.baseSetTileAt === null)
					baseFunction = this.inst.GetSdkInstance().SetTileAt;
				else
					baseFunction = this.baseSetTileAt;

				var tilemapInst = this.inst;
				tilemapInst.setTileAt = function (x_, y_, t_)
				{
					x_ = Math.floor(x_);
					y_ = Math.floor(y_);
					
					
					if (x_ < 0 || y_ < 0 || x_ >= tilemapInst.GetSdkInstance().GetMapWidth() || y_ >= tilemapInst.GetSdkInstance().GetMapHeight())
						return -1;

					tilegrid[y_][x_] = t_ & 0x1FFFFFFF; //TILE_ID_MASK from the Tilemap runtime
					baseFunction.call(tilemapInst, x_, y_, t_);
				}
				fillGridFromTilemap(tilegrid, this.inst);
				this.easystarjs["setGrid"](tilegrid);
			}

			var self = this;
			
			var notFoundFunction = function(){
				self.curTag = tag_;
				delete self.paths[tag_];
				self.Trigger(C3.Behaviors.EasystarTilemap.Cnds.OnFailedToFindPath);
				self.Trigger(C3.Behaviors.EasystarTilemap.Cnds.OnAnyPathNotFound);
			};

			var foundFunction = function(path){
				self.curTag = tag_;
				self.paths[tag_] = path;
				self.Trigger(C3.Behaviors.EasystarTilemap.Cnds.OnPathFound);
				self.Trigger(C3.Behaviors.EasystarTilemap.Cnds.OnAnyPathFound);
			};
			
			if(x_ < 0 || y_ < 0 || x2_ < 0 || y2_ < 0 ||
			   x_ > this.inst.GetSdkInstance().GetMapWidth()-1 || x2_ > this.inst.GetSdkInstance().GetMapWidth()-1 ||
			   y_ > this.inst.GetSdkInstance().GetMapHeight()-1 || y2_ > this.inst.GetSdkInstance().GetMapHeight()-1)
				notFoundFunction();
			else
				this.easystarjs["findPath"](x_, y_, x2_, y2_, function(path){
					if (path === null) {
				        	notFoundFunction();
					} else {
				        	foundFunction(path);
					}
				});

		}
		
		Tick()
		{
			const wi = this._inst.GetWorldInfo();
			const dt = this._runtime.GetDt(this._inst);
			if(!this.easystarjs) return;
			if(!this.easystarjs["getGrid"]() ||
			    this.easystarjs["getGrid"]().length !== this.inst.GetSdkInstance().GetMapHeight() ||
			    this.easystarjs["getGrid"]()[0].length !== this.inst.GetSdkInstance().GetMapWidth())
			{
				var tilegrid = createArray(this.inst.GetSdkInstance().GetMapHeight(), this.inst.GetSdkInstance().GetMapWidth());
				var baseFunction;
				if(this.baseSetTileAt === null)
					baseFunction = this.inst.GetSdkInstance().SetTileAt;
				else
					baseFunction = this.baseSetTileAt;

				var tilemapInst = this.inst;

				tilemapInst.setTileAt = function (x_, y_, t_)
				{
					x_ = Math.floor(x_);
					y_ = Math.floor(y_);
					
					if (x_ < 0 || y_ < 0 || x_ >= tilemapInst.GetSdkInstance().GetMapWidth() || y_ >= tilemapInst.GetSdkInstance().GetMapHeight())
						return -1;

					tilegrid[y_][x_] = t_ & 0x1FFFFFFF; //TILE_ID_MASK from the Tilemap runtime
					baseFunction.call(tilemapInst, x_, y_, t_);
				}
				fillGridFromTilemap(tilegrid, this.inst);
				this.easystarjs["setGrid"](tilegrid);
			}

			this.easystarjs["calculate"]();
		}
		_OnInstanceDestroyed()
		{
			this.paths = {};
			this.inst.setTileAt = this.baseSetTileAt;
		}
		
	};
}

