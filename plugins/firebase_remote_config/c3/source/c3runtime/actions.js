"use strict";

{
	C3.Plugins.eren_firebase_remote.Acts =
	{
		getboolean(key)
		{
			var self = this;
			if (this._runtime.IsCordova())
			{
				eren_firebase_remote["plugins"]["firebase"]["config"]["update"](self.update_time)
				.then(function(){
					eren_firebase_remote["plugins"]["firebase"]["config"]["getBoolean"](key)
					.then(function(v){
						self.boolean = v;
						self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onBoolean);
					})
					.catch(function(e){
						self.booleanerror = e;
						self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onBooleanError);
					})
				})
				.catch(function(e){
					self.error = e;
					self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onError);
				})	
			}
		},
		getstring(key)
		{
			var self = this;
			if (this._runtime.IsCordova())
			{
				eren_firebase_remote["plugins"]["firebase"]["config"]["update"](self.update_time)
				.then(function(){
					eren_firebase_remote["plugins"]["firebase"]["config"]["getString"](key)
					.then(function(v){
						self.string = v;
						self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onString);
					})
					.catch(function(e){
						self.stringerror = e;
						self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onStringError);
					})
				})
				.catch(function(e){
					self.error = e;
					self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onError);
				})
			}
		},
		getnumber(key)
		{
			var self = this;
			if (this._runtime.IsCordova())
			{
				eren_firebase_remote["plugins"]["firebase"]["config"]["update"](self.update_time)
				.then(function(){
					eren_firebase_remote["plugins"]["firebase"]["config"]["getNumber"](key)
					.then(function(v){
						self.number = v;
						self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onNumber);
					})
					.catch(function(e){
						self.numbererror = e;
						self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onNumberError);
					})
				})
				.catch(function(e){
					self.error = e;
					self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onError);
				})
			}
		
		},
		getbytes(key)
		{
			var self = this;
			if (this._runtime.IsCordova())
			{
				eren_firebase_remote["plugins"]["firebase"]["config"]["update"](self.update_time)
				.then(function(){
					eren_firebase_remote["plugins"]["firebase"]["config"]["getBytes"](key)
					.then(function(v){
						self.bytes = v;
						self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onBytes);
					})
					.catch(function(e){
						self.byteserror = e;
						self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onBytesError);
					})
				})
				.catch(function(e){
					self.error = e;
					self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onError);
				})	
			}
		},
		setupdatetime(time)
		{
			var self = this;
			self.update_time = time * 60 ;
			if (this._runtime.IsCordova())
			{
				if (!self.devmode)
				{
					eren_firebase_remote["plugins"]["firebase"]["config"]["update"](self.update_time)
					.then()
					.catch(function(e){
						self.error = e;
						self.Trigger(C3.Plugins.eren_firebase_remote.Cnds.onError);
					})
				}
			}
		}
	};
}




