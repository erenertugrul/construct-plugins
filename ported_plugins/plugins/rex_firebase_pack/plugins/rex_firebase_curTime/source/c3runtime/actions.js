"use strict";

{
	C3.Plugins.Rex_Firebase_CurTime.Acts =
	{

	    SetDomainRef(domain_ref, sub_domain_ref) {
	        this.rootpath = domain_ref + "/" + sub_domain_ref + "/";
	    },

	    Start(userID) {
	        this.timestamp_ref = this.get_ref(userID);
	        var self = this;
	        setInterval(function () {
	            self.UpdatingTimestamp();
	        }, self.updatingPeriod);
	    },

	    Stop() {
	        this.timestamp_ref = null;
	        this.lastServerTimestamp = null;
	    }

	};
}