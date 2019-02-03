"use strict";

{
	var image_link = "";
	var delete_hash ="";
	var any_error ="";
	//var this = this;

	C3.Plugins.imgur_upload.Acts =
	{
		url_upload(url)
		{
			const request = async () => {
			    const response = await fetch("https://api.imgur.com/3/image",{
											method: "POST",
											mode: "cors",
											headers: {
											"Authorization": "Client-ID "+this.client_id
											},
											body: urll
										});
				const json = await response["json"]();
				if (json.status == "200"){
					image_link = json["data"]["link"];
					delete_hash = json["data"]["deletehash"];
					await this.TriggerAsync(C3.Plugins.imgur_upload.Cnds.on_url_upload)
				}
				else{
					any_error = json["data"]["error"];
					await this.TriggerAsync(C3.Plugins.imgur_upload.Cnds.error_upload);
				}
			}
			var urll = "";
			var basecheck = url["startsWith"]('data');
			if (basecheck == true){
				urll = url.substring(22,url.length);
				request();
			}
			else{
				var blob = url["startsWith"]('blob');
				if(blob == true){
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
								urll = buffer.substring(22,buffer.length);
								request();
						    });
						}

						xhr.onload = function() 
						{
						    analyze_data(xhr.response);
						}
						xhr.send();

				}
				else{
					urll = url;
					request();
				}
			} 
		},
		sp_upload(obj)
		{
			var c = null;
			var im = null;
			const e = obj.GetFirstPicked();
			if (e) {
				const b = e.GetCurrentImageInfo();
				b && b.ExtractImageToCanvas().then((b) => {
					c = b.toDataURL("image/png");
					im = c.substring(22,c.length);
					const request = async () => {
					    const response = await fetch("https://api.imgur.com/3/image",{
													method: "POST",
													mode: "cors",
													headers: {
													"Authorization": "Client-ID "+this.client_id
													},
													body: im
												});
						const json = await response["json"]();
						if (json.status == "200"){
							image_link = json["data"]["link"];
							delete_hash = json["data"]["deletehash"];
							await this.TriggerAsync(C3.Plugins.imgur_upload.Cnds.on_url_upload)
						}
						else{
							any_error = json["data"]["error"];
							await this.TriggerAsync(C3.Plugins.imgur_upload.Cnds.error_upload);
						}
					}
				request()
				});
			}
		},
		img_delete(url)		
		{
			const request = async () => {
				const response = await fetch('https://api.imgur.com/3/image/'+url, {
											method: 'DELETE',
											mode: "cors",
											headers: {
											  "Authorization": "Client-ID "+this.client_id
											}
										});
				const r = await response;
				if (r.status == "200"){
					await this.TriggerAsync(C3.Plugins.imgur_upload.Cnds.on_delete);
				}
				else{
			  		any_error = "Unauthorized";
			  		await this.TriggerAsync(C3.Plugins.imgur_upload.Cnds.error_delete);
				}
			}
			request()
		}
	};
}
