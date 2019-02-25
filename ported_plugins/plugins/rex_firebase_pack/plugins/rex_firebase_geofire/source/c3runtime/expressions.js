"use strict";

{
	C3.Plugins.Rex_Firebase_Geofire.Exps =
	{
	    GenerateKey()
	    {
	        var ref = this.get_ref()["push"]();
	        this.exp_LastGeneratedKey = ref["key"];
	        return (this.exp_LastGeneratedKey);
	    },  
	    
	    LastGeneratedKey()
	    {
	        return (this.exp_LastGeneratedKey);
	    },   
	    
	    LastItemID()
	    {
	        return (this.exp_LastItemID);
	    },
	    
	    LastLatitude()
	    {
	        var lat = (this.exp_LastLocation)? this.exp_LastLocation[0]:0;
	        return (lat);
	    },
	    
	    LastLongitude()
	    {
	        var lng = (this.exp_LastLocation)? this.exp_LastLocation[1]:0;
	        return (lng);
	    },        
	  
	    LastDistance()
	    {
	        return (this.exp_LastDistance);
	    },

	    CurItemID()
	    {
	        return (this.exp_CurItemID);
	    },    

	    CurLatitude()
	    {
	        var lat = (this.exp_CurItemContent)? this.exp_CurItemContent[0][0] : 0;
	        return (lat);
	    },    

	    CurLongitude()
	    {
	        var lng = (this.exp_CurItemContent)? this.exp_CurItemContent[0][1] : 0;
	        return (lng);
	    },    

	    CurDistance()
	    {
	        var d = (this.exp_CurItemContent)? this.exp_CurItemContent[1] : 0;
	        return (d);
	    },        
	    
	    MonitorLatitude()
	    {
	        var lat = (this.geoQuery)? this.geoQuery["center"]()[0]:0;
	        return (lat);
	    },
	    
	    MonitorLongitude()
	    {
	        var lng = (this.geoQuery)? this.geoQuery["center"]()[1]:0;
	        return (lng);
	    },     
	    
	    MonitorRadius()
	    {
	        var r = (this.geoQuery)? this.geoQuery["radius"]():0;
	        return (r);
	    },    
	    Distance(latA, lngA, latB, lngB)
	    {
	        var d = window["GeoFire"]["distance"]([latA, lngA], [latB, lngB]);
	        return (d);
	    } 
	};
}