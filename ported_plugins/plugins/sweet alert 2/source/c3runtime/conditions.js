"use strict";

{
	C3.Plugins.SweetAlert.Cnds =
	{

	    OnOpen() 
	    {
	        return true;
	    },

	    OnClose() 
	    {
	        return true;
	    },

	    OnTimeOut(tag_) 
	    {
	        return C3.equalsNoCase(tag_, this["tag"]);
	    },

	    OnCancel(tag_) 
	    {
	        return C3.equalsNoCase(tag_, this["tag"]);
	    },

	    OnConfirm(tag_) 
	    {
	        return C3.equalsNoCase(tag_, this["tag"]);
	    },

	    IsOpen() 
	    {
	        return this.open;
	    }

	};
}