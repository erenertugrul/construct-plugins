"use strict";

{
	C3.Plugins.Rex_Firebase_Query.Acts =
	{
	 	SetDomainRef(ref)
		{
		    this.rootpath = ref + "/"; 
		}, 	
	    
	    CreateNewQuery(k)
		{
		    this.current_query = this.get_ref(k);
		},
		
	    OrderByKey()
		{
	        if (this.current_query === null)
	            this.current_query = this.get_ref();

		    this.current_query = this.current_query["orderByKey"]();
		},	
		
	    OrderByChild(child_name)
		{
	        if (this.current_query === null)
	            this.current_query = this.get_ref();
	            
		    this.current_query = this.current_query["orderByChild"](child_name);
		},	
		
	    OrderByPriority(child_name)
		{
	        if (this.current_query === null)
	            this.current_query = this.get_ref();
	            
		    this.current_query = this.current_query["orderByPriority"]();
		},		
		
	    OrderByValue()
		{
	        if (this.current_query === null)
	            this.current_query = this.get_ref();
	            
		    this.current_query = this.current_query["orderByValue"]();
		},		
	    
	    StartAt(v)
		{
	        if (this.current_query === null)
	            this.current_query = this.get_ref();
	            
		    this.current_query = this.current_query["startAt"](v);
		},	
		
	    EndAt(v)
		{
	        if (this.current_query === null)
	            this.current_query = this.get_ref();
	            
		    this.current_query = this.current_query["endAt"](v);
		},		
		
	    StartEndAt(v0, v1)
		{
	        if (this.current_query === null)
	            this.current_query = this.get_ref();
	            
		    this.current_query = this.current_query["startAt"](v0)["endAt"](v1);
		},		
		
	    EqualTo(v)
		{
	        if (this.current_query === null)
	            this.current_query = this.get_ref();
	            
		    this.current_query = this.current_query["equalTo"](v);
		},		
	    
	    LimitToFirst(l)
		{
	        if (this.current_query === null)
	            this.current_query = this.get_ref();
	            
		    this.current_query = this.current_query["limitToFirst"](l);
		},	
		
	    LimitToLast(l)
		{
	        if (this.current_query === null)
	            this.current_query = this.get_ref();
	            
		    this.current_query = this.current_query["limitToLast"](l);
		}	
	};
}