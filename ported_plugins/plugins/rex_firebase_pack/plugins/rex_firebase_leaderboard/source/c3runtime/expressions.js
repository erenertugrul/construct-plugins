"use strict";

{
	C3.Plugins.Rex_Firebase_Leaderboard.Exps =
	{
		CurPlayerName()
		{
		    var name;	    
		    if (this.exp_CurRankCol != null)
		        name = this.exp_CurRankCol["name"];
		    else
		        name = "";
		    
			return (name);
		}, 	
		CurPlayerScore()
		{
		    var score;	    
		    if (this.exp_CurRankCol != null)
		        score = this.exp_CurRankCol["score"];
		    else
		        score = 0;
		        	    
			return (score);
		},
		CurPlayerRank()
		{
			return (this.exp_CurPlayerRank);
		},
		CurUserID()
		{
		    var userID;	    
		    if (this.exp_CurRankCol != null)
		        userID = this.exp_CurRankCol["userID"];
		    else
		        userID = "";

			return (this.exp_CurRankCol["userID"]);
		}, 	
		CurExtraData()
		{
		    var extra_data = this.exp_CurRankCol["extra"];
		    if (extra_data == null)
		    {
		        extra_data = "";
		    }
		    else if (typeof(extra_data) == "object")
		    {
		        extra_data = JSON.stringify(extra_data);
		        this.exp_CurRankCol["extra"] = extra_data; 
		    }

			return (extra_data);
		},
		PostPlayerName()
		{
			return (this.exp_PostPlayerName);
		}, 	

		PostPlayerScore()
		{
			return (this.exp_PostPlayerScore);    
		}, 		
		PostPlayerUserID()
		{
			return (this.exp_PostPlayerUserID);    
		}, 	
					
		PostExtraData()
		{
			return (this.exp_PostExtraData);    
		},    
		
		RankCount()
		{
			return (this.ranks.GetItems().length);
		}, 	
		UserID2Rank(userID)
		{
		    var rank = this.ranks.GetItemIndexByID(userID);
		    if (rank == null)
		        rank = -1;    
			return (rank);
		},
		   	
		Rank2PlayerName(i)
		{
		    var rank_info = this.ranks.GetItems()[i];
		    var name = (!rank_info)? "":rank_info["name"];
			return (name);
		},
		Rank2PlayerScore(i)
		{
		    var rank_info = this.ranks.GetItems()[i];
		    var score = (!rank_info)? "":rank_info["score"];
			return (score);
		},	
		Rank2ExtraData(i)
		{
		    var rank_info = this.ranks.GetItems()[i];
		    var extra_data = (!rank_info)? "":rank_info["extra"];
			return (extra_data);
		},
		Rank2PlayerUserID(i)
		{
		    var rank_info = this.ranks.GetItems()[i];
		    var extra_data = (!rank_info)? "":rank_info["userID"];
			return (extra_data);
		},	

		LastUserID()
		{
			return (this.exp_LastUserID);
		},	    
		LastScore()
		{
			return (this.exp_LastScore);
		},		
		LastPlayerName()
		{
			return (this.exp_LastPlayerName);
		}		
	};
}