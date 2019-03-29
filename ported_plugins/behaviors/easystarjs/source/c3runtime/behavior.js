function fillGridFromTilemap(grid, tilemap){
	var i, j;
	for(i = 0; i < grid.length; i++){
		for(j = 0; j < grid[i].length; j++){
			grid[i][j] = tilemap.GetSdkInstance().GetTileAt(j, i) & 0x1FFFFFFF;
		}
	}
}

function createArray(length) {
	var arr = new Array(length || 0),
	    i = length;

	if (arguments.length > 1) {
	        var args = Array.prototype.slice.call(arguments, 1);
		while(i--) arr[length-1 - i] = createArray.apply(this, args);
	}

	return arr;
}

/**
 * -1, -1 | 0, -1  | 1, -1
 * -1,  0 | SOURCE | 1,  0
 * -1,  1 | 0,  1  | 1,  1
 */
function calculateDirection(diffX, diffY) {
	// Taken from EasyStarJS helpers section
	if (diffX === 0 && diffY === -1) return EasyStar["TOP"];
	else if (diffX === 1 && diffY === -1) return EasyStar["TOP_RIGHT"];
	else if (diffX === 1 && diffY === 0) return EasyStar["RIGHT"];
	else if (diffX === 1 && diffY === 1) return EasyStar["BOTTOM_RIGHT"];
	else if (diffX === 0 && diffY === 1) return EasyStar["BOTTOM"];
	else if (diffX === -1 && diffY === 1) return EasyStar["BOTTOM_LEFT"];
	else if (diffX === -1 && diffY === 0) return EasyStar["LEFT"];
	else if (diffX === -1 && diffY === -1) return EasyStar["TOP_LEFT"];
	throw new Error('These differences are not valid: ' + diffX + ', ' + diffY);
};

"use strict";

{
	C3.Behaviors.EasystarTilemap = class EasystarTilemap extends C3.SDKBehaviorBase
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