"use strict";

{
	C3.Plugins.CBhash.Acts =
	{
		set_hexoutput(format)
		{
			if (format == 0)
				this.hexcase = 0;
			else
				this.hexcase = 1;
		},
		
		set_bpad(charac)
		{
			this.b64pad = charac;	
		},
		
		MD5_hash(string, format)
		{
			var outF = format;
			if (outF == 0) 
				this.lastResult = this.hex_md5(string);
			else
				this.lastResult = this.b64_md5(string);		
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		MD5_pass(string, encoding)
		{	
			this.lastResult = this.any_md5(string, encoding);
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMAC_hash(key, data, Format)
		{
			if (Format == 0) 
				this.lastResult = this.hex_hmac_md5(key, data);
			else
				this.lastResult = this.b64_hmac_md5(key, data);			
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMAC_pass(key, data, charString)
		{
			this.lastResult = this.any_hmac_md5(key, data, charString);
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		

		SHA1_hash(string, format)
		{
			var outF = format;
			if (outF == 0) 
				this.lastResult = this.hex_sha1(string);
			else
				this.lastResult = this.b64_sha1(string);		
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		SHA1_pass(string, encoding)
		{	
			this.lastResult = this.any_sha1(string, encoding);
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACSHA1_hash(key, data, Format)
		{
			if (Format == 0) 
				this.lastResult = this.hex_hmac_sha1(key, data);
			else
				this.lastResult = this.b64_hmac_sha1(key, data);			
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACSHA1_pass(key, data, charString)
		{
			this.lastResult = this.any_hmac_sha1(key, data, charString);
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},


		SHA256_hash(string, format)
		{
			var outF = format;
			if (outF == 0) 
				this.lastResult = this.hex_sha256(string);
			else
				this.lastResult = this.b64_sha256(string);		
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		SHA256_pass(string, encoding)
		{	
			this.lastResult = this.any_sha256(string, encoding);
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACSHA256_hash(key, data, Format)
		{
			if (Format == 0) 
				this.lastResult = this.hex_hmac_sha256(key, data);
			else
				this.lastResult = this.b64_hmac_sha256(key, data);			
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACSHA256_pass(key, data, charString)
		{
			this.lastResult = this.any_hmac_sha256(key, data, charString);
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		}

	};
}