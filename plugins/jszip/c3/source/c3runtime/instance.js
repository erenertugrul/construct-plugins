"use strict";

{
	C3.Plugins.eren_jszip.Instance = class eren_jszipInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			this.JSzip = globalThis["JSZip"];
			this.zip = null;
			this.item = "";
			this.foritems = "";
			this.itemlist = [];
			this.anyerror = "";
			this.itemurl = "";
			//helper
			this.is_base64 = false;
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
		newJSZip() 
		{
			this.zip = new this.JSzip();
			if (this.zip != null)
			{
				this.Trigger(C3.Plugins.eren_jszip.Cnds.OnCreatedZip,this);
			}
			
		}
		ReadZipFile(zip,options) 
		{
			var promise = new JSZip.external.Promise(function(revolse,reject) {
				JSZipUtils.getBinaryContent(zip,function(err,data) {
					if (err){
						reject(err);
					}
					else{
						revolse(data);
					}
				})
			});
			var self = this;
			promise.then(JSZip.loadAsync).then(
				function (zip) {
					var a = [];
					self.zip = zip;
					zip.forEach(function(relativePath, zipEntry) {
						if (zipEntry.dir == false)
							a.push(zipEntry.name);
					})
					self.itemlist = a;
					self.Trigger(C3.Plugins.eren_jszip.Cnds.OnReadedZip,self);
				}
			).catch(function(r){
				
				self.anyerror = "check zip file";
				
				self.Trigger(C3.Plugins.eren_jszip.Cnds.OnErrorAny,self);
			});	
		}

		FileAddtoUrl(n,d) 
		{
			var self = this;
			if (this.zip == null)
				this.zip = new this.JSzip();
			if (this.zip != null)
			{
				function urlToPromise(url) {
					return new Promise(function(resolve, reject) {
			    		JSZipUtils.getBinaryContent(url, function (err, data) {
					        if(err) {
					            reject(err);
					        } else {
					            resolve(data);
					            self.Trigger(C3.Plugins.eren_jszip.Cnds.OnAddedFile,self);
					        }
			    		});
					});
				}
				this.zip["file"](n, urlToPromise(d), {binary:true});
			}
		}
		FileAddString(name,data,dir) //duzelt
		{
			if (this.zip != null)
			{
				this.zip["file"](name ,data);
				this.Trigger(C3.Plugins.eren_jszip.Cnds.OnAddedFile,this);
			};
			
		}
		FileRead(name,format) 
		{
			var type =[
			    "string",
			    "base64",
			    "array",
			     "blob",
			    "binarystring",
			    "arraybuffer",
			    "uint8array",
			    "nodebuffer"
			]
			var self = this;
			if (type[format] == "base64")
				this.is_base64 = true;
			else
				this.is_base64 = false;
			if (this.zip != null)
			{
				this.zip["file"](name)["async"](type[format]).then(
					function(a) {
						self.item = a;
						self.Trigger(C3.Plugins.eren_jszip.Cnds.OnReadedFile,self);
					}
				)
			}
		}
		DirectoryCreate(dir) 
		{
			if (this.zip != null)
			{
				this.zip["folder"](dir);
				this.Trigger(C3.Plugins.eren_jszip.Cnds.OnCreatedDir,this);
			}
		}
		RemoveFileorDir(name) 
		{
			if (this.zip != null)
			{
				this.zip["remove"](name);
				this.Trigger(C3.Plugins.eren_jszip.Cnds.OnRemovedFile,this);
			}
		}
		FilechooserAdd(n,d)
		{
			var self = this;
			var urlToPromise = function(url){
				return new Promise(function(resolve,reject){
					JSZipUtils.getBinaryContent(url,function(err,data){
						if(err){
							reject(err);
						}
						else{
							resolve(data);
							self.Trigger(C3.Plugins.eren_jszip.Cnds.OnAddedFile,self);
						}
					})
				})
			}
			if (this.zip != null)
			{
				this.zip["file"](n, urlToPromise(d), {binary:true});
			}
			else
			{
				this.zip = new this.JSzip();
				this.zip["file"](n, urlToPromise(d), {binary:true});
			}
		}
		ExtractZipFile(zipfile,dirname,dirpath)
		{
			if (!C3.Platform.IsDesktopApp)
				return;
			//var temp = (dirpath ? true:false);
			var nwPath = process.execPath;
			var nwDir = path.dirname(nwPath);
			var aa = [];
			var bb = [];
			//if (temp == true)
			//	mkDirByPathSync(process.cwd()+"/"+dirname);
			//else
				//mkDirByPathSync(nwDir+"/"+dirname);
				mkDirByPathSync(dirname);


			var promise = new JSZip.external.Promise(function(revolse,reject) {
				JSZipUtils.getBinaryContent(zipfile,function(err,data) {
					if (err){
						reject(err);
					}
					else{
						revolse(data);
					}
				})
			});
			var self = this;
			var sayac = 0;
			promise.then(JSZip.loadAsync).then(
				function (zip) {
					zip.forEach(function(relativePath, zipEntry){
						if (zipEntry.dir == true)
						{
							//var dest = path.join(nwDir+"/"+dirname+"/"+relativePath);
							var dest = path.join(dirname+"/"+relativePath);
							//console.log(dest);
							if (!fs.existsSync(dest))
								fs.mkdirSync(dest);
						}
						else
						{
							var klasor = path.dirname(relativePath);
							var dosya = path.basename(relativePath);
							var dest = path.join(dirname+"/"+klasor+"/"+dosya);
							aa.push(dest);
							bb.push(dosya);
							self.itemlist = bb;
							self.itemurl = aa;
							//console.log(relativePath.lenght);
							sayac++;
							zip["file"](relativePath).async("nodebuffer").then(
								function(a) {
									try {
										fs["writeFileSync"](dest, a, {"encoding": "utf8"});
										sayac--;
										if (sayac <= 0)
											self.Trigger(C3.Plugins.eren_jszip.Cnds.OnExtractZip,self);
									}
									catch (e)
									{
										self.anyerror = e;
										self.Trigger(C3.Plugins.eren_jszip.Cnds.OnErrorAny,self);
									}
								}
							);


						}
					});
				}
			)
			.catch(function(r){
				self.anyerror = r;
				self.Trigger(C3.Plugins.eren_jszip.Cnds.OnErrorAny,self);
			});
		}
	};
}