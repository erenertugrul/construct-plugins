"use strict";

{
	var base64_link ="";
	C3.Plugins.erenertugrul_base64_image.Acts =
	{
		file_64(url)
		{
			var self = this;
			var blob = url["startsWith"]('blob');
			if (blob == true){
				var xhr = new XMLHttpRequest(); 
				xhr.open("GET", url); 
				xhr.responseType = "blob";
				function analyze_data(blob)
				{
				    var myReader = new FileReader();
				    myReader.readAsDataURL(blob)
				    
				    myReader.addEventListener("loadend", function(e)
				    {
				        var buffer = e.srcElement.result;
						base64_link = buffer;
						self.Trigger(C3.Plugins.erenertugrul_base64_image.Cnds.on_base64);
				    });
				}

				xhr.onload = function() 
				{
				    analyze_data(xhr.response);
				}
				xhr.send();
			}
		},
		sprite_base64(obj)
		{
			var c = null;
			const e = obj.GetFirstPicked();
			if (e) {
				const b = e.GetCurrentImageInfo();
				b && b.ExtractImageToCanvas().then((b) => {
					c = b.toDataURL("image/png");
					base64_link = c;
					this.Trigger(C3.Plugins.erenertugrul_base64_image.Cnds.on_base64);

				}); 
			}
		}
	};
}