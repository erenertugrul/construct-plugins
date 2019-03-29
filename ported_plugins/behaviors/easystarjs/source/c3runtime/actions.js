"use strict";

{
	C3.Behaviors.EasystarTilemap.Acts =
	{

		ForceCalculate()
		{
			this.easystarjs["calculate"]();
		},

		FindPath(x_, y_, x2_, y2_, tag_)
		{
			this.doPathingRequest(tag_, x_, y_, x2_, y2_);
		},

		SetWalkableTiles(list)
		{
			var splittedList = list.split(';');
			var arr = splittedList.map(function(value){
			    	return parseInt(value, 10);
			});
			if(this.emptyWalkable)
				arr.push(-1 & 0x1FFFFFFF); //TILE_ID_MASK from the Tilemap runtime, add empty tile as an acceptable tile
			this.easystarjs["setAcceptableTiles"](arr);
		},

		SetDiagonal(disabled)
		{
			if(disabled)
				this.easystarjs["disableDiagonals"]();
			else
				this.easystarjs["enableDiagonals"]();
		},

		SetTileCost(tileID, cost)
		{
			this.easystarjs["setTileCost"](tileID, cost);
		},

		AddObstacle(x_, y_)
		{
			this.easystarjs["avoidAdditionalPoint"](x_, y_);
		},

		RemoveObstacle(x_, y_)
		{
			this.easystarjs["stopAvoidingAdditionalPoint"](x_, y_);
		},

		RemoveAllObstacles()
		{
			this.easystarjs["stopAvoidingAllAdditionalPoints"]();
		},

		SetIterationsPerCalculation(iterations)
		{
			this.easystarjs["setIterationsPerCalculation"](iterations < 0 ? Number.MAX_VALUE : iterations);
		},
		CancelPendingPath()
		{
			this.easystarjs["clearInstanceList"]();
		},

		SetEmptyTileWalkable(nonWalkable)
		{
			var tiles = this.easystarjs["getAcceptableTiles"]();
			var index = tiles.indexOf(-1 & 0x1FFFFFFF); //TILE_ID_MASK from the Tilemap runtime
			if(nonWalkable){
				this.emptyWalkable = false;
				if(index !== -1){
					tiles.splice(index, 1);
					this.easystarjs["setAcceptableTiles"](tiles);
				}
			}
			else{
				this.emptyWalkable = true;
				if(index === -1){
					tiles.push(-1 & 0x1FFFFFFF); //TILE_ID_MASK from the Tilemap runtime
					this.easystarjs["setAcceptableTiles"](tiles);
				}
			}
		},
		
		SetCostAt(x_, y_, cost)
		{
			this.easystarjs["setAdditionalPointCost"](x_, y_, cost);
		},
		
		RemoveCostAt(x_, y_)
		{
			this.easystarjs["removeAdditionalPointCost"](x_, y_);
		},
		
		RemoveAllCosts(x_, y_)
		{
			this.easystarjs["removeAllAdditionalPointCosts"]();
		},
		
		SetCornerCutting(disabled)
		{
			if(disabled)
				this.easystarjs["disableCornerCutting"]();
			else
				this.easystarjs["enableCornerCutting"]();
		},
		
		BeginDirectionalConditions(x_, y_)
		{
			this.currentTileDC = {x: x_, y: y_};
			this.currentDC = [];
		},
		
		AddDirectionalCondition(direction)
		{
			var easystarDirection = '';
			
			switch(direction){
				case 0 :
					easystarDirection = EasyStar["TOP"];
					break;
				case 1 :
					easystarDirection = EasyStar["TOP_RIGHT"];
					break;
				case 2 :
					easystarDirection = EasyStar["RIGHT"];
					break;
				case 3 :
					easystarDirection = EasyStar["BOTTOM_RIGHT"];
					break;
				case 4 :
					easystarDirection = EasyStar["BOTTOM"];
					break;
				case 5 :
					easystarDirection = EasyStar["BOTTOM_LEFT"];
					break;
				case 6 :
					easystarDirection = EasyStar["LEFT"];
					break;
				case 7 :
					easystarDirection = EasyStar["TOP_LEFT"];
					break;
			}
			
			if(easystarDirection !== ''){
				if(!this.currentDC.indexOf(easystarDirection) !== -1){
					this.currentDC.push(easystarDirection);
				}
			}
		},
		
		EndDirectionalConditions()
		{
			if(this.currentTileDC){
				this.easystarjs.setDirectionalCondition(this.currentTileDC.x, this.currentTileDC.y, this.currentDC)
			}
		},
		
		ClearDirectionalConditions()
		{
			this.easystarjs.removeAllDirectionalConditions();
		}
	
	};
}