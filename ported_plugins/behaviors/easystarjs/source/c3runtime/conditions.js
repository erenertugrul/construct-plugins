"use strict";

{
	C3.Behaviors.EasystarTilemap.Cnds =
	{
		OnPathFound(tag)
		{
			return C3.equalsNoCase(tag, this.curTag);
		},
		
		OnFailedToFindPath(tag)
		{
			return C3.equalsNoCase(tag, this.curTag);
		},

		OnAnyPathFound()
		{
			return true;
		},

		OnAnyPathNotFound()
		{
			return true;
		},
		
		IsTileWalkable(x_, y_)
		{
			return this.isTileWalkable(x_, y_);
		},
		
		IsTileWalkableFrom(x_, y_, sourceX, sourceY)
		{
			return this.isTileWalkable(x_, y_, sourceX, sourceY);
		}
	};
}