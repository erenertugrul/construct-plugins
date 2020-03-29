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
			else{
				function toDataUrl(url, callback) {
				    var xhr = new XMLHttpRequest();
				    xhr.onload = function() {
				        var reader = new FileReader();
				        reader.onloadend = function() {
				            callback(reader.result);
				        }
				        reader.readAsDataURL(xhr.response);
				    };
				    xhr.open('GET', url);
				    xhr.responseType = 'blob';
				    xhr.send();
				};
				toDataUrl(url, function(b) {
				    console.log(b); // myBase64 is the base64 string
				    base64_link = b;
				    self.Trigger(C3.Plugins.erenertugrul_base64_image.Cnds.on_base64);
				});
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
			else{
				var l = this._runtime.GetMainRunningLayout().GetLayer(0);
				var a = this._runtime.CreateInstance(obj, l, -500, -500);
				var d = a.GetCurrentImageInfo();
					d && d.ExtractImageToCanvas().then((d) => {
					c = d.toDataURL("image/png");
					base64_link = c;
					this.Trigger(C3.Plugins.erenertugrul_base64_image.Cnds.on_base64);

				});

			}
		}
	};
}