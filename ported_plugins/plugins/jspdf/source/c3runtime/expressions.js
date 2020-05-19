"use strict";

{
	C3.Plugins.jsPDF.Exps =
	{
		dataurl()
		{
			var myData = this.doc["output"]('dataurlstring');		
			return(myData);
		}
	};
}