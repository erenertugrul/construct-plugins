"use strict";

{
	C3.Plugins.Rex_Firebase_Leaderboard.Cnds =
	{
		OnPostComplete()
		{
		    return true;
		}, 
		OnPostError()
		{
		    return true;
		}, 	 
		OnUpdate()
		{
		    return true;
		}, 	 
		ForEachRank(start, end)
		{	     
			return this.ranks.ForEachItem(this._runtime, start, end);
		},  	

		OnGetScore()
		{
		    return true;
		} 	
	};
}