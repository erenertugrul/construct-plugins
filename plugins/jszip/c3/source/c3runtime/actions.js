"use strict";

{
	C3.Plugins.eren_jszip.Acts =
	{
		CreateNewZipFile()
		{
			this.newJSZip();
		},
		ReadZipFile(zipfile,options) 
		{
			this.ReadZipFile(zipfile);
		},
		CloseZipFile() 
		{
			this.Trigger(C3.Plugins.eren_jszip.Cnds.OnClosedZip,this);
		},
		FileAddString(dir,name,data) 
		{
			this.FileAddString(dir,name,data);
		},
		FileAddtoUrl(n,d) 
		{
			this.FileAddtoUrl(n,d);
		},
		SpriteAdd(obj)
		{

			var inst = obj.GetFirstPicked();
			var self = this;
			var a = "";
			if (inst) {
				const b = inst.GetCurrentImageInfo();
				b.ExtractImageToCanvas().then((b) => {
					var c = b.toDataURL("image/png");		
					a = c.substr(22);
					self.zip["file"]("n.png",a,{base64: true});
					self.Trigger(C3.Plugins.eren_jszip.Cnds.OnAddedSprite,self);
				}); 
			};
					
					//this.Trigger(C3.Plugins.eren_jszip.Cnds.OnAddedFile,this);
			
		},
		DownloadZipFile(filename,tip,le) 
		{
			var self = this;
			var tt =[
			    "blob",
			    "binarystring",
			    "array",
			    "uint8array",
			    "arraybuffer",
			    "base64",
			    "nodebuffer"
			]
			var l = [0,1,2,3,4,5,6,7,8,9];
			if (l[le] == 0)
				var s ="STORE";
			else
				var s = "DEFLATE";
			this.zip.generateAsync({type:tt[tip],compression:s,compressionOptions:{level:l[le]}})
			.then(function(content) {
			    // see FileSaver.js
			    //saveAs(content, filename+".zip");
			    saveAs(content, filename);
			    self.Trigger(C3.Plugins.eren_jszip.Cnds.OnDownloadedZip,self);
			});	
		},
		DirectoryCreate(dir) 
		{
			this.DirectoryCreate(dir);
		},
		FilechooserAdd(n,d) 
		{
			this.FilechooserAdd(n,d);
		},
		RemoveFileorDir(name) 
		{
			this.RemoveFileorDir(name);
		},
		WriteZipFile(filename,le) 
		{
			var self = this;

			var l = [0,1,2,3,4,5,6,7,8,9];
			if (l[le] == 0)
				var s ="STORE";
			else
				var s = "DEFLATE";
			this.zip.generateAsync({type:"nodebuffer",compression:s,compressionOptions:{level:l[le]}})
			.then(function(content) {
				fs["writeFileSync"](filename, content, {"encoding": "utf8"});
			    self.Trigger(C3.Plugins.eren_jszip.Cnds.OnWritedFile,self);
			});	
		},
		FileRead(n,d) 
		{
			this.FileRead(n,d);
		},
		ExtractZipFile(zipfile,dirname,dirpath) 
		{
			this.ExtractZipFile(zipfile,dirname);
		}
	};
}