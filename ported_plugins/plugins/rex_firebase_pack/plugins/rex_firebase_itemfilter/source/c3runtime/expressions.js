"use strict";

{
	C3.Plugins.Rex_Firebase_ItemFilter.Exps =
	{
	    CurItemID()
	    {
	        return (this.exp_CurItemID);
	    },
	    
	    ItemIDToJSON()
	    {
	        return (JSON.stringify(this.request_itemIDs));
	    },  

	    Equal(key_, value_)
	    {
	        var code_string;
	        if (arguments.length == 2)
	        {        
	            code_string = this.get_Equal_codeString(key_, value_);
	        }
	        else
	        {
	            var equals = [];
	            var i, cnt=arguments.length;
	            for (i=1; i<cnt; i++)
	            {
	                equals.push(this.get_Equal_codeString(key_, arguments[i]));
	            }
	            code_string = this.get_OR_codeString.apply(this, equals);
	        }
	        return (code_string);
	    },
	    
	    GreaterEqual(key_, value_)
	    {
	        return (this.get_GreaterEqual_codeString(key_, value_));
	    },
	    
	    LessEqual(key_, value_)
	    {
	        return (this.get_LessEqual_codeString(key_, value_));
	    },    
	    
	    InRange(key_, start_, end_)
	    {
	        return (this.get_InRange_codeString(key_, start_, end_));
	    },    

	    Greater(key_, value_)
	    {
	        var query_code_string = this.get_GreaterEqual_codeString(key_, value_);
	        var code_string = this.get_SUBVALUE_codeString(query_code_string, value_);
	        return (code_string);
	    },
	    
	    Less(key_, value_)
	    {
	        var query_code_string = this.get_LessEqual_codeString(key_, value_);
	        var code_string = this.get_SUBVALUE_codeString(query_code_string, value_);
	        return (code_string);
	    },       
	    
	    OR()
	    {
	        array_copy(ARGS_COPY, arguments, 0);
	        var code_string = this.get_OR_codeString.apply(this, ARGS_COPY);
	        return (code_string);
	    },     
	    
	    AND()
	    {
	        array_copy(ARGS_COPY, arguments, 0);
	        var code_string = this.get_AND_codeString.apply(this, ARGS_COPY);
	        return (code_string);
	    },    
	    
	    SUB()
	    {
	        array_copy(ARGS_COPY, arguments, 0);
	        var code_string = this.get_SUB_codeString.apply(this, ARGS_COPY);
	        return (code_string);
	    }     

	};
}