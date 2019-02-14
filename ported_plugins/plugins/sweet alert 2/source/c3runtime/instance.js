"use strict";
var _swal = window["swal"];
var _$ = window["$"];
{
	C3.Plugins.SweetAlert.Instance = class SweetAlertInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties

	        /////////////////////////////////////
	        this["open"] = 0;
	        this["tag"] = "";
	        this["lastValue"] = "";
	        this["lastValueAt"] = [];
	        this["array"] = [];
	        this["count"] = 0;
			
			if (properties)		// note properties may be null in some cases
			{
			   	this.error = {
		    		"text": properties[0],
		    		"email": properties[1],
		    		"password": properties[2],
		    		"number": properties[3],
		    		"url": properties[4],
		            "radio": properties[5],
		            "progress": properties[6]
    			};
		        this.style = {
		            "position": this.getType(-1, properties[7]),
		            "background": properties[8],
		            "color": properties[9],
		            "width": properties[10],
		            "reverse": properties[11] ? false : true,
		            "cancel": properties[12],
		            "confirm": properties[13]
        		};
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
	    getType(type, position) 
	    {
	        if (type != -1) {
	            switch (type) {
	                case 0:
	                    return "";
	                case 1:
	                    return "success";
	                case 2:
	                    return "error";
	                case 3:
	                    return "warning";
	                case 4:
	                    return "info";
	                case 5:
	                    return "question";
	            };
	        } else {
	            switch (position) {
	                case 0:
	                    return "top";
	                case 1:
	                    return "top-left";
	                case 2:
	                    return "top-right";
	                case 3:
	                    return "center";
	                case 4:
	                    return "center-left";
	                case 5:
	                    return "center-right";
	                case 6:
	                    return "bottom";
	                case 7:
	                    return "bottom-left";
	                case 8:
	                    return "bottom-right";
	            };
	        };
    	}

	    email (email_) 
	    {
	    	var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	    	return regex.test(email_);
    	}
    	
    	url (url_) 
    	{
	    	var regex = /^(https?|http?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
	    	return regex.test(url_);
    	}
	};
}