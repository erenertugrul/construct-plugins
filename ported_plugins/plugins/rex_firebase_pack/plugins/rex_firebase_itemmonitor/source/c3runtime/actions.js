"use strict";
    var get_query = function (queryObjs)
    {
	    if (queryObjs == null)
	        return null;	        
        var query = queryObjs.GetFirstPicked();
        if (query == null)
            return null;
            
        return query.GetSdkInstance().GetQuery();
    };  
{
	C3.Plugins.Rex_Firebase_ItemMonitor.Acts =
	{
	    SetDomainRef(domain_ref, sub_domain_ref)
		{
			this.rootpath = domain_ref + "/" + sub_domain_ref + "/";
	        this.load_items = {};
		},
	    
	    StartMonitor()
		{
	        if (this.query == null)
	            this.query = this.get_ref();            
	        
	        this.StartMonitor(this.query, "all");
		},
	    
	    StopMonitor()
		{
		    this.StopMonitor(); 
		},       

	  
	    SetQueryObject(queryObjs, type_, cbName)
		{
		    this.StopMonitor();                 
	        this.query = get_query(queryObjs);
		}   
	};
}