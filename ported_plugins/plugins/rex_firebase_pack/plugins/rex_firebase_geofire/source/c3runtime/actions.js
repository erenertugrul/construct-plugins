"use strict";

{
	C3.Plugins.Rex_Firebase_Geofire.Acts =
	{
	    SetSubDomainRef(ref)
	    {
	        this.rootpath = ref + "/";
	      
	    },  
	     
	    SetLocation(itemID, lat, lng)
	    {
	        this.setValue(itemID, [lat, lng]);
	    },  
	     
	    OnDisconnectedRemove(itemID)
	    {
	        var geo = this.getGeo();
	        geo["ref"]()["child"](itemID)["onDisconnect"]()["remove"]();
	    },
	     
	    RemoveItem(itemID)
	    {
	        this.setValue(itemID, null);
	    },
	     
	    GetItem(itemID)
	    {
	        this.getValue(itemID);
	    },     
	         
	    OnDisconnectedCancel(itemID)
	    {
	        var geo = this.getGeo();
	        geo["ref"]()["child"](itemID)["onDisconnect"]()["cancel"]();
	    },
	    
	    MonitorAt(lat, lng, r)
	    {
	        this.queryStart(lat, lng, r);
	    },  
	     
	    MonitorStop()
	    {
	        this.queryStop();
	    }  
    
	};
}