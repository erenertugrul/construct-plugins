// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.eren_jszip = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.eren_jszip.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};
	var path = null;
    var fs = null;
	// https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync/40686853#40686853
	var  mkDirByPathSync = function(targetDir, { isRelativeToScript = false } = {}) {
	  const sep = path.sep;
	  const initDir = path.isAbsolute(targetDir) ? sep : '';
	  const baseDir = isRelativeToScript ? __dirname : '.';

	  return targetDir.split(sep).reduce((parentDir, childDir) => {
	    const curDir = path.resolve(baseDir, parentDir, childDir);
	    try {
	      fs.mkdirSync(curDir);
	    } catch (err) {
	      if (err.code === 'EEXIST') { // curDir already exists!
	        return curDir;
	      }

	      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
	      if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
	        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
	      }

	      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
	      if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
	        throw err; // Throw if it's just the last created dir.
	      }
	    }

	    return curDir;
	  }, initDir);
	}

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		if (this.runtime.isNWjs){
			fs = require('fs');
			path = require('path');
		}
		// Initialise object properties
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	instanceProto.onCreate = function()
	{
		
		// Read properties set in C3
		this.JSzip = window["JSZip"];
		this.zip = null;
		this.item = "";
		this.foritems = "";
		this.itemlist = [];
		this.anyerror = "";
		this.itemurl = "";
		//helper
		this.is_base64 = false;
	};
	
	instanceProto.saveToJSON = function ()
	{
		return {};
	};
	
	instanceProto.loadFromJSON = function (o)
	{
	};
	instanceProto.newJSZip = function() 
	{
		this.zip = new this.JSzip();
		if (this.zip != null)
		{
			this.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnCreatedZip,this);
		}
		
	};
	instanceProto.ReadZipFile = function (zip,options) 
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
				self.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnReadedZip,self);
			}
		).catch(function(r){
			
			self.anyerror = "check zip file";
			
			self.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnErrorAny,self);
		});	
	};
	
	instanceProto.FileAddtoUrl = function (n,d) 
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
				            self.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnAddedFile,self);
				        }
		    		});
				});
			}
			this.zip["file"](n, urlToPromise(d), {binary:true});
		}
	};
	instanceProto.FileAddString = function (name,data,dir) //duzelt
	{
		if (this.zip != null)
		{
			this.zip["file"](name ,data);
			this.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnAddedFile,this);
		};
		
	};
	instanceProto.FileRead = function (name,format) 
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
					self.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnReadedFile,self);
				}
			)
		}
	};
	instanceProto.DirectoryCreate = function (dir) 
	{
		if (this.zip != null)
		{
			this.zip["folder"](dir);
			this.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnCreatedDir,this);
		}
	};
	instanceProto.RemoveFileorDir = function (name) 
	{
		if (this.zip != null)
		{
			this.zip["remove"](name);
			this.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnRemovedFile,this);
		}
	};
	instanceProto.FilechooserAdd = function(n,d)
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
						self.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnAddedFile,self);
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
	};
	instanceProto.ExtractZipFile = function(zipfile,dirname,dirpath)
	{
		if (this.runtime.isNWjs != true)
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
										self.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnExtractZip,self);
								}
								catch (e)
								{
									self.anyerror = e;
									self.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnErrorAny,self);
								}
							}
						);


					}
				});
			}
		)
		.catch(function(r){
			self.anyerror = r;
			self.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnErrorAny,self);
		});
	};
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.OnCreatedZip = function ()
	{
		return true;
	};
	Cnds.prototype.OnDownloadedZip = function ()
	{
		return true;
	};
	Cnds.prototype.OnReadedZip = function() 
	{
		return true;
	};
	Cnds.prototype.OnAddedSprite = function() 
	{
		return true;
	};
	Cnds.prototype.OnReadedFile = function() 
	{
		return true;
	};
	Cnds.prototype.OnCreatedDir = function() 
	{
		return true;
	};
	Cnds.prototype.OnAddedFile = function() 
	{
		return true;
	};
	Cnds.prototype.OnErrorAny = function() 
	{
		return true;
	};
	Cnds.prototype.Foreachlist = function() 
	{
			
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
		
		this.foritems = "";
        this.foritemurl = "";
        var items = this.itemlist;
		var iurl = this.itemurl;
        var item_cnt = items.length;
        var i;
		for (i=0; i<item_cnt; i++ )
	    {
            if (solModifierAfterCnds)
		        this.runtime.pushCopySol(current_event.solModifiers);
                
            this.foritems = items[i];
			this.foritemurl = iurl[i];
		    current_event.retrigger();
		    	
            if (solModifierAfterCnds)
		    	this.runtime.popSol(current_event.solModifiers);
	   }        
		this.foritems = "";
		this.itemlist = [];
		this.foritemurl ="";
		this.itemurl = [];

	};
	Cnds.prototype.OnRemovedFile = function() 
	{
		return true;
	};
	Cnds.prototype.OnExtractZip = function() 
	{
		return true;
	};
	Cnds.prototype.OnWritedFile = function() 
	{
		return true;
	};
	Cnds.prototype.OnClosedZip = function() 
	{
		return true;
	};
	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};
	/// Setup Acts
	Acts.prototype.CreateNewZipFile = function ()
	{
		this.newJSZip();
	};
	Acts.prototype.ReadZipFile = function(zipfile,options) 
	{
		this.ReadZipFile(zipfile);
	};
	Acts.prototype.CloseZipFile = function() 
	{
		this.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnClosedZip,this);
	};
	Acts.prototype.FileAddString = function(dir,name,data) 
	{
		this.FileAddString(dir,name,data);
	};
	Acts.prototype.FileAddtoUrl = function(n,d) 
	{
		this.FileAddtoUrl(n,d);
	};
	Acts.prototype.SpriteAdd = function (obj)
	{
		var tokenat = function (text, index_, sep)
		{
			if (cr.is_string(text) && cr.is_string(sep))
			{
				var arr = text.split(sep);
				var i = cr.floor(index_);
				if (i < 0 || i >= arr.length)
					return("");
				else
					return(arr[i]);
			}
			else
				return("");
		};
		
		var inst = obj.getFirstPicked();
		if (inst)
		{
			try
			{
				var frame = inst.curFrame.webGL_texture;
				this.FileAddtoUrl(inst.type.name+".png",tokenat(frame.c2texkey,0,","));
				this.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnAddedSprite,this);
			}
			catch(e)
			{
				var frame = inst.type.texture_file;
				this.FileAddtoUrl(inst.type.name+".png",tokenat(frame,0,","));
				this.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnAddedSprite,this);
			}

			
		}
		
	};
	Acts.prototype.DownloadZipFile = function(filename,tip,le) 
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
		    self.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnDownloadedZip,self);
		});	
	};
	Acts.prototype.DirectoryCreate = function(dir) 
	{
		this.DirectoryCreate(dir);
	};
	Acts.prototype.FilechooserAdd = function(n,d) 
	{
		this.FilechooserAdd(n,d);
	};
	Acts.prototype.RemoveFileorDir = function(name) 
	{
		this.RemoveFileorDir(name);
	};
	Acts.prototype.WriteZipFile = function(filename,le) 
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
		    self.runtime.trigger(cr.plugins_.eren_jszip.prototype.cnds.OnWritedFile,self);
		});	
	};
	//Read Acts
	Acts.prototype.FileRead = function(n,d) 
	{
		this.FileRead(n,d);
	};
	Acts.prototype.ExtractZipFile = function(zipfile,dirname,dirpath) 
	{
		this.ExtractZipFile(zipfile,dirname);
	};
	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.item = function (ret)
	{
		if (this.is_base64 == true){
			var a = "data:image/png;base64,"
			ret.set_any(a+this.item);
		}
		else{
			ret.set_any(this.item);
		}
	};
	Exps.prototype.item_list = function (ret)
	{
		ret.set_string(this.foritems);
	};
	Exps.prototype.item_url = function (ret)
	{
		ret.set_string(this.foritemurl);
	};
	Exps.prototype.error = function (ret)
	{
		ret.set_string(this.anyerror);
	};
	
	pluginProto.exps = new Exps();

}());