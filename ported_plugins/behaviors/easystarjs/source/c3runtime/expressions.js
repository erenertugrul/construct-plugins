"use strict";

{
	C3.Behaviors.EasystarTilemap.Exps =
	{
		PathLength(tag)
		{
			if(this.paths[tag] && this.paths[tag].length)
				return(this.paths[tag].length);
			else
				return(0);
		},

		NodeTileXAt(tag, index)
		{
			if(this.paths[tag] && this.paths[tag][index])
				return(this.paths[tag][index].x);
			else
				return(0);
		},

		NodeTileYAt(tag, index)
		{
			if(this.paths[tag] && this.paths[tag][index])
				return(this.paths[tag][index].y);
			else
				return(0);
		},

		NodeLayoutXAt(tag, index)
		{
			if(this.paths[tag] && this.paths[tag][index]){
				return (this.paths[tag][index].x * this.inst.GetSdkInstance().GetTileWidth() + this.inst.GetWorldInfo().GetX() + this.inst.GetSdkInstance().GetTileWidth() / 2);
			}
			else
				return(0);
		},

		NodeLayoutYAt(tag, index)
		{
			if(this.paths[tag] && this.paths[tag][index]){
				return (this.paths[tag][index].y * this.inst.GetSdkInstance().GetTileHeight() + this.inst.GetWorldInfo().GetY() + this.inst.GetSdkInstance().GetTileHeight() / 2);
			}
			else
				return(0);
		},

		CurrentTag()
		{
			return(this.curTag);
		},

		NodeCostAt(tag, index)
		{
			if(this.paths[tag] && this.paths[tag][index])
				return(this.paths[tag][index].cost);
			else
				return(0);
		},

		PathCost(tag)
		{
			if(this.paths[tag] && this.paths[tag].length)
				return(this.paths[tag][this.paths[tag].length-1].cost);
			else
				return(0);
		},

		TileCostAt(x_, y_)
		{
			var pointsToCost = this.easystarjs["getPointsToCost"]();
			
			if (pointsToCost[y_] === undefined || pointsToCost[y_][x_]) {
					var tileID = this.inst.GetSdkInstance().GetTileAt(x_, y_) & 0x1FFFFFFF; //düzenle
					var acceptableTiles = this.easystarjs["getAcceptableTiles"]();
					var walkable = false;
					for (var i = 0; i < acceptableTiles.length; i++) {
						if (tileID === acceptableTiles[i]) {
							walkable = true;
							break;
						}
					}
					if(walkable){
						var costMap = this.easystarjs["getCostMap"]();
						return(costMap[tileID]);
					}
					else{
						return(Number.MAX_SAFE_INTEGER); // No cost found (should not happen), default to a maximum cost value
					}
			}
			else{
					return(pointsToCost[y_][x_]);
			}
		}
	
	};
}