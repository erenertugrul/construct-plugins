"use strict";

{
	C3.Plugins.eren_requestreview.Acts =
	{
		postreview()
		{
			var self = this;
			var callback = function (hata, sonuc){
				
			    if (hata){
			    	self.result = hata;
			        self.Trigger(C3.Plugins.eren_requestreview.Cnds.onError);
			    }
			    else{
			    	self.result = sonuc;
			    	self.Trigger(C3.Plugins.eren_requestreview.Cnds.onView);
			    }
			}
			if (this._runtime.IsCordova()){
				this.cordova["plugins"]["RequestReview"]["postreview"](callback);
			}
		},
		postwrite(appid)
		{
			var self = this;
			var callback = function (hata, sonuc){
				
			    if (hata){
			    	self.result = hata;
			        self.Trigger(C3.Plugins.eren_requestreview.Cnds.onError);
			    }
			    else{
			    	self.result = sonuc;
			    	self.Trigger(C3.Plugins.eren_requestreview.Cnds.onPage);
			    }
			}
			if (this._runtime.IsCordova()){
				this.cordova["plugins"]["RequestReview"]["postwrite"](appid,callback);
			}
		}
	};
}




