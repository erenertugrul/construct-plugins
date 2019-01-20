"use strict";

{
	C3.Plugins.SimpleQRScanner.Acts =
	{
		qrDecode()
		{
			var self = this;
			//var gizscan = window["cordova"]["plugins"]["gizscanqrcode"] minify support ?
			if (this._runtime.IsCordova()){
				cordova.plugins.gizscanqrcode.scan(
				{
					"baseColor": "#4e8dec",

					//bar
					"title": self.scanTitle,
					"barColor": "4e8dec",
					"statusBarColor": "white",

					//describe string
					"describe": self.scanDesc,
					"describeFontSize": "15",
					"describeLineSpacing": "8",
					"describeColor": "ffffff",

					//scan border
					"borderColor": "4e8dec",
					"borderScale": "0.6",              //(0.1 ~ 1)

					//choose photo button
					"choosePhotoEnable": "false",
					"choosePhotoBtnTitle": "Photo",
					"choosePhotoBtnColor": "4e8dec",

					//flashlight
					"flashlightEnable": "true"
					},
					function (result) {
						var inst = self;
						var myresg = result.toString().replace("{", "").replace("}", "").trim();
						var lines = myresg.split(",");
						var line_resultCode = "", line_result = "";

						if (lines[0].search("resultCode") > -1) {
							line_resultCode = lines[0]; // first line (resultCode)
							line_result = lines[1]; // second line (result)
						} else {
							line_result = lines[0]; // second line (resultCode)
							line_resultCode = lines[1]; // first line (result)
						}

						//alert(line_resultCode);
						var resultCode = parseInt(line_resultCode.split(":")[1]);
						//alert(resultCode);
						
						//alert(line_result);
						var myresvet = line_result.split(":");
						var myresquot = "";

						for (i = 1; i < myresvet.length; i++) {
							myresquot += myresvet[i].trim();

							if (i < myresvet.length-1) {
								myresquot += ":";
							}
						}
						var myres = myresquot.substr(1, myresquot.length-2).replace("\\", "");

						//alert(myres);

						inst.result = myres;

						var errorCode = resultCode;

						if (errorCode == 3) {
							inst.result = "";
							self.Trigger(C3.Plugins.SimpleQRScanner.Cnds.onDecodeCancel);
						} else {
							self.Trigger(C3.Plugins.SimpleQRScanner.Cnds.onDecoded);
						}
					},
					function (error) {
						var inst = self;
						var myresg = error.toString().replace("{", "").replace("}", "").trim();
						//alert(myresg);
						var lines = myresg.split(",");
						var line_resultCode = "", line_result = "";

						if (lines[0].search("resultCode") > -1) {
							line_resultCode = lines[0]; // first line (resultCode)
							line_result = lines[1]; // second line (result)
						} else {
							line_result = lines[0]; // first line (result)
							line_resultCode = lines[1]; // second line (resultCode)
						}

						//alert(line_resultCode);
						var resultCode = parseInt(line_resultCode.split(":")[1]);
						//alert(resultCode);
						
						//alert(line_result);
						var myresvet = line_result.split(":");
						var myresquot = "";

						for (i = 1; i < myresvet.length; i++) {
							myresquot += myresvet[i].trim();

							if (i < myresvet.length-1) {
								myresquot += ":";
							}
						}
						var myres = myresquot.substr(1, myresquot.length-2).replace("\\", "");

						var errorCode = resultCode;

						inst.result = "";

						//alert("Error: " + errorCode);
						if (errorCode == 0 || errorCode == 2) {
							self.Trigger(C3.Plugins.SimpleQRScanner.Cnds.onDecodeError);
						} else if (errorCode == 3) {
							self.Trigger(C3.Plugins.SimpleQRScanner.Cnds.onDecodeCancel);
						}
				});
			}
		}
	};
}




