"use strict";

{
	C3.Plugins.Rex_Firebase_Leaderboard.Instance = class Rex_Firebase_LeaderboardInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties

		    
		    
		    
		    this.exp_CurRankCol = null;	    	    
		    this.exp_CurPlayerRank = -1;	
	        
		    this.exp_PostPlayerName = "";
	        this.exp_PostPlayerScore = 0;
	        this.exp_PostPlayerUserID = "";        
	        this.exp_PostExtraData = "";

			this.exp_LastUserID = "";
			this.exp_LastScore = 0;
			this.exp_LastPlayerName = "";	
				
			if (properties)		// note properties may be null in some cases
			{
			    this.rootpath = properties[0] + "/" + properties[1] + "/";
				this.ranking_order = properties[2];
 				this.ranks = this.create_ranks(properties[3]==1);
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				// data to be saved for savegames
			};
		}
		
		LoadFromJson(o)
		{
			// load state for savegames
		}

		get_ref(k)
		{
	        if (k == null)
		        k = "";
		    var path;
		    if (isFullPath(k))
		        path = k;
		    else
		        path = this.rootpath + k + "/";
	            
	        // 2.x
	        if (!isFirebase3x())
	        {
	            return new window["Firebase"](path);
	        }  
	        
	        // 3.x
	        else
	        {
	            var fnName = (isFullPath(path))? "refFromURL":"ref";
	            return window["Firebase"]["database"]()[fnName](path);
	        }
	        
		}
	    
		create_ranks(isAutoUpdate)
		{
		    var ranks = new window.FirebaseItemListKlass();
		    
		    ranks.updateMode = (isAutoUpdate)? ranks.AUTOCHILDUPDATE : ranks.MANUALUPDATE;
		    ranks.keyItemID = "userID";
		    
		    var self = this;
		    var on_update = function()
		    {
		        self.Trigger(C3.Plugins.Rex_Firebase_Leaderboard.Cnds.OnUpdate); 
		    };	    
		    ranks.onItemsFetch = on_update;
	        ranks.onItemAdd = on_update;
	        ranks.onItemRemove = on_update;
	        ranks.onItemChange = on_update;
	        
		    var onGetIterItem = function(item, i)
		    {
		        self.exp_CurRankCol = item;
		        self.exp_CurPlayerRank = i;
		    };
		    ranks.onGetIterItem = onGetIterItem; 
		           
	        return ranks;
	    }
		
	    update_ranks(count)
		{
		    var query = this.get_ref();
			if (count == -1)  // update all
			{
		         // no filter
			}
			else
			{
			    query = query["orderByPriority"]()["limitToFirst"](count);
			}
			
			this.ranks.StartUpdate(query);
		}
		
	 
	    post_score(userID, name, score, extra_data)
		{	    
	        extra_data = get_extraData(extra_data);

		    var self = this;
		    var onComplete = function(error) 
		    {
	            self.onPostComplete.call(self, error, userID, name, score, extra_data);
	        };
	        
	        var save_data = {"name":name, 
	                         "score":score, 
	                         "extra": extra_data,
	                         "updateAt": serverTimeStamp()
	                        };
	        var priority = (this.ranking_order == 0)? score:-score;
	        var ref = this.get_ref();        
		    ref["child"](userID)["setWithPriority"](save_data, priority, onComplete);
		}  

		onPostComplete(error, userID, name, score, extra_data) 
		{
		    this.exp_PostPlayerName = name;
	        this.exp_PostPlayerScore = score;
	        this.exp_PostPlayerUserID = userID;        
	        this.exp_PostExtraData = extra_data;             
		    var trig = (error)? C3.Plugins.Rex_Firebase_Leaderboard.Cnds.OnPostError:
		                        C3.Plugins.Rex_Firebase_Leaderboard.Cnds.OnPostComplete;
		    this.Trigger(trig); 
	    }   

	};
}