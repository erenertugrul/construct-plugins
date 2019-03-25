"use strict";

{
	C3.Plugins.CBhash.Exps =
	{
		get_lastResult()
		{
			return (this.lastResult);
		},

		
		MD5(data)
		{
			return (this.hex_md5(data));
			
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
			
		},

		MD5B(data)
		{
			return (this.b64_md5(data));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
			
		},
		
		MD5pass(data, charstring)
		{
			return (this.any_md5(data, charstring));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACMD5(key, data)
		{
			return (this.hex_hmac_md5(key, data));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACMD5B(key, data)
		{
			return (this.b64_hmac_md5(key, data));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACMD5pass(key, data, charstring)
		{
			return (this.any_hmac_md5(key, data, charstring));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		
		SHA1(data)
		{
			return (this.hex_sha1(data));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},

		SHA1B(data)
		{
			return (this.b64_sha1(data));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		SHA1pass(data, charstring)
		{
			return (this.any_sha1(data, charstring));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACSHA1(key, data)
		{
			return (this.hex_hmac_sha1(key, data));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACSHA1B(key, data)
		{
			return (this.b64_hmac_sha1(key, data));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACSHA1pass(key, data, charstring)
		{
			return (this.any_hmac_sha1(key, data, charstring));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},

		
		SHA256(data)
		{
			return (this.hex_sha256(data));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},

		SHA256B(data)
		{
			return (this.b64_sha256(data));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		SHA256pass(data, charstring)
		{
			return (this.any_sha256(data, charstring));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACSHA256(key, data)
		{
			return (this.hex_hmac_sha256(key, data));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACSHA256B(key, data)
		{
			return (this.b64_hmac_sha256(key, data));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		},
		
		HMACSHA256pass(key, data, charstring)
		{
			return (this.any_hmac_sha256(key, data, charstring));
			this.Trigger(C3.Plugins.CBhash.Cnds.OnHashed);
		}
		
	};
}