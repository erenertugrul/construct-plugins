"use strict";

{
	C3.Plugins.Rex_SLGMovement.Exps =
	{
	    ChessUID()
	    {
	        return(this.exp_ChessUID);
	    },

	    TileUID()
	    {
	        return(node2uid(this.exp_CurTile));
	    },

	    BLOCKING()
	    {
	        return(prop_BLOCKING);
	    },

	    TileX()
	    {
	        return(node2lx(this.exp_CurTile));
	    },

	    TileY()
	    {
	        return(node2ly(this.exp_CurTile));
	    },

	    INFINITY()
	    {
	        return(prop_INFINITY);
	    },

	    UID2PathCost (chessUID) 
	    {
	        var tileUID = this.getTileUID(chessUID);
	        var c = this.uid2cost[tileUID];
	        if (c == null)
	            c = -1;
	        return(c);
	    },

	    NearestTileUID()
	    {
	        return(this.exp_NearestTileUID);
	    },

	    StartTileUID()
	    {
	        return(this.exp_StartTileUID);
	    },


	    PreTileUID()
	    {
	        return(node2uid(this.exp_PreTile));
	    },

	    PreTileX()
	    {
	        return(node2lx(this.exp_PreTile));
	    },

	    PreTileY()
	    {
	        return(node2ly(this.exp_PreTile));
	    },

	    PreTilePathCost()
	    {
	        return(node2pathcost(this.exp_PreTile));
	    },

	    StartX()
	    {
	        return(this.exp_StartX);
	    },

	    StartY()
	    {
	        return(this.exp_StartY);
	    },

	    EndTileUID()
	    {
	        return(this.exp_EndTileUID);
	    },

	    EndX()
	    {
	        return(this.exp_EndX);
	    },

	    EndY()
	    {
	        return(this.exp_EndY);
	    }
	};
}