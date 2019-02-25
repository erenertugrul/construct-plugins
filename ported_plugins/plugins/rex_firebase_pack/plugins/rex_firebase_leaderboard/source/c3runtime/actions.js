"use strict";

{
	C3.Plugins.Rex_Firebase_Leaderboard.Acts =
	{
	 	SetDomainRef(ref, ID_)
		{
		    this.ranks.StopUpdate();
		    this.rootpath = ref + "/" + ID_ + "/";
		}, 
		
	    PostScore(userID, name, score, extra_data, post_cond)
		{
	        if (post_cond !== 0)
	        {
	            var self=this;
	            var onReadScore = function(snapshot)
	            {
	                var preScore = snapshot["val"]();
	                var doPosting;  
	                if (post_cond === 1)
	                    doPosting = (score > preScore);
	                else if (post_cond === 2)
	                    doPosting = (score < preScore);    
	                else if (post_cond === 3)
	                    doPosting = (preScore == null) ;                     
	                
	                if (doPosting)
	                    self.post_score(userID, name, score, extra_data);
	                else
	                {
	                    self.onPostComplete.call(self, false, userID, name, preScore, extra_data);
	                }
	            };
	            var ref = this.get_ref()["child"](userID)["child"]("score");        
		        ref["once"]("value", onReadScore)
	        }
	        else
	        {
	            this.post_score(userID, name, score, extra_data);
	        }
		}, 
		
	    UpdateAllRanks()
		{
		    this.update_ranks(-1);
		},	
	      
	    UpdateTopRanks(count)
		{	    
		    this.update_ranks(count);
		},
		
	    RemovePost(userID)
		{	    
		    var ref = this.get_ref();
		    ref["child"](userID)["remove"]();
		},	
		      
	    StopUpdating()
		{
	        this.ranks.StopUpdate();
		},
	    
	    AddScore(userID, name, scoreAddTo, extra_data)
		{
	        extra_data = get_extraData(extra_data);

		    var self = this;
		    var on_complete = function(error, committed, snapshot) 
		    {
	            var val = snapshot["val"]();
	            self.onPostComplete.call(self, error, userID, name, val["score"], extra_data);
	        };

	        var on_transaction = function (currentValue)
	        {
	            var old_score = (currentValue == null)? 0: currentValue["score"];
	            var new_score = old_score + scoreAddTo;
	            var save_data = {"name":name, 
	                                       "score":new_score, 
	                                       "extra": extra_data,
	                                       "updateAt": serverTimeStamp()
	                                      };
	            var priority = (self.ranking_order == 0)? new_score:-new_score;
	            return { '.value': save_data, '.priority': priority };
	        };
	        var ref = this.get_ref();        
		    ref["child"](userID)["transaction"](on_transaction, on_complete);		
		},    

	    GetScore(userID)
		{
	        var self=this;
	        var onReadUserID = function(snapshot)
	        {
				var userData = snapshot["val"]();
	            if (userData)
				{
					self.exp_LastUserID = userID;
					self.exp_LastScore = userData["score"];
					self.exp_LastPlayerName = userData["name"];
				}
				else
				{
					self.exp_LastUserID = "";
					self.exp_LastScore = 0;
					self.exp_LastPlayerName = "";
				}
	            self.Trigger(C3.Plugins.Rex_Firebase_Leaderboard.Cnds.OnGetScore);			
	        };
			var ref = this.get_ref()["child"](userID);
			ref["once"]("value", onReadUserID);
		}  
	};
}